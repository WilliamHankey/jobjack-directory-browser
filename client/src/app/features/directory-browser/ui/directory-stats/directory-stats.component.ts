import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-directory-stats',
  standalone: true,
  imports: [CardModule],
  template: `
    <p-card>
      <ng-template pTemplate="title">
        <div class="section-title">
          <i class="pi pi-folder-open"></i>
          <span>Current Path</span>
        </div>
      </ng-template>

      <p class="path">{{ currentPath() || 'Root' }}</p>
    </p-card>

    @if (showAllStats()) {
      <p-card>
        <ng-template pTemplate="title">Directory Statistics</ng-template>

        <div class="stat-row">
          <span>Total Items</span>
          <strong>{{ totalItems() }}</strong>
        </div>

        <div class="stat-row">
          <span>Files</span>
          <strong>{{ fileCount() }}</strong>
        </div>

        <div class="stat-row">
          <span>Directories</span>
          <strong>{{ directoryCount() }}</strong>
        </div>
      </p-card>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .path {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
      word-break: break-word;
    }

    .stat-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
    }

    .stat-row span {
      color: var(--app-muted);
    }
  `
})
export class DirectoryStatsComponent {
  readonly currentPath = input<string | null>(null);
  readonly totalItems = input(0);
  readonly fileCount = input(0);
  readonly directoryCount = input(0);
  readonly showAllStats = input(true);
}