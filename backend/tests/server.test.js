const request = require('supertest');

jest.mock('../database/db/db');
const pool = require('../database/db/db');
const app = require('../server');

describe('GET /', () => {
  it('responds with a plain-text health message', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.text).toBe('Enquiry App backend');
  });
});

describe('GET /test-db', () => {
  // Regression test: this route used to throw "pool is not defined" because
  // server.js never imported it (fixed by adding `const pool = require(...)`
  // at the top of server.js).
  it('queries the database and returns the current time', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ now: '2026-09-07T00:00:00.000Z' }] });

    const res = await request(app).get('/test-db');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, time: { now: '2026-09-07T00:00:00.000Z' } });
    expect(pool.query).toHaveBeenCalledWith('SELECT NOW()');
  });

  it('returns 500 with the error message when the query fails', async () => {
    pool.query.mockRejectedValueOnce(new Error('connection refused'));

    const res = await request(app).get('/test-db');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'connection refused' });
  });
});

describe('CORS', () => {
  it('allows localhost origins', async () => {
    const res = await request(app).get('/').set('Origin', 'http://localhost:4000');

    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:4000');
  });

  it('allows *.vercel.app origins', async () => {
    const res = await request(app).get('/').set('Origin', 'https://catalogr-frontend.vercel.app');

    expect(res.headers['access-control-allow-origin']).toBe('https://catalogr-frontend.vercel.app');
  });

  it('blocks other origins', async () => {
    const res = await request(app).get('/').set('Origin', 'https://evil.example.com');

    // cors() surfaces the rejection as a request error handled by the
    // global error handler, not a 2xx with a permissive header.
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('unknown routes', () => {
  it('returns a 404 for a route that does not exist', async () => {
    const res = await request(app).get('/this-route-does-not-exist');
    expect(res.status).toBe(404);
  });
});
