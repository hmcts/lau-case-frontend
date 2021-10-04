import moment from 'moment';

export const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/gm;
export const partialDateRegex = {
  Y: /^(\d{4})$/gm,
  YM: /^(\d{4})-(\d{2})$/gm,
  YMD: /^(\d{4})-(\d{2})-(\d{2})$/gm,
  YMDH: /^(\d{4})-(\d{2})-(\d{2}) (\d{2})$/gm,
  YMDHM: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/gm,
};

export const isDateValid = (date: string): boolean => {
  return date && (date.match(DATE_REGEX) && moment.utc(date, 'yyyy-MM-dd HH:mm:ss').isValid());
};
