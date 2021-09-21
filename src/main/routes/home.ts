import {Application, Response} from 'express';
import {AppRequest} from '../models/appRequest';

function homeHandler(req: AppRequest, res: Response) {
  const formState = req.session?.formState || {};
  const sessionErrors = req.session?.errors || [];

  res.render('home/template', {
    form: formState,
    sessionErrors,
    errors: {
      caseSearchForm: {
        stringFieldRequired: 'Please enter at least one of the following fields: User ID, Case Type ID, Case ID or Jurisdiction ID.',
        dateFieldRequired: 'Please enter at least one of the time fields.',
      },
      startTimestamp: {
        invalid: 'Invalid start timestamp',
      },
      endTimestamp: {
        invalid: 'Invalid end timestamp',
      },
    },
  });
}

export default function (app: Application): void {
  app.get('/', homeHandler);
}
