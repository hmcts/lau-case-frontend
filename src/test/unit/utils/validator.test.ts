import {atLeastOneFieldIsFilled, fillPartialTimestamp, validDateInput} from '../../../main/util/validators';

describe('Validator', () => {

  describe('atLeastOneFieldIsFilled', () => {
    it('expects an object to be passed', async () => {
      const errorType = atLeastOneFieldIsFilled(null);
      expect(errorType).toBe('required');
    });

    it('returns error type if object is empty', async () => {
      const errorType = atLeastOneFieldIsFilled({});
      expect(errorType).toBe('required');
    });

    it('returns error type if all object properties are an empty string', async () => {
      const errorType = atLeastOneFieldIsFilled({userId: '', caseTypeId: '', caseRef: '', caseJurisdictionId: ''});
      expect(errorType).toBe('required');
    });

    it('does not return an error type if an object property has a non-empty string value', async () => {
      const errorType = atLeastOneFieldIsFilled({userId: '1', caseTypeId: '', caseRef: '', caseJurisdictionId: ''});
      expect(errorType).toBe(undefined);
    });
  });

  describe('validDateInput', () => {
    it('returns error type if the date string doesn\'t match the regex', async () => {
      const errorType = validDateInput('2021-01-01_00:00:00');
      expect(errorType).toBe('invalid');
    });

    it('returns error type if the date is invalid', async () => {
      const errorType = validDateInput('2021-14-01 00:00:00');
      expect(errorType).toBe('invalid');
    });

    it('doesn\'t return an error type if the date is valid', async () => {
      const errorType = validDateInput('2021-01-01 00:00:00');
      expect(errorType).toBe(undefined);
    });
  });

  describe('fillPartialTimestamp', () => {
    it('fills any partial timestamps', async () => {
      let date = fillPartialTimestamp('2021');
      expect(date).toBe('2021-01-01 00:00:00');

      date = fillPartialTimestamp('2021-02');
      expect(date).toBe('2021-02-01 00:00:00');

      date = fillPartialTimestamp('2021-02-02');
      expect(date).toBe('2021-02-02 00:00:00');

      date = fillPartialTimestamp('2021-02-02 12');
      expect(date).toBe('2021-02-02 12:00:00');

      date = fillPartialTimestamp('2021-02-02 12:12');
      expect(date).toBe('2021-02-02 12:12:00');
    });

    it('ignores invalid dates', async () => {
      const date = fillPartialTimestamp('2021_');
      expect(date).toBe('2021_');
    });
  });

});
