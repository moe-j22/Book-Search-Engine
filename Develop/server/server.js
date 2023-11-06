const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, connection }) => {
      if (connection) {
        // For WebSocket connections
        return connection.context;
      } else {
        // For HTTP requests
        const token = req.headers.authorization || '';
        return { token };
      }
    },
  });

  await server.start();

  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`));
  });
}

startApolloServer();
