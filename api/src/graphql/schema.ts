export const typeDefs = `#graphql
  enum FileSystemItemType {
    FILE
    DIRECTORY
  }

  type FileSystemItem {
    name: String!
    fullPath: String!
    size: Float!
    extension: String
    createdAt: String!
    permissions: String!
    type: FileSystemItemType!
    isDirectory: Boolean!
  }

  type DirectoryEdge {
    cursor: String!
    node: FileSystemItem!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type DirectoryListing {
    currentPath: String!
    totalReturned: Int!
    edges: [DirectoryEdge!]!
    pageInfo: PageInfo!
  }

  type Query {
    directoryListing(path: String, first: Int = 50, after: String): DirectoryListing!
  }
`;