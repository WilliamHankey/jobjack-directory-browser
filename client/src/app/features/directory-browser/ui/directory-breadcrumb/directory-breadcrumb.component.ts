import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbPart } from '../../models/directory-browser.models';

@Component({
  selector: 'app-directory-breadcrumb',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="breadcrumb">
      <button
        pButton
        type="button"
        text
        icon="pi pi-arrow-left"
        [disabled]="!canGoBack()"
        (click)="back.emit()"
      ></button>

      <button
        pButton
        type="button"
        text
        icon="pi pi-home"
        (click)="home.emit()"
      ></button>

      @for (part of breadcrumbParts(); track part.fullPath) {
        <i class="pi pi-chevron-right"></i>

        @if (part.isLast) {
          <strong>{{ part.label }}</strong>
        } @else {
          <button
            pButton
            type="button"
            text
            class="breadcrumb-link"
            (click)="navigate.emit(part.fullPath)"
          >
            {{ part.label }}
          </button>
        }
      }
    </div>
  `,
  styles: `
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      padding: 4px 4px 24px;
      color: var(--app-muted);
      font-weight: 500;
    }

    .breadcrumb strong {
      color: var(--app-blue);
    }

    .breadcrumb-link {
      padding: 4px 6px;
    }
  `
})
export class DirectoryBreadcrumbComponent {
  readonly breadcrumbParts = input.required<BreadcrumbPart[]>();
  readonly canGoBack = input(false);

  readonly back = output<void>();
  readonly home = output<void>();
  readonly navigate = output<string>();
}
