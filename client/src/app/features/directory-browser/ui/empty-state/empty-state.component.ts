import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-box">
      <p>This directory is empty.</p>
    </div>
  `,
  styles: `
    .empty-box {
      margin: 20px;
      padding: 24px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--app-card) 92%, white);
      color: var(--app-muted);
      text-align: center;
    }

    p {
      margin: 0;
    }
  `
})
export class EmptyStateComponent {}
