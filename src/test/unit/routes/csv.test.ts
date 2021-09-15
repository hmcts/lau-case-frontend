import request from 'supertest';
import CSV from '../../../main/routes/csv';
import {app} from '../../../main/app';

describe('CSV Route', () => {
  app.use('/tobedefined', CSV);

  it('prompts the user to download the CSV file', async () => {
    const res = await request(app).get('/tobedefined');
    expect(res.header['content-type']).toBe('text/csv; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/csv');
  });
});
