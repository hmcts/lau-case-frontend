import {Logs} from './Logs';

export interface CaseViewLog {
  userId: string;
  caseRef: string;
  caseJurisdictionId: string;
  caseTypeId: string;
  timestamp: Date;
}

export class CaseViewLogs extends Logs<CaseViewLog> {
  public _fields: string[] = ['userId', 'caseRef', 'caseJurisdictionId', 'caseTypeId', 'timestamp'];
}
