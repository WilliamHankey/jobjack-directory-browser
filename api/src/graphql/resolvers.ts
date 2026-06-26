import {
    DirectoryServiceError,
    listDirectory
  } from '../services/directory.service.js';
  
  export const resolvers = {
    Query: {
      directoryListing: async (
        _: unknown,
        args: { path?: string; first: number; after?: string | null }
      ) => {
        try {
          return await listDirectory(args);
        } catch (error) {
          if (error instanceof DirectoryServiceError) {
            throw error;
          }
  
          if (error instanceof Error && error.message.includes('Access denied')) {
            throw error;
          }
  
          throw new DirectoryServiceError(
            error instanceof Error ? error.message : 'Could not read directory.'
          );
        }
      }
    }
  };
  