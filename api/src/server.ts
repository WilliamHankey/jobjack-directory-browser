import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { getAllowedRoot } from './utils/path-security.js';

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const port = Number(process.env.PORT ?? 4000);

const { url } = await startStandaloneServer(server, {
  listen: { port }
});

console.log(`GraphQL API running at ${url}`);
console.log(`Allowed filesystem root: ${getAllowedRoot()}`);