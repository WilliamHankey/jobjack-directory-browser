import { DatePipe } from '@angular/common';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import 'iconify-icon';
import { FileSystemItem } from '../../models/directory-browser.models';
import {
  formatFileSize,
  getFileIcon,
  getItemSeverity
} from '../shared/file-system-item.utils.js';

@Component({
  selector: 'app-directory-mobile-list',
  standalone: true,
  imports: [DatePipe, ButtonModule, PaginatorModule, TagModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="mobile-list" [class.page-changing]="pageChanging()">
      @for (item of pagedItems(); track item.fullPath) {
        <article
          class="mobile-item"
          [class.clickable]="item.isDirectory"
          (click)="directorySelected.emit(item)"
        >
          <iconify-icon [attr.icon]="getFileIcon(item)" class="mobile-icon">
          </iconify-icon>

          <div class="mobile-info">
            <div class="mobile-title-row">
              <strong>{{ item.name }}</strong>
              <button pButton text icon="pi pi-ellipsis-v" class="item-menu"></button>
            </div>

            <div class="mobile-tag-row">
              <p-tag
                [value]="
                  item.isDirectory
                    ? 'Directory'
                    : (item.extension || 'File').replace('.', '').toUpperCase()
                "
                [severity]="getItemSeverity(item)"
              ></p-tag>
            </div>

            <p>
              {{ formatFileSize(item) }} ·
              {{ item.createdAt | date: 'MMM d, y h:mm a' }}
            </p>

            <span>{{ item.permissions }}</span>
          </div>
        </article>
      }
    </div>

    <p-paginator
      class="mobile-paginator"
      [first]="first()"
      [rows]="rows()"
      [totalRecords]="items().length"
      [rowsPerPageOptions]="[5, 10, 25, 50]"
      (onPageChange)="onPageChange($event)"
    ></p-paginator>
  `,
  styles: `
    .mobile-list,
    .mobile-paginator {
      display: none;
    }

    .mobile-list {
      transition:
        opacity 140ms ease,
        transform 140ms ease;
    }

    .mobile-list.page-changing {
      opacity: 0.35;
      transform: translateY(6px);
    }

    @media (max-width: 768px) {
      .mobile-list,
      .mobile-paginator {
        display: flex;
      }

      .mobile-list {
        flex-direction: column;
      }

      .mobile-item {
        display: grid;
        grid-template-columns: 40px 1fr;
        gap: 14px;
        padding: 18px 16px;
        border-bottom: 1px solid var(--app-border);
      }

      .mobile-icon {
        font-size: 34px;
        margin-top: 2px;
      }

      .mobile-info {
        min-width: 0;
      }

      .mobile-title-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      .mobile-title-row strong {
        font-size: 1rem;
        word-break: break-word;
      }

      .item-menu {
        width: 28px;
        height: 28px;
      }

      .mobile-tag-row {
        margin: 6px 0;
      }

      .mobile-info p {
        margin: 0 0 6px;
        color: #374151;
        font-size: 0.9rem;
      }

      .mobile-info span {
        color: var(--app-muted);
        font-size: 0.85rem;
      }

      .clickable {
        cursor: pointer;
      }
    }
  `
})
export class DirectoryMobileListComponent {
  readonly items = input.required<FileSystemItem[]>();
  readonly directorySelected = output<FileSystemItem>();

  protected readonly formatFileSize = formatFileSize;
  protected readonly getFileIcon = getFileIcon;
  protected readonly getItemSeverity = getItemSeverity;

  readonly first = signal(0);
  readonly rows = signal(10);
  readonly pageChanging = signal(false);

  readonly pagedItems = computed(() => {
    const start = this.first();
    return this.items().slice(start, start + this.rows());
  });

  onPageChange(event: PaginatorState): void {
    this.pageChanging.set(true);

    setTimeout(() => {
      this.first.set(event.first ?? 0);
      this.rows.set(event.rows ?? 10);

      setTimeout(() => {
        this.pageChanging.set(false);
      }, 80);
    }, 120);
  }
}
