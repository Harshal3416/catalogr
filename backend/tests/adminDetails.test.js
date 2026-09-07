const request = require('supertest');

jest.mock('../database/db/db');
jest.mock('@clerk/backend', () => ({ verifyToken: jest.fn() }));

const pool = require('../database/db/db');
const { verifyToken } = require('@clerk/backend');
const app = require('../server');

const AUTH_HEADER = { Authorization: 'Bearer test-token' };

describe('GET /api/admin-details/:tenantid (public)', () => {
  it('returns admin details for an existing tenant', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ tenantid: 'raj-wholesale', ownername: 'Harshal Kapoor' }],
    });

    const res = await request(app).get('/api/admin-details/raj-wholesale');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { tenantid: 'raj-wholesale', ownername: 'Harshal Kapoor' },
    });
  });

  it('returns 404 when the tenant does not exist', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/api/admin-details/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Admin details not found' });
  });
});

describe('GET /api/admin-details (authenticated — own details)', () => {
  it('rejects requests with no bearer token', async () => {
    const res = await request(app).get('/api/admin-details');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'No token provided' });
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('rejects requests with an invalid/expired token', async () => {
    verifyToken.mockRejectedValueOnce(new Error('token expired'));

    const res = await request(app).get('/api/admin-details').set(AUTH_HEADER);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Invalid or expired token' });
  });

  it("returns the signed-in owner's admin details", async () => {
    verifyToken.mockResolvedValueOnce({ sub: 'clerk_user_1' });
    pool.query
      // 1) clerkAuth resolving tenantId for this clerk user
      .mockResolvedValueOnce({ rows: [{ tenantid: 'raj-wholesale' }] })
      // 2) route handler's own lookup by clerkid
      .mockResolvedValueOnce({ rows: [{ tenantid: 'raj-wholesale', ownername: 'Harshal Kapoor' }] });

    const res = await request(app).get('/api/admin-details').set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body.data.tenantid).toBe('raj-wholesale');
  });

  it('returns 404 when the signed-in user has no admin details yet', async () => {
    verifyToken.mockResolvedValueOnce({ sub: 'brand_new_user' });
    pool.query
      .mockResolvedValueOnce({ rows: [] }) // clerkAuth: no tenant yet
      .mockResolvedValueOnce({ rows: [] }); // handler: nothing found

    const res = await request(app).get('/api/admin-details').set(AUTH_HEADER);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Admin details not found' });
  });
});

describe('POST /api/admin-details', () => {
  it('rejects requests with no bearer token', async () => {
    const res = await request(app).post('/api/admin-details').send({ tenantid: 'x' });

    expect(res.status).toBe(401);
  });

  it('creates/updates admin details for the signed-in tenant', async () => {
    verifyToken.mockResolvedValueOnce({ sub: 'clerk_user_1' });
    pool.query
      .mockResolvedValueOnce({ rows: [{ tenantid: 'raj-wholesale' }] }) // clerkAuth lookup
      .mockResolvedValueOnce({
        rows: [{ clerkid: 'clerk_user_1', tenantid: 'raj-wholesale', ownername: 'Harshal Kapoor' }],
      }); // upsert RETURNING *

    const res = await request(app)
      .post('/api/admin-details')
      .set(AUTH_HEADER)
      .send({ ownername: 'Harshal Kapoor', shoptype: 'Broker' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tenantid).toBe('raj-wholesale');
  });

  it('returns 400 when neither an authenticated nor a body tenantid is available', async () => {
    verifyToken.mockResolvedValueOnce({ sub: 'brand_new_user' });
    pool.query.mockResolvedValueOnce({ rows: [] }); // clerkAuth: no existing tenant

    const res = await request(app)
      .post('/api/admin-details')
      .set(AUTH_HEADER)
      .send({ ownername: 'No Tenant Id' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'tenantid is required' });
  });

  it('returns 403 when the body tenantid does not match the authenticated tenant', async () => {
    verifyToken.mockResolvedValueOnce({ sub: 'clerk_user_1' });
    pool.query.mockResolvedValueOnce({ rows: [{ tenantid: 'raj-wholesale' }] });

    const res = await request(app)
      .post('/api/admin-details')
      .set(AUTH_HEADER)
      .send({ tenantid: 'someone-elses-shop', ownername: 'Harshal Kapoor' });

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: 'Tenant mismatch: cannot change tenant ownership' });
  });

  it('returns 400 when the chosen tenantid is already taken', async () => {
    verifyToken.mockResolvedValueOnce({ sub: 'brand_new_user' });
    const conflictError = Object.assign(new Error('duplicate key value'), { code: '23505' });
    pool.query
      .mockResolvedValueOnce({ rows: [] }) // clerkAuth: no existing tenant
      .mockRejectedValueOnce(conflictError); // insert hits unique constraint on tenantid

    const res = await request(app)
      .post('/api/admin-details')
      .set(AUTH_HEADER)
      .send({ tenantid: 'raj-wholesale', ownername: 'Someone Else' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Tenant ID already exists. Please choose another.' });
  });
});
