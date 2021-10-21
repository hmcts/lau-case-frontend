import config from 'config';
import * as propertiesVolume from '@hmcts/properties-volume';
import { Application } from 'express';
import { get, set } from 'lodash';
import { execSync } from 'child_process';

export class PropertiesVolume {
  enableFor(server: Application): void {
    if (server.locals.ENV !== 'development') {
      propertiesVolume.addTo(config);
      PropertiesVolume.setSecret('secrets.lau.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
      PropertiesVolume.setSecret('secrets.lau.case-frontend-redis-access-key', 'redis.password');
      PropertiesVolume.setSecret('secrets.lau.idam-client-secret', 'services.idam.clientSecret');
      PropertiesVolume.setSecret('secrets.lau.s2s-secret', 'services.idam.s2sSecretLAU');
    } else {
      if (config.get('environment') !== 'dev') {
        PropertiesVolume.setLocalSecret('idam-client-secret', 'services.idam.clientSecret');
      }
    }
  }

  private static setSecret(fromPath: string, toPath: string): void {
    if (config.has(fromPath)) {
      set(config, toPath, get(config, fromPath));
    }
  }

  /**
   * Load a secret from the AAT vault using azure cli
   */
  private static setLocalSecret(secret: string, toPath: string): void {
    const result = execSync('az keyvault secret show --vault-name lau-aat -o tsv --query value --name ' + secret);

    set(config, toPath, result.toString().replace('\n', ''));
  }

}
