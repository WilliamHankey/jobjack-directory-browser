import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `
    <div class="error-box">
      {{ message() }}
    </div>
  `,
  styles: `
    .error-box {
      margin: 20px;
      padding: 14px;
      border-radius: 12px;
      background: #fee2e2;
      color: #991b1b;
    }
  `
})
export class ErrorStateComponent {
  readonly message = input<string | null>('Something went wrong.');
}
