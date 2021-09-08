import { Application } from 'express';
import { content } from '../views/cookies/content';

export default function(app: Application): void {

  app.get('/cookies', (req, res) => {
    res.render('cookies/template', content);
  });

}
