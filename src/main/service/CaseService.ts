import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import fetch, {Response as FetchResponse} from 'node-fetch';
import config from 'config';
import {CaseActivityAudit} from '../models/CaseActivityAudit';
import {CaseSearchRequest} from '../models/CaseSearchRequest';
import {AuthService} from './AuthService';

export class CaseService {
  private logger: LoggerInstance = Logger.getLogger('CaseService');

  private baseApiUrl = config.get('services.case-backend.url');
  private s2sEnabled = config.get('services.idam.s2sEnabled');

  private authService = new AuthService();

  private async get(endpoint: string, qs?: string): Promise<unknown> {
    const s2sToken = this.s2sEnabled ? await this.authService.retrieveServiceToken() : {bearerToken: ''};
    const response: FetchResponse = await fetch(
      encodeURI(`${this.baseApiUrl}${endpoint}${qs || ''}`),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ServiceAuthorization': 'Bearer ' + s2sToken.bearerToken,
        },
      },
    ).catch(err => {
      this.logger.error(err);
      return err;
    });

    return response.json();
  }

  private getQueryString(params: Partial<CaseSearchRequest>): string {
    return '?' + Object.keys(params)
      // @ts-ignore
      .map(key => key + '=' + params[key])
      .join('&');
  }

  public getCaseActivities(searchParameters: Partial<CaseSearchRequest>): Promise<CaseActivityAudit> {
    const endpoint: string = config.get('services.case-backend.endpoints.caseActivity');
    return this.get(endpoint, this.getQueryString(searchParameters)) as Promise<CaseActivityAudit>;
  }

}
