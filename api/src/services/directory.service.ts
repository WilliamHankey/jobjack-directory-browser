import { lstat, opendir, readlink } from 'node:fs/promises';
import path from 'node:path';
import { assertSafePath } from '../utils/path-security.js';

type FileSystemItemType = 'FILE' | 'DIRECTORY';

type DirectoryItem = {
  name: string;
  fullPath: string;
  size: number;
  extension: string | null;
  createdAt: string;
  permissions: string;
  type: FileSystemItemType;
  isDirectory: boolean;
};

type DirectoryEdge = {
  cursor: string;
  node: DirectoryItem;
};

export class DirectoryServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DirectoryServiceError';
  }
}

function encodeCursor(index: number): string {
  return Buffer.from(String(index), 'utf8').toString('base64');
}

function decodeCursor(cursor?: string | null): number {
  if (!cursor) return -1;

  const decoded = Buffer.from(cursor, 'base64').toString('utf8');
  const parsed = Number(decoded);

  return Number.isFinite(parsed) ? parsed : -1;
}

function toPermissions(mode: number): string {
  return (mode & 0o777).toString(8);
}

function validatePageSize(first: number | undefined): number {
  if (first === undefined || first === null) {
    return 50;
  }

  if (!Number.isInteger(first) || first < 1) {
    throw new DirectoryServiceError(
      'Invalid page size: "first" must be a positive integer.'
    );
  }

  return Math.min(first, 200);
}

async function isSafeSymlink(entryPath: string): Promise<boolean> {
  const stats = await lstat(entryPath);

  if (!stats.isSymbolicLink()) {
    return true;
  }

  const linkTarget = path.resolve(path.dirname(entryPath), await readlink(entryPath));

  try {
    assertSafePath(linkTarget);
    return true;
  } catch {
    return false;
  }
}

async function readSortedEntries(safePath: string): Promise<DirectoryItem[]> {
  let dir;

  try {
    dir = await opendir(safePath);
  } catch {
    throw new DirectoryServiceError(`Directory not found: ${safePath}`);
  }

  const entries: DirectoryItem[] = [];

  for await (const dirent of dir) {
    const fullPath = path.join(safePath, dirent.name);

    if (!(await isSafeSymlink(fullPath))) {
      continue;
    }

    const stats = await lstat(fullPath);
    const isDirectory = stats.isDirectory();

    entries.push({
      name: dirent.name,
      fullPath,
      size: isDirectory ? 0 : stats.size,
      extension: isDirectory
        ? null
        : path.extname(dirent.name).replace('.', '') || null,
      createdAt: stats.birthtime.toISOString(),
      permissions: toPermissions(stats.mode),
      type: isDirectory ? 'DIRECTORY' : 'FILE',
      isDirectory
    });
  }

  return entries.sort((left, right) => {
    if (left.isDirectory !== right.isDirectory) {
      return left.isDirectory ? -1 : 1;
    }

    return left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
  });
}

export async function listDirectory(args: {
  path?: string;
  first: number;
  after?: string | null;
}) {
  const safePath = assertSafePath(args.path);
  const first = validatePageSize(args.first);
  const startIndex = decodeCursor(args.after) + 1;
  const sortedEntries = await readSortedEntries(safePath);
  const pageEntries = sortedEntries.slice(startIndex, startIndex + first);
  const hasNextPage = startIndex + first < sortedEntries.length;

  const edges: DirectoryEdge[] = pageEntries.map((node, offset) => ({
    cursor: encodeCursor(startIndex + offset),
    node
  }));

  return {
    currentPath: safePath,
    totalReturned: edges.length,
    edges,
    pageInfo: {
      hasNextPage,
      endCursor: edges.at(-1)?.cursor ?? null
    }
  };
}
