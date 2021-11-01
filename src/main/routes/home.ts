import {Application, Response} from 'express';
import {AppRequest} from '../models/appRequest';

function homeHandler(req: AppRequest, res: Response) {
  const formState = req.session?.formState || {};
  const sessionErrors = req.session?.errors || [];
  const caseActivities = req.session?.caseActivities;
  const caseSearches = req.session?.caseSearches;

  res.render('home/template', {
    form: formState,
    caseActivities,
    caseSearches,
    sessionErrors,
    errors: {
      caseSearchForm: {
        stringFieldRequired: 'Please enter at least one of the following fields: User ID, Case Type ID, Case ID or Jurisdiction ID.',
        startDateBeforeEndDate: '\'Time from\' must be before \'Time to\'',
      },
      startTimestamp: {
        invalid: 'Invalid \'Time from\' timestamp.',
        required: '\'Time from\' is required.',
      },
      endTimestamp: {
        invalid: 'Invalid \'Time to\' timestamp.',
        required: '\'Time to\' is required.',
      },
    },
  });
}

export default function (app: Application): void {
  app.get('/', homeHandler);
}
