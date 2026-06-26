export type FileSystemItemType = 'FILE' | 'DIRECTORY';

export interface FileSystemItem {
  name: string;
  fullPath: string;
  size: number;
  extension: string | null;
  createdAt: string;
  permissions: string;
  type: FileSystemItemType;
  isDirectory: boolean;
}

export interface DirectoryEdge {
  cursor: string;
  node: FileSystemItem;
}

export interface DirectoryListing {
  currentPath: string;
  totalReturned: number;
  edges: DirectoryEdge[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

export interface DirectoryListingResponse {
  directoryListing: DirectoryListing;
}

export interface BreadcrumbPart {
  label: string;
  fullPath: string;
  isLast: boolean;
}

export type DirectoryStatus =
  | 'idle'
  | 'loading'
  | 'loadingMore'
  | 'success'
  | 'empty'
  | 'error';
