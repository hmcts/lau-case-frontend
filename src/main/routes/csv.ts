import {Application, Request, Response} from 'express';
import {jsonToCsv} from '../util/CsvHandler';
import {CaseViewLogs} from '../models/CaseViewLogs';

function csvGet(req: Request, res: Response) {
  // The request will contain the search params. Here we will search again to return the latest data set.
  // Until this is implemented we will stub dummy data

  const caseViewAuditResponse = require('../../test/data/caseViewAuditResponse.json');
  const caseViewLogs = new CaseViewLogs(caseViewAuditResponse.viewLog);

  jsonToCsv(caseViewLogs).then(csv => {
    res.setHeader('Content-disposition', 'attachment; filename=tobedynamic.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  });
}

export default function (app: Application): void {
  app.get('/tobedefined', csvGet);
}
