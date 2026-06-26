import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs';
import { DIRECTORY_LISTING_QUERY } from './directory-browser.queries.js';
import { DirectoryListingResponse } from '../models/directory-browser.models.js';

@Injectable({ providedIn: 'root' })
export class DirectoryBrowserService {
  constructor(private readonly apollo: Apollo) {}

  getDirectory(path: string | null, first = 25, after: string | null = null) {
    return this.apollo
      .watchQuery<DirectoryListingResponse>({
        query: DIRECTORY_LISTING_QUERY,
        variables: { path, first, after },
        fetchPolicy: 'network-only'
      })
      .valueChanges.pipe(map((result) => result.data.directoryListing));
  }
}
