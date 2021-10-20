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
  formState?: Partial<CaseSearchRequest>;
  errors?: FormError[] | undefined;
}

export interface LogData {
  hasData: boolean;
  rows: {text:string}[][];
  noOfRows: number;
  startRecordNumber: number;
  moreRecords: boolean;
}

export interface UserDetails {
  accessToken: string;
  id: string;
  roles: string[];
}
