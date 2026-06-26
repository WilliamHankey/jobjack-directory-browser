import { Injectable, computed, signal } from '@angular/core';
import { finalize, take } from 'rxjs';
import { DirectoryBrowserService } from '../data-access/directory-browser.service';
import {
  DirectoryStatus,
  FileSystemItem
} from '../models/directory-browser.models';

interface DirectoryState {
  currentPath: string | null;
  items: FileSystemItem[];
  endCursor: string | null;
  hasNextPage: boolean;
  pathHistory: string[];
  status: DirectoryStatus;
  errorMessage: string | null;
}

const initialState: DirectoryState = {
  currentPath: null,
  items: [],
  endCursor: null,
  hasNextPage: false,
  pathHistory: [],
  status: 'idle',
  errorMessage: null
};

@Injectable()
export class DirectoryBrowserStore {
  private readonly state = signal<DirectoryState>(initialState);

  readonly currentPath = computed(() => this.state().currentPath);
  readonly items = computed(() => this.state().items);
  readonly status = computed(() => this.state().status);
  readonly errorMessage = computed(() => this.state().errorMessage);
  readonly hasNextPage = computed(() => this.state().hasNextPage);
  readonly pathHistory = computed(() => this.state().pathHistory);

  readonly isInitialLoading = computed(() => this.status() === 'loading');
  readonly isLoadingMore = computed(() => this.status() === 'loadingMore');
  readonly isEmpty = computed(() => this.status() === 'empty');
  readonly hasError = computed(() => this.status() === 'error');

  readonly fileCount = computed(
    () => this.items().filter((item) => !item.isDirectory).length
  );

  readonly directoryCount = computed(
    () => this.items().filter((item) => item.isDirectory).length
  );

  readonly breadcrumbParts = computed(() => {
    const path = this.currentPath();

    if (!path) return [];

    return path
      .split('/')
      .filter(Boolean)
      .map((label, index, parts) => ({
        label,
        fullPath: '/' + parts.slice(0, index + 1).join('/'),
        isLast: index === parts.length - 1
      }));
  });

  constructor(private readonly directoryService: DirectoryBrowserService) {}

  loadDirectory(path: string | null, addToHistory = true): void {
    const previousPath = this.currentPath();

    this.patchState({
      currentPath: path,
      items: [],
      endCursor: null,
      hasNextPage: false,
      status: 'loading',
      errorMessage: null,
      pathHistory:
        addToHistory && previousPath
          ? [...this.state().pathHistory, previousPath]
          : this.state().pathHistory
    });

    this.directoryService
      .getDirectory(path, 50, null)
      .pipe(
        take(1),
        finalize(() => {
          if (this.status() === 'loading') {
            this.patchState({ status: 'success' });
          }
        })
      )
      .subscribe({
        next: (listing) => {
          const items = listing.edges.map((edge) => edge.node);

          this.patchState({
            currentPath: listing.currentPath,
            items,
            endCursor: listing.pageInfo.endCursor,
            hasNextPage: listing.pageInfo.hasNextPage,
            status: items.length > 0 ? 'success' : 'empty'
          });
        },
        error: (error) => {
          this.patchState({
            status: 'error',
            errorMessage: error.message ?? 'Could not load directory.'
          });
        }
      });
  }

  loadMore(): void {
    if (!this.state().hasNextPage || this.status() === 'loadingMore') return;

    this.patchState({
      status: 'loadingMore',
      errorMessage: null
    });

    this.directoryService
      .getDirectory(this.currentPath(), 50, this.state().endCursor)
      .pipe(take(1))
      .subscribe({
        next: (listing) => {
          const nextItems = listing.edges.map((edge) => edge.node);

          this.patchState({
            items: [...this.state().items, ...nextItems],
            endCursor: listing.pageInfo.endCursor,
            hasNextPage: listing.pageInfo.hasNextPage,
            status: 'success'
          });
        },
        error: (error) => {
          this.patchState({
            status: 'error',
            errorMessage: error.message ?? 'Could not load more items.'
          });
        }
      });
  }

  openItem(item: FileSystemItem): void {
    if (!item.isDirectory) return;

    this.loadDirectory(item.fullPath);
  }

  goBack(): void {
    const history = this.state().pathHistory;
    const previousPath = history.at(-1);

    if (!previousPath) return;

    this.patchState({
      pathHistory: history.slice(0, -1)
    });

    this.loadDirectory(previousPath, false);
  }

  private patchState(partialState: Partial<DirectoryState>): void {
    this.state.update((state) => ({
      ...state,
      ...partialState
    }));
  }
}
