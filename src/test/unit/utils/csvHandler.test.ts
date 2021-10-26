import {jsonToCsv} from '../../../main/util/CsvHandler';
import {CaseActivityLogs} from '../../../main/models/CaseActivityLogs';
import {CaseSearchLogs} from '../../../main/models/CaseSearchLogs';

const caseActivityAuditResponse = require('../../data/caseActivityAuditResponse.json');
const caseSearchAuditResponse = require('../../data/caseSearchAuditResponse.json');

describe('CsvHandler', () => {

  it('Converts Case View JSON object to CSV', async () => {
    const caseActivityLogs = new CaseActivityLogs(caseActivityAuditResponse.actionLog);
    return jsonToCsv(caseActivityLogs).then((csv) => {
      expect(csv).toBe(
        '"User Id","Case Action","Case Ref","Case Jurisdiction Id","Case Type Id","Timestamp"\n' +
        '"3748238","VIEW","1615817621013640","Probate","Caveats","2021-06-23T22:20:05.293Z"\n' +
        '"3748239","VIEW","1615817621013640","Probate","Caveats","2020-02-02T08:16:27.234Z"',
      );
    });
  });

  it('Converts Case Search JSON object to CSV', async () => {
    const caseSearchLogs = new CaseSearchLogs(caseSearchAuditResponse.searchLog);
    return jsonToCsv(caseSearchLogs).then((csv) => {
      expect(csv).toBe(
        '"User Id","Case Refs","Timestamp"\n' +
        '"3748238","[""1615817621013640"",""1615817621013643""]","2021-06-23T22:20:05.293Z"\n' +
        '"3748239","[""1615817621013640""]","2020-02-02T08:16:27.234Z"',
      );
    });
  });
});
