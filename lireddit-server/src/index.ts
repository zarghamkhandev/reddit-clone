import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import resolvers from './modules/mainResolvers';
import typeDefs from './modules/mainSchema';
import { createConnection } from 'typeorm';
import cors from 'cors';

const app = express();

//create sever instance and add as a middleware
const server = new ApolloServer({ typeDefs: typeDefs, resolvers: resolvers });
server.applyMiddleware({ app });
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:4000',
  })
);
//start app
const startApp = async () => {
  try {
    const connection = await createConnection();

    connection.runMigrations();

    app.listen({ port: 4000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      )
    );
  } catch (err) {
    console.log(err);
  }
};
startApp();
