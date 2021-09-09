import config from 'config';
import ConnectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import session from 'express-session';
import Redis from 'ioredis';

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
        store: SessionStorage.getStore(),
      }),
    );
  }

  static getStore(): ConnectRedis.RedisStore {
    const redisEnabled = config.get('redis.enabled');
    if (redisEnabled) {
      const host: string = config.get('redis.host');
      const password: string = config.get('redis.password');
      const port: number = config.get('redis.port');

      const tlsOptions = {
        password: password,
        tls: true,
      };

      const redisOptions = config.get('redis.useTLS') ? tlsOptions : {};
      const client = new Redis(port, host, redisOptions);

      return new RedisStore({ client });
    } else if (config.get('environment') === 'prod') {
      throw new Error('Redis disabled in production!');
    }

    // FOR DEV ONLY
    return new MemoryStore();
  }
}
