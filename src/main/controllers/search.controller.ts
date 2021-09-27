const {Logger} = require('@hmcts/nodejs-logging');

import autobind from 'autobind-decorator';
import {AppRequest, FormError} from '../models/appRequest';
import {Response} from 'express';
import {CaseSearchRequest} from '../models/CaseSearchRequest';
import {
  atLeastOneFieldIsFilled,
  fillPartialTimestamp,
  isFilledIn,
  startDateBeforeEndDate,
  validDateInput,
} from '../util/validators';

/**
 * Search Controller class to handle search tab functionality
 */
@autobind
export class SearchController {
  private logger = Logger.getLogger('SearchController');

  private errors: FormError[] = [];

  /**
   * Returns the array containing the list of Form Errors, empty array if none.
   */
  public getErrors(): FormError[] {
    return this.errors;
  }

  /**
   * Reset the errors array to an empty array.
   *
   * @private
   */
  private resetErrors(): void {
    this.errors = [];
  }

  /**
   * Adds any form error returned by the validator to the form error array.
   *
   * @param id ID of the field (or form if multiple fields)
   * @param fields The field(s) being validated
   * @param validator The validator function
   * @param errorType Optional - Override the errorType returned by the validator function
   * @private
   */
  private validate(
    id: string,
    fields: Partial<CaseSearchRequest> | string,
    validator: (f: Partial<CaseSearchRequest> | string) => string,
    errorType?: string,
  ): void {
    const error = validator(fields);
    if (error) this.errors.push({propertyName: id, errorType: errorType || error});
  }

  /**
   * Function to run through the validation for the search form.
   *
   * @param form Search form to validate. Contains a partial of the search request object.
   */
  public validateSearchForm(form: Partial<CaseSearchRequest>): FormError[] {
    this.resetErrors();

    // At least one of the string form inputs
    this.validate(
      'caseSearchForm',
      {
        caseTypeId: form.caseTypeId,
        caseJurisdictionId: form.caseJurisdictionId,
        caseRef: form.caseRef,
        userId: form.userId,
      },
      atLeastOneFieldIsFilled,
      'stringFieldRequired',
    );

    // startTimestamp is filled in and correctly formatted
    form.startTimestamp = fillPartialTimestamp(form.startTimestamp);
    this.validate('startTimestamp', form.startTimestamp, isFilledIn);
    this.validate('startTimestamp', form.startTimestamp, validDateInput);

    // endTimestamp is filled in and correctly formatted
    form.endTimestamp = fillPartialTimestamp(form.endTimestamp);
    this.validate('endTimestamp', form.endTimestamp, isFilledIn);
    this.validate('endTimestamp', form.endTimestamp, validDateInput);

    // Start date is before end date
    this.validate('caseSearchForm', {
      startTimestamp: form.startTimestamp,
      endTimestamp: form.endTimestamp,
    }, startDateBeforeEndDate);

    return this.getErrors();
  }

  /**
   * POST function for Search Controller
   *
   * @param req AppRequest - extension of Express Request
   * @param res Express Response
   */
  public async post(req: AppRequest, res: Response): Promise<void> {
    req.session.formState = req.body;
    req.session.errors = this.validateSearchForm(req.body);

    if (this.getErrors().length === 0) {
      // To be sent to API GET
      this.logger.log('API Request Parameters: ', req.body);
    }

    res.redirect('/');
  }

}
