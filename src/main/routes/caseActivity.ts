import {Application} from 'express';
import {CaseActivityController} from '../controllers/case-activity.controller';

export default function (app: Application): void {
  const controller = new CaseActivityController();

  app.get('/case-activity/page/:pageNumber', controller.getPage);
  app.get('/case-activity/csv', controller.getCsv);
}
