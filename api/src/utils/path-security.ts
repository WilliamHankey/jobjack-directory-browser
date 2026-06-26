import path from 'node:path';

const ALLOWED_ROOT = path.resolve(process.env.ALLOWED_ROOT ?? '/app/shared');

export function assertSafePath(inputPath?: string): string {
  const requested = path.resolve(inputPath?.trim() || ALLOWED_ROOT);
  const relative = path.relative(ALLOWED_ROOT, requested);

  const isOutsideRoot =
    relative.startsWith('..') || path.isAbsolute(relative);

  if (isOutsideRoot) {
    throw new Error('Access denied: path is outside the allowed root.');
  }

  return requested;
}

export function getSafePath(inputPath?: string): string {
  return assertSafePath(inputPath);
}

export function getAllowedRoot(): string {
  return ALLOWED_ROOT;
}
