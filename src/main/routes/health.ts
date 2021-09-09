import { Application } from 'express';
import {SessionStorage} from '../modules/session';
import {MetadataObj} from '../models/common';
import * as os from 'os';

const logger = (require('@hmcts/nodejs-logging')).Logger.getLogger('healthcheck');
const healthcheck = require('@hmcts/nodejs-healthcheck');

const config = require('config');
const sessionStore = SessionStorage.getStore();

const checks: MetadataObj = {};
const readinessChecks: MetadataObj = {};

export default function(app: Application): void {
  if (sessionStore.constructor.name === 'RedisStore') {
    const redisHealthcheck = healthcheck.raw(() => {
      // @ts-ignore 'status' is in client object. TS doesn't seem to know this.
      const healthy = sessionStore.client.status === 'ready';
      if (!healthy) {
        logger.info('redis is DOWN');
      }
      return healthy ? healthcheck.up() : healthcheck.down();
    });
    checks.redis = redisHealthcheck;
    readinessChecks.redis = redisHealthcheck;
  }

  const healthCheckConfig = {
    checks,
    readinessChecks,
    buildInfo: {
      name: config.service.name,
      host: os.hostname(),
      uptime: process.uptime(),
    },
  };

  healthcheck.addTo(app, healthCheckConfig);
}
