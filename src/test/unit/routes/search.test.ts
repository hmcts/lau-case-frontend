import request from 'supertest';
import Search from '../../../main/routes/search';
import {app} from '../../../main/app';

describe('Search Route', () => {
  app.use('/search', Search);

  it('Calls the Search Controller post method', async () => {
    const res = await request(app).post('/search');
    expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
    expect(res.header['location']).toBe('/');
    expect(res.statusCode).toBe(302);
    expect(res.type).toBe('text/plain');
    expect(res.redirect).toBe(true);
  });
});
