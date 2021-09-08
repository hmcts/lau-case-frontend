import config from 'config';
import ConnectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import session from 'express-session';
import * as redis from 'redis';

const RedisStore = ConnectRedis(session);
const MemoryStore = require('express-session').MemoryStore;

export const cookieMaxAge = 10 * (60 * 1000); // 10 minutes

export class SessionStorage {
  public enableFor(app: Application): void {
    app.use(cookieParser());

    app.use(
      session({
        name: 'lau-session',
        resave: false,
        saveUninitialized: false,
        secret: config.get('redis.secret'),
        cookie: {
          httpOnly: true,
          maxAge: cookieMaxAge,
        },
        rolling: true, // Renew the cookie for another 20 minutes on each request
        store: SessionStorage.getStore(app),
      }),
    );
  }

  private static getStore(app: Application) {
    const redisEnabled = config.get('redis.enabled');
    const redisHost = config.get('redis.host');
    if (redisEnabled) {
      const password: string = config.get('redis.password');
      const port: number = config.get('redis.port');

      const client = redis.createClient({
        host: redisHost as string,
        password,
        port,
        tls: true,
        connect_timeout: 15000,
      });

      app.locals.redisClient = client;
      return new RedisStore({ client });
    } else if (config.get('environment') === 'prod') {
      throw new Error('Redis disabled in production!');
    }

    // FOR DEV ONLY
    return new MemoryStore();
  }
}
