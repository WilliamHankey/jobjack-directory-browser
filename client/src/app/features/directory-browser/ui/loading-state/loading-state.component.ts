import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [ProgressSpinnerModule],
  template: `
    <div class="loading-box">
      <p-progressSpinner />
    </div>
  `,
  styles: `
    .loading-box {
      padding: 48px;
      display: flex;
      justify-content: center;
    }
  `
})
export class LoadingStateComponent {}
