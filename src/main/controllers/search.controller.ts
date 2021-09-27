import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import autobind from 'autobind-decorator';
import {AppRequest, FormError} from '../models/appRequest';
import {Response} from 'express';
import {CaseSearchRequest} from '../models/CaseSearchRequest';
import {atLeastOneFieldIsFilled, fillPartialTimestamp, validDateInput} from '../util/validators';

/**
 * Search Controller class to handle search tab functionality
 */
@autobind
export class SearchController {
  private logger: LoggerInstance = Logger.getLogger('SearchController');

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

    // At least one of the date form inputs
    this.validate(
      'caseSearchForm',
      {startTimestamp: form.startTimestamp, endTimestamp: form.endTimestamp},
      atLeastOneFieldIsFilled,
      'dateFieldRequired',
    );

    // startTimestamp is correctly formatted
    form.startTimestamp = fillPartialTimestamp(form.startTimestamp);
    this.validate('startTimestamp', form.startTimestamp, validDateInput);

    // endTimestamp is correctly formatted
    form.endTimestamp = fillPartialTimestamp(form.endTimestamp);
    this.validate('endTimestamp', form.endTimestamp, validDateInput);

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
    this.resetErrors();

    req.session.errors = this.validateSearchForm(req.body);

    if (this.getErrors().length === 0) {
      // To be sent to API GET
      this.logger.info('API Request Parameters: ', req.body);
      res.send(req.body); // To be removed when search is implemented
    } else {
      res.redirect('/');
    }
  }

}
