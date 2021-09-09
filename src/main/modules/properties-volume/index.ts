import config from 'config';
import * as propertiesVolume from '@hmcts/properties-volume';
import { Application } from 'express';
import { get, set } from 'lodash';

export class PropertiesVolume {
  enableFor(server: Application): void {
    if (server.locals.ENV !== 'development') {
      propertiesVolume.addTo(config);
      PropertiesVolume.setSecret('secrets.lau.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
      PropertiesVolume.setSecret('secrets.lau.case-frontend-redis-access-key', 'redis.password');
    }
  }

  private static setSecret(fromPath: string, toPath: string): void {
    if (config.has(fromPath)) {
      set(config, toPath, get(config, fromPath));
    }
  }

}
