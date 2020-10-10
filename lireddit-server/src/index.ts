import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import resolvers from './modules/mainResolvers';
import typeDefs from './modules/mainSchema';
import { createConnection } from 'typeorm';
import cors from 'cors';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { COOKIE_NAME } from './constants';
import { Post } from './entity/Post';

const app = express();
// create redis connection/ connect to redis server
const redis = new Redis();
// initialise redis session
const RedisStore = connectRedis(session);
// introduce session
app.use(
  session({
    store: new RedisStore({ client: redis, disableTouch: true }),
    name: COOKIE_NAME,
    secret: 'my secret',
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
//create sever instance and add as a middleware
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: ({ req, res }) => ({
    req,
    res,
    redis,
  }),
});
server.applyMiddleware({ app, cors: false });

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
