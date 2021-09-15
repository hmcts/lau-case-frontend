import {CaseViewLog} from './CaseViewLogs';

export interface CaseViewAudit {
  viewLog: CaseViewLog[];
  startRecordNumber: number;
  moreRecords: boolean;
}
