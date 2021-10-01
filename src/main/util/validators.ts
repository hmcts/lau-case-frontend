import {CaseSearchRequest} from '../models/CaseSearchRequest';
import moment from 'moment';

const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/gm;
const partialDateRegex = {
  Y: /^(\d{4})$/gm,
  YM: /^(\d{4})-(\d{2})$/gm,
  YMD: /^(\d{4})-(\d{2})-(\d{2})$/gm,
  YMDH: /^(\d{4})-(\d{2})-(\d{2}) (\d{2})$/gm,
  YMDHM: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/gm,
};

export const atLeastOneFieldIsFilled = (fields: Partial<CaseSearchRequest>): string => {
  if (!fields || (Object.keys(fields).length === 0) || !Object.values(fields).some(field => field !== '')) {
    return 'required';
  }
};

// Date should be of the format: 2020-18-03 12:03:04
export const validDateInput = (date: string): string => {
  if (date && (!date.match(DATE_REGEX) || !moment(date, 'yyyy-MM-dd HH:mm:ss').isValid())) {
    return 'invalid';
  }
};

export const fillPartialTimestamp = (date: string): string => {
  switch (true) {
    case partialDateRegex.Y.test(date):
      date += '-01-01 00:00:00';
      break;
    case partialDateRegex.YM.test(date):
      date += '-01 00:00:00';
      break;
    case partialDateRegex.YMD.test(date):
      date += ' 00:00:00';
      break;
    case partialDateRegex.YMDH.test(date):
      date += ':00:00';
      break;
    case partialDateRegex.YMDHM.test(date):
      date += ':00';
      break;
    default:
      break;
  }

  return date;
};
