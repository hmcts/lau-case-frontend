import {Logs} from './Logs';

export enum CaseActions {'UPDATE' = 'UPDATE', 'CREATE' = 'CREATE', 'VIEW' = 'VIEW'}

export interface CaseActivityLog {
  userId: string;
  caseAction: CaseActions;
  caseRef: string;
  caseJurisdictionId: string;
  caseTypeId: string;
  timestamp: string;
}

export class CaseActivityLogs extends Logs<CaseActivityLog> {
  public _fields: string[] = ['userId', 'caseRef', 'caseJurisdictionId', 'caseTypeId', 'timestamp'];
}