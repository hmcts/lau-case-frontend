import {SearchController} from '../../../main/controllers/search.controller';

describe('Search Controller', () => {
  describe('Search form validation', () => {
    let searchController: SearchController;

    beforeEach(() => {
      searchController = new SearchController();
    });

    it('requires at least one of the string inputs', async () => {
      const errors = searchController.validateSearchForm({
        caseTypeId: '',
        caseJurisdictionId: '',
        caseRef: '',
        userId: '',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'caseSearchForm', errorType: 'stringFieldRequired'});
    });

    it('requires at least one of the date inputs', async () => {
      const errors = searchController.validateSearchForm({
        startTimestamp: '',
        endTimestamp: '',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'caseSearchForm', errorType: 'dateFieldRequired'});
    });

    it('ensures dates are formatted correctly', async () => {
      const errors = searchController.validateSearchForm({startTimestamp: '2021-01-01 00-00:00'});
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'invalid'});
    });

    it('ensures dates are valid', async () => {
      const errors = searchController.validateSearchForm({startTimestamp: '2021-14-01 00:00:00'});
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'invalid'});
    });

    it('passes valid dates', async () => {
      const errors = searchController.validateSearchForm({startTimestamp: '2021-01-01 00:00:00'});
      expect(errors.length).toBe(0);
    });
  });
});
