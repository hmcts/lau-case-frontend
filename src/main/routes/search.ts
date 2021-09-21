import {Application} from 'express';
import {SearchController} from '../controllers/search.controller';

export default function (app: Application): void {
  app.post('/search', (new SearchController().post));
}
