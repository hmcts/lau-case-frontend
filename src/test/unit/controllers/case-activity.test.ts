import nock from 'nock';
import {CaseSearchRequest} from '../../../main/models/CaseSearchRequest';
import {CaseActivityController} from '../../../main/controllers/case-activity.controller';
import {LogData} from '../../../main/models/appRequest';
import {CaseActions, CaseActivityLog} from '../../../main/models/CaseActivityLogs';
import {CaseActivityAudit} from '../../../main/models/CaseActivityAudit';
import caseActivityLogs from '../../data/caseActivityLogs.json';

describe('Case Activity Controller', () => {
  const caseActivityController = new CaseActivityController();

  describe('getLogData', () => {
    it('returns valid log data - no actions', async () => {
      nock('http://localhost:4550')
        .get('/audit/caseAction?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01')
        .reply(
          200,
          {actionLog: [], startRecordNumber: 1, moreRecords: false},
        );

      const searchRequest: Partial<CaseSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
      };

      return caseActivityController.getLogData(searchRequest).then((caseActivities: LogData) => {
        const expectCaseActivities: LogData = {
          hasData: false,
          moreRecords: false,
          rows: [],
          startRecordNumber: 1,
          noOfRows: 0,
        };
        expect(caseActivities).toStrictEqual(expectCaseActivities);
        nock.cleanAll();
      });
    });

    it('returns valid log data - with actions <= 12', async () => {
      const caseActivityLogs: CaseActivityLog[] = [
        {
          'userId': 'U0001',
          'caseAction': CaseActions.VIEW,
          'caseRef': 'C0001',
          'caseJurisdictionId': 'DIVORCE',
          'caseTypeId': 'FinancialRemedyMVP2',
          'timestamp': '2020-07-20T15:00:00',
        },
        {
          'userId': 'U0002',
          'caseAction': CaseActions.VIEW,
          'caseRef': 'C0001',
          'caseJurisdictionId': 'DIVORCE',
          'caseTypeId': 'FinancialRemedyMVP2',
          'timestamp': '2020-07-20T15:00:00',
        },
      ];

      const caseActivityAudit: CaseActivityAudit = {
        actionLog: caseActivityLogs,
        moreRecords: false,
        startRecordNumber: 1,
      };

      nock('http://localhost:4550')
        .get('/audit/caseAction?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01')
        .reply(
          200,
          caseActivityAudit,
        );

      const searchRequest: Partial<CaseSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
      };

      return caseActivityController.getLogData(searchRequest).then((caseActivities: LogData) => {
        const expectCaseActivities: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{text: 'U0001'}, {text: 'VIEW'}, {text: 'C0001'}, {text: 'DIVORCE'}, {text: 'FinancialRemedyMVP2'}, {text: '2020-07-20T15:00:00'}],
            [{text: 'U0002'}, {text: 'VIEW'}, {text: 'C0001'}, {text: 'DIVORCE'}, {text: 'FinancialRemedyMVP2'}, {text: '2020-07-20T15:00:00'}],
          ],
          startRecordNumber: 1,
          noOfRows: 2,
        };
        expect(caseActivities).toStrictEqual(expectCaseActivities);
        nock.cleanAll();
      });
    });

    it('returns valid log data - with actions > 12', async () => {
      const caseActivityAudit: CaseActivityAudit = {
        actionLog: caseActivityLogs.activityLog as CaseActivityLog[],
        moreRecords: false,
        startRecordNumber: 1,
      };

      nock('http://localhost:4550')
        .get('/audit/caseAction?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01')
        .reply(
          200,
          caseActivityAudit,
        );

      const searchRequest: Partial<CaseSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
      };

      return caseActivityController.getLogData(searchRequest).then((caseActivities: LogData) => {
        const expectCaseActivities: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{'text': 'U0001'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20T15:00:00'}],
            [{'text': 'U0002'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20T15:00:00'}],
            [{'text': 'U0003'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20T15:00:00'}],
            [{'text': 'U0004'}, {'text': 'Create'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20T15:00:00'}],
            [{'text': 'U0005'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20T15:00:00'}],
            [{'text': 'U0006'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20T15:00:00'}],
            [{'text': 'U0007'}, {'text': 'Update'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20T15:00:00'}],
            [{'text': 'U0008'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20T15:00:00'}],
            [{'text': 'U0009'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20T15:00:00'}],
            [{'text': 'U0010'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20T15:00:00'}],
            [{'text': '...'}, {'text': ''}, {'text': ''}, {'text': ''}, {'text': ''}, {'text': ''}],
            [{'text': 'U0014'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20T15:00:00'}],
          ],
          startRecordNumber: 1,
          noOfRows: 14,
        };
        expect(caseActivities).toStrictEqual(expectCaseActivities);
        nock.cleanAll();
      });
    });
  });
});
