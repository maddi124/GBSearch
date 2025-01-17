const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const path = require('path');

const routes = require('./routes');

const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;
 
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    context: authMiddleware,
    introspection: true
  });

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true}));
app.use(express.json());


//app.use(routes);

// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});