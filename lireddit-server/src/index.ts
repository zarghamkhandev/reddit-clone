import 'reflect-metadata';
import 'dotenv-safe/config';
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
import { createUserLoader } from './utils/createUserLoader';
import { createUpvoteLoader } from './utils/createUpvoteLoader';

const app = express();
// create redis connection/ connect to redis server
const redis = new Redis(process.env.REDIS_URL);
// initialise redis session
const RedisStore = connectRedis(session);

// for engineX
app.set('trust proxy', 1);

// introduce session
app.use(
  session({
    store: new RedisStore({ client: redis, disableTouch: true }),
    name: COOKIE_NAME,
    secret: process.env.SESSION_SECRET,
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
    origin: 'https://lireddit.zarghamkhan.com',
  })
);

//create sever instance and add as a middleware
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: ({ req, res }) => {
    return {
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      upvoteLoader: createUpvoteLoader(),
    };
  },
});
server.applyMiddleware({ app, cors: false });

//start app
const startApp = async () => {
  try {
    const connection = await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: false,
      logging: true,
      entities: ['dist/entity/**/*.js'],
      migrations: ['dist/migration/**/*.js'],
      subscribers: ['src/subscriber/**/*.ts'],
      migrationsTableName: 'custom_migration_table',
      cli: {
        migrationsDir: 'src/migration',
      },
    });

    connection.runMigrations();

    app.listen({ port: process.env.PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
      )
    );
  } catch (err) {
    console.log(err);
  }
};
startApp();
