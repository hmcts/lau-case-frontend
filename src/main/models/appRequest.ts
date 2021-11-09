import { Request } from 'express';
import { Session } from 'express-session';
import type { LoggerInstance } from 'winston';
import {CaseSearchRequest} from './CaseSearchRequest';

export type FormError = {
  propertyName: string;
  errorType: string;
};

export interface AppRequest<T = Partial<CaseSearchRequest>> extends Request {
  session: AppSession;
  locals: {
    env: string;
    logger: LoggerInstance;
  };
  body: T;
}

export interface AppSession extends Session {
  user: UserDetails;
  caseActivities?: LogData;
  caseSearches?: LogData;
  formState?: Partial<CaseSearchRequest>;
  errors?: FormError[];
}

export interface LogData {
  hasData: boolean;
  rows: {text:string, classes?: string}[][];
  noOfRows: number;
  startRecordNumber: number;
  moreRecords: boolean;
  currentPage: number;
}

export interface UserDetails {
  accessToken: string;
  idToken: string;
  id: string;
  roles: string[];
}
