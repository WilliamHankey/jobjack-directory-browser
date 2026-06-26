import { FileSystemItem } from '../../models/directory-browser.models';

export function formatFileSize(item: FileSystemItem): string {
  if (item.isDirectory) return '-';
  if (item.size < 1024) return `${item.size} B`;
  if (item.size < 1024 * 1024) return `${(item.size / 1024).toFixed(1)} KB`;
  if (item.size < 1024 * 1024 * 1024) {
    return `${(item.size / 1024 / 1024).toFixed(1)} MB`;
  }
  return `${(item.size / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

export function getFileIcon(item: FileSystemItem): string {
  if (item.isDirectory) return 'vscode-icons:default-folder';

  const ext = item.extension?.replace('.', '')?.toLowerCase();

  switch (ext) {
    case 'pdf':
      return 'vscode-icons:file-type-pdf2';
    case 'xlsx':
    case 'xls':
      return 'vscode-icons:file-type-excel';
    case 'docx':
    case 'doc':
      return 'vscode-icons:file-type-word';
    case 'png':
    case 'jpg':
    case 'jpeg':
      return 'vscode-icons:file-type-image';
    case 'ts':
      return 'vscode-icons:file-type-typescript';
    case 'js':
      return 'vscode-icons:file-type-js-official';
    case 'json':
      return 'vscode-icons:file-type-json';
    case 'txt':
      return 'vscode-icons:file-type-text';
    default:
      return 'vscode-icons:default-file';
  }
}

export function getItemSeverity(item: FileSystemItem): 'info' | 'success' {
  return item.isDirectory ? 'info' : 'success';
}
