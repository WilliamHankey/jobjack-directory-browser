import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DirectoryBrowserStore } from '../../state/directory-browser.store';
import { DirectoryBreadcrumbComponent } from '../../ui/directory-breadcrumb/directory-breadcrumb.component';
import { DirectoryMobileListComponent } from '../../ui/directory-mobile-list/directory-mobile-list.component';
import { DirectoryStatsComponent } from '../../ui/directory-stats/directory-stats.component';
import { DirectoryTableComponent } from '../../ui/directory-table/directory-table.component';
import { EmptyStateComponent } from '../../ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../ui/error-state/error-state.component';
import { LoadingStateComponent } from '../../ui/loading-state/loading-state.component';

@Component({
  selector: 'app-directory-browser-page',
  standalone: true,
  providers: [DirectoryBrowserStore],
  imports: [
    ButtonModule,
    CardModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    DrawerModule,
    ProgressSpinnerModule,
    DirectoryBreadcrumbComponent,
    DirectoryStatsComponent,
    DirectoryTableComponent,
    DirectoryMobileListComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  templateUrl: './directory-browser-page.component.html',
  styleUrl: './directory-browser-page.component.scss'
})
export class DirectoryBrowserPageComponent {
  readonly isDarkMode = signal(false);
  readonly isMobileMenuOpen = signal(false);

  constructor(readonly store: DirectoryBrowserStore) {
    this.store.loadDirectory(null, false);
  }

  toggleDarkMode(): void {
    this.isDarkMode.update((value) => !value);
    document.documentElement.classList.toggle('app-dark', this.isDarkMode());
  }
}
