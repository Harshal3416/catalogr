const request = require('supertest');

jest.mock('../database/db/db');
jest.mock('@clerk/backend', () => ({ verifyToken: jest.fn() }));

const pool = require('../database/db/db');
const { verifyToken } = require('@clerk/backend');
const app = require('../server');

const AUTH_HEADER = { Authorization: 'Bearer test-token' };

function authAs(tenantid) {
  verifyToken.mockResolvedValueOnce({ sub: 'clerk_user_1' });
  pool.query.mockResolvedValueOnce({ rows: [{ tenantid }] }); // clerkAuth lookup
}

describe('siteinformation', () => {
  it('GET /siteinformation/:tenantid returns the row for an existing tenant', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ tenantid: 'raj-wholesale', sitetitle: 'Raj Wholesale Steel', sitelogourl: null }],
    });

    const res = await request(app).get('/api/site-details/siteinformation/raj-wholesale');

    expect(res.status).toBe(200);
    expect(res.body.data.sitetitle).toBe('Raj Wholesale Steel');
  });

  it('GET /siteinformation/:tenantid returns no data for an unknown tenant (200, not 404)', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/api/site-details/siteinformation/unknown');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeUndefined();
  });

  it('parses a JSON-string sitelogourl column into an object', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ tenantid: 't1', sitetitle: 'Shop', sitelogourl: JSON.stringify({ url: '/uploads/logo.png' }) }],
    });

    const res = await request(app).get('/api/site-details/siteinformation/t1');

    expect(res.body.data.sitelogourl).toEqual({ url: '/uploads/logo.png' });
  });

  it('POST /siteinformation rejects requests with no bearer token', async () => {
    const res = await request(app).post('/api/site-details/siteinformation').send({ sitetitle: 'Shop' });
    expect(res.status).toBe(401);
  });

  it('POST /siteinformation requires sitetitle', async () => {
    authAs('raj-wholesale');

    const res = await request(app)
      .post('/api/site-details/siteinformation')
      .set(AUTH_HEADER)
      .send({ sitesubtitle: 'missing title' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'sitetitle is required' });
  });

  it('POST /siteinformation upserts and returns the saved row (no file upload)', async () => {
    authAs('raj-wholesale');
    pool.query
      .mockResolvedValueOnce({ rows: [{ sitelogourl: null }] }) // existing-row lookup (no file sent)
      .mockResolvedValueOnce({
        rows: [{ tenantid: 'raj-wholesale', sitetitle: 'Raj Wholesale Steel', sitelogourl: null }],
      }); // upsert RETURNING *

    const res = await request(app)
      .post('/api/site-details/siteinformation')
      .set(AUTH_HEADER)
      .send({ sitetitle: 'Raj Wholesale Steel' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.sitetitle).toBe('Raj Wholesale Steel');
  });
});

describe('admincontact', () => {
  it('GET /admincontact/:tenantid returns contact details', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ tenantid: 't1', contactphone: '9909090909' }] });

    const res = await request(app).get('/api/site-details/admincontact/t1');

    expect(res.status).toBe(200);
    expect(res.body.data.contactphone).toBe('9909090909');
  });

  it('POST /admincontact rejects requests with no bearer token', async () => {
    const res = await request(app).post('/api/site-details/admincontact').send({ contactphone: '123' });
    expect(res.status).toBe(401);
  });

  it('POST /admincontact upserts contact details for the signed-in tenant', async () => {
    authAs('raj-wholesale');
    pool.query.mockResolvedValueOnce({
      rows: [{ tenantid: 'raj-wholesale', contactphone: '9909090909' }],
    });

    const res = await request(app)
      .post('/api/site-details/admincontact')
      .set(AUTH_HEADER)
      .send({ contactphone: '9909090909' });

    expect(res.status).toBe(201);
    expect(res.body.data.contactphone).toBe('9909090909');
  });
});

describe('adminsocial', () => {
  it('GET /adminsocial/:tenantid returns social links', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ tenantid: 't1', instagramurl: 'https://instagram.com/x' }] });

    const res = await request(app).get('/api/site-details/adminsocial/t1');

    expect(res.status).toBe(200);
    expect(res.body.data.instagramurl).toBe('https://instagram.com/x');
  });

  it('POST /adminsocial upserts social links for the signed-in tenant', async () => {
    authAs('raj-wholesale');
    pool.query.mockResolvedValueOnce({
      rows: [{ tenantid: 'raj-wholesale', instagramurl: 'https://instagram.com/x' }],
    });

    const res = await request(app)
      .post('/api/site-details/adminsocial')
      .set(AUTH_HEADER)
      .send({ instagramurl: 'https://instagram.com/x' });

    expect(res.status).toBe(201);
    expect(res.body.data.instagramurl).toBe('https://instagram.com/x');
  });
});

describe('openinghours', () => {
  it('GET /openinghours/:tenantid returns weekly hours', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ tenantid: 't1', monday: '9am - 6pm' }] });

    const res = await request(app).get('/api/site-details/openinghours/t1');

    expect(res.status).toBe(200);
    expect(res.body.data.monday).toBe('9am - 6pm');
  });

  it('POST /openinghours upserts hours for the signed-in tenant', async () => {
    authAs('raj-wholesale');
    pool.query.mockResolvedValueOnce({
      rows: [{ tenantid: 'raj-wholesale', monday: '9am - 6pm' }],
    });

    const res = await request(app)
      .post('/api/site-details/openinghours')
      .set(AUTH_HEADER)
      .send({ monday: '9am - 6pm' });

    expect(res.status).toBe(201);
    expect(res.body.data.monday).toBe('9am - 6pm');
  });
});
