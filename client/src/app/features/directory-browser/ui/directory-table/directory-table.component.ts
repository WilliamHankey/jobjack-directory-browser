import { DatePipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import 'iconify-icon';
import { FileSystemItem } from '../../models/directory-browser.models';
import {
  formatFileSize,
  getFileIcon,
  getItemSeverity
} from '../shared/file-system-item.utils.js';

@Component({
  selector: 'app-directory-table',
  standalone: true,
  imports: [DatePipe, TableModule, TagModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <p-table
      class="desktop-table"
      [value]="items()"
      [tableStyle]="{ 'min-width': '900px' }"
      [scrollable]="true"
      [paginator]="true"
      [rows]="5"
      [rowsPerPageOptions]="[5, 10, 25, 50, 100]"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
    >
      <ng-template pTemplate="header">
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Size</th>
          <th>Extension</th>
          <th>Created Date</th>
          <th>Permissions</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-item>
        <tr
          [class.clickable]="item.isDirectory"
          (click)="directorySelected.emit(item)"
        >
          <td>
            <div class="name-cell">
              <iconify-icon [attr.icon]="getFileIcon(item)" class="file-icon">
              </iconify-icon>
              <span>{{ item.name }}</span>
            </div>
          </td>

          <td>
            <p-tag [value]="item.type" [severity]="getItemSeverity(item)"></p-tag>
          </td>

          <td>{{ formatFileSize(item) }}</td>
          <td>{{ item.extension || '-' }}</td>
          <td>{{ item.createdAt | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
          <td>{{ item.permissions }}</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: `
    .name-cell {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .name-cell iconify-icon {
      font-size: 30px;
    }

    .clickable {
      cursor: pointer;
    }

    :host ::ng-deep .p-datatable-thead > tr > th {
      background: color-mix(in srgb, var(--app-card) 92%, white);
      color: #111827;
      font-weight: 700;
      padding: 16px 20px;
      border-color: var(--app-border);
    }

    :host ::ng-deep .p-datatable-tbody > tr > td {
      padding: 16px 20px;
      border-color: var(--app-border);
    }

    :host ::ng-deep .p-datatable-tbody > tr:hover {
      background: color-mix(in srgb, var(--app-card) 92%, white);
    }

    @media (max-width: 768px) {
      :host {
        display: none;
      }
    }
  `
})
export class DirectoryTableComponent {
  readonly items = input.required<FileSystemItem[]>();
  readonly directorySelected = output<FileSystemItem>();

  protected readonly formatFileSize = formatFileSize;
  protected readonly getFileIcon = getFileIcon;
  protected readonly getItemSeverity = getItemSeverity;
}
