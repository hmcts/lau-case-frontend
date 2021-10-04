import flatpickr from 'flatpickr';
import {Options} from 'flatpickr/dist/types/options';
import {getById} from './selectors';

const zeroPad = (n: number): string => {
  return n.toString().padStart(2, '0');
};

const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(date.getDate())}`
    + ` ${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}:${zeroPad(date.getSeconds())}`;
};

const flatpickrOptions: Options = {
  allowInvalidPreload: true,
  enableTime: true,
  allowInput: true,
  enableSeconds: true,
  clickOpens: false,
  closeOnSelect: true,
  formatDate: (date: Date) => {
    return formatDate(date);
  },
};

const form = getById('case-search-form') as HTMLFormElement | null;

if (form && getById('startTimestamp') && getById('endTimestamp')) {
  // @ts-ignore
  const startCal: flatpickr.Instance = flatpickr('#startTimestamp', flatpickrOptions);
  const startTimestampSuffix = document.getElementsByClassName('startTimestampSuffix')[0];
  startTimestampSuffix.addEventListener('click', () => {
    startCal.open();
  });

  // @ts-ignore
  const endCal: flatpickr.Instance = flatpickr('#endTimestamp', flatpickrOptions);
  const endTimestampSuffix = document.getElementsByClassName('endTimestampSuffix')[0];
  endTimestampSuffix.addEventListener('click', () => {
    endCal.open();
  });
}
