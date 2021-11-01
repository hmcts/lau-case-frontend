import {Application} from 'express';
import {CaseSearchesController} from '../controllers/case-searches.controller';

export default function (app: Application): void {
  const controller = new CaseSearchesController();

  app.get('/case-searches/page/:pageNumber', controller.getPage);
  app.get('/case-searches/csv', controller.getCsv);
}
