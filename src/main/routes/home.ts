import {Application, Request, Response} from 'express';

function homeHandler(req: Request, res: Response) {
  res.render('home/template');
}

export default function (app: Application): void {
  app.get('/', homeHandler);
}
