import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectoryBrowserPageComponent } from './directory-browser-page.component';
import { DirectoryBrowserStore } from '../../state/directory-browser.store';

describe('DirectoryBrowserPageComponent', () => {
  let component: DirectoryBrowserPageComponent;
  let fixture: ComponentFixture<DirectoryBrowserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectoryBrowserPageComponent],
      providers: [
        {
          provide: DirectoryBrowserStore,
          useValue: {
            loadDirectory: jasmine.createSpy('loadDirectory'),
            currentPath: () => null,
            items: () => [],
            breadcrumbParts: () => [],
            pathHistory: () => [],
            fileCount: () => 0,
            directoryCount: () => 0,
            isInitialLoading: () => false,
            hasError: () => false,
            isEmpty: () => false,
            hasNextPage: () => false,
            isLoadingMore: () => false,
            errorMessage: () => null,
            goBack: jasmine.createSpy('goBack'),
            openItem: jasmine.createSpy('openItem'),
            loadMore: jasmine.createSpy('loadMore')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DirectoryBrowserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
