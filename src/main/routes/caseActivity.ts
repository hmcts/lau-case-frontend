import {Application} from 'express';
import {CaseActivityController} from '../controllers/case-activity.controller';

export default function (app: Application): void {
  app.get('/case-activity/page/:pageNumber', (new CaseActivityController().getPage));
}
