import { gql } from 'apollo-angular';

export const DIRECTORY_LISTING_QUERY = gql`
  query DirectoryListing($path: String, $first: Int!, $after: String) {
    directoryListing(path: $path, first: $first, after: $after) {
      currentPath
      totalReturned
      edges {
        cursor
        node {
          name
          fullPath
          size
          extension
          createdAt
          permissions
          type
          isDirectory
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
