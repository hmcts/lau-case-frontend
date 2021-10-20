import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import autobind from 'autobind-decorator';
import {CaseService} from '../service/CaseService';
import {CaseSearchRequest} from '../models/CaseSearchRequest';
import {LogData} from '../models/appRequest';
import {CaseActivityLog} from '../models/CaseActivityLogs';
import {CaseSearchLog} from '../models/CaseSearchLogs';

/**
 * Case Activity Controller class to handle case activity tab functionality
 */
@autobind
export class CaseActivityController {
  private logger: LoggerInstance = Logger.getLogger('CaseActivityController');

  private service = new CaseService();

  public async getLogData(searchRequest: Partial<CaseSearchRequest>): Promise<LogData> {
    this.logger.info('getLogData called');
    return this.service.getCaseActivities(searchRequest).then(caseActivities => {
      return {
        hasData: caseActivities.actionLog.length > 0,
        rows: this.convertDataToTableRows(caseActivities.actionLog),
        noOfRows: caseActivities.actionLog.length,
        startRecordNumber: caseActivities.startRecordNumber,
        moreRecords: caseActivities.moreRecords,
      };
    });
  }

  private convertDataToTableRows(logs: CaseActivityLog[] | CaseSearchLog[]): {text:string}[][] {
    const splitList = logs.length > 12;

    const rows: {text:string}[][] = [];
    logs.slice(0, splitList ? 10 : 12).forEach((log) => {
      const row: {text: string}[] = [];
      const keys = Object.keys(log);
      keys.forEach(key => {
        row.push({
          // @ts-ignore
          text: log[key],
        });
      });

      rows.push(row);
    });

    if (splitList) {
      const lastLog = logs.slice(-1)[0];
      const keys = Object.keys(lastLog);

      const elipsesRow = [{text: '...'}].concat(Array(keys.length - 1).fill({text: ''}));
      rows.push(elipsesRow);

      const row: {text: string}[] = [];
      keys.forEach(key => {
        row.push({
          // @ts-ignore
          text: lastLog[key],
        });
      });
      rows.push(row);
    }

    return rows;
  }

}
