import {SearchController} from '../../../main/controllers/search.controller';

describe('Search Controller', () => {
  describe('Search form validation', () => {
    const searchController: SearchController = new SearchController();

    it('requires at least one of the string inputs', async () => {
      const errors = searchController.validateSearchForm({
        caseTypeId: '',
        caseJurisdictionId: '',
        caseRef: '',
        userId: '',
        startTimestamp: '2021-01-01 00:00:00',
        endTimestamp: '2021-01-01 00:00:01',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'caseSearchForm', errorType: 'stringFieldRequired'});
    });

    it('requires both date inputs to be filled', async () => {
      let errors = searchController.validateSearchForm({
        startTimestamp: '',
        endTimestamp: '',
      });
      expect(errors.length).toBe(2);
      expect(errors[0].errorType).toBe('required');
      expect(errors[1].errorType).toBe('required');

      errors = searchController.validateSearchForm({
        startTimestamp: '2021-01-01 00:00:00',
        endTimestamp: '',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'endTimestamp', errorType: 'required'});

      errors = searchController.validateSearchForm({
        startTimestamp: '',
        endTimestamp: '2021-01-01 00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'required'});
    });

    it('ensures dates are formatted correctly', async () => {
      const errors = searchController.validateSearchForm({
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '2021-01-01 00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'invalid'});
    });

    it('ensures dates are valid', async () => {
      const errors = searchController.validateSearchForm({
        startTimestamp: '2021-14-01 00:00:00',
        endTimestamp: '2021-12-01 00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'invalid'});
    });

    it('passes valid dates', async () => {
      const errors = searchController.validateSearchForm({
        startTimestamp: '2021-01-01 00:00:00',
        endTimestamp: '2021-01-01 00:00:01',
      });
      expect(errors.length).toBe(0);
    });
  });
});
