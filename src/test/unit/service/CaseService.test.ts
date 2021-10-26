import nock from 'nock';
import config from 'config';
import {CaseService} from '../../../main/service/CaseService';
import {CaseActivityAudit} from '../../../main/models/CaseActivityAudit';
import {CaseSearchRequest} from '../../../main/models/CaseSearchRequest';

describe('Case Service', () => {
  const caseService = new CaseService();
  const baseApiUrl = config.get('services.case-backend.url') as string;

  describe('getCaseActivities', () => {
    const caseActivitiesEndpoint = config.get('services.case-backend.endpoints.caseActivity') as string;

    it('return case activity audit data', async () => {
      const caseActivityAudit: CaseActivityAudit = {
        actionLog: [],
        startRecordNumber: 1,
        moreRecords: false,
      };

      nock(baseApiUrl)
        .get(`${caseActivitiesEndpoint}?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01`)
        .reply(
          200,
          caseActivityAudit,
        );

      const searchParameters: Partial<CaseSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
      };
      const caseActivities: CaseActivityAudit = await caseService.getCaseActivities(searchParameters);

      expect(caseActivities).toStrictEqual(caseActivityAudit);
    });
  });
});
