const request = require('supertest');

jest.mock('../database/db/db');
jest.mock('@clerk/backend', () => ({ verifyToken: jest.fn() }));

const pool = require('../database/db/db');
const { verifyToken } = require('@clerk/backend');
const app = require('../server');

const AUTH_HEADER = { Authorization: 'Bearer test-token' };

/** Queues clerkAuth's own DB lookup so the request is treated as signed in as `tenantid`. */
function authAs(tenantid) {
  verifyToken.mockResolvedValueOnce({ sub: 'clerk_user_1' });
  pool.query.mockResolvedValueOnce({ rows: tenantid ? [{ tenantid }] : [] });
}

describe('GET /api/collections', () => {
  it('lists all collections when no tenantid filter is given', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: '1', tenantid: 'raj-wholesale', itemid: 'i1', itemname: 'Pressure Cooker', itemassets: null }],
    });

    const res = await request(app).get('/api/collections');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('ORDER BY createdAt DESC'));
  });

  it('filters by tenantid when provided', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/api/collections?tenantid=raj-wholesale');

    expect(res.status).toBe(200);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE tenantid = $1'),
      ['raj-wholesale'],
    );
  });

  it('returns 500 when the query fails', async () => {
    pool.query.mockRejectedValueOnce(new Error('db down'));

    const res = await request(app).get('/api/collections');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ success: false, error: 'Internal server error' });
  });
});

describe('GET /api/collections/:itemid', () => {
  // KNOWN BUG (pre-existing, not introduced by this test suite): this route
  // destructures `collections` from backend/utils/store.js, but that module
  // only exports `users`/`products` — there is no `collections` export — so
  // `collections` is `undefined` and `.find()` throws on every request. Real
  // items live in Postgres (written by the POST/PUT handlers below), which
  // this route never queries. Documenting the current behavior here so a
  // future fix shows up as an intentional test change, not a silent
  // regression, and flagging it separately for a real fix.
  it('currently 500s for every request, even for an item that exists in the database', async () => {
    const res = await request(app).get('/api/collections/667357');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      error: "Server error: Cannot read properties of undefined (reading 'find')",
    });
    expect(pool.query).not.toHaveBeenCalled();
  });
});

describe('POST /api/collections', () => {
  it('rejects requests with no bearer token', async () => {
    const res = await request(app).post('/api/collections').field('itemid', 'i1').field('itemname', 'Item');
    expect(res.status).toBe(401);
  });

  it('returns 403 when the signed-in user has no tenant yet', async () => {
    authAs(null);

    const res = await request(app)
      .post('/api/collections')
      .set(AUTH_HEADER)
      .field('itemid', 'i1')
      .field('itemname', 'Item');

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ success: false, error: 'Unauthorized: tenant owner not found' });
  });

  it('requires itemid and itemname', async () => {
    authAs('raj-wholesale');

    const res = await request(app)
      .post('/api/collections')
      .set(AUTH_HEADER)
      .field('description', 'no itemid or itemname');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      error: 'itemid and itemname are required',
    });
  });

  it('rejects creating an item for a different tenant than the signed-in one', async () => {
    authAs('raj-wholesale');

    const res = await request(app)
      .post('/api/collections')
      .set(AUTH_HEADER)
      .field('itemid', 'i1')
      .field('itemname', 'Item')
      .field('tenantid', 'someone-elses-shop');

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ success: false, error: 'Tenant mismatch: cannot create for another tenant' });
  });

  it('creates the item and returns it (no files attached)', async () => {
    authAs('raj-wholesale');
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 'uuid-1', tenantid: 'raj-wholesale', itemid: 'i1', itemname: 'Item', itemassets: { images: [], videos: [] } }],
    });

    const res = await request(app)
      .post('/api/collections')
      .set(AUTH_HEADER)
      .field('itemid', 'i1')
      .field('itemname', 'Item')
      .field('price', '250');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.itemid).toBe('i1');
  });

  it('returns 400 when the itemid already exists', async () => {
    authAs('raj-wholesale');
    pool.query.mockRejectedValueOnce(Object.assign(new Error('duplicate'), { code: '23505' }));

    const res = await request(app)
      .post('/api/collections')
      .set(AUTH_HEADER)
      .field('itemid', 'duplicate-id')
      .field('itemname', 'Item');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ success: false, error: 'itemid already exists' });
  });
});

describe('PUT /api/collections/:itemid', () => {
  it('rejects requests with no bearer token', async () => {
    const res = await request(app).put('/api/collections/i1').field('itemname', 'Updated');
    expect(res.status).toBe(401);
  });

  it('updates the item for the signed-in tenant', async () => {
    authAs('raj-wholesale');
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 'uuid-1', tenantid: 'raj-wholesale', itemid: 'i1', itemname: 'Updated Name' }],
    });

    const res = await request(app)
      .put('/api/collections/i1')
      .set(AUTH_HEADER)
      .field('itemname', 'Updated Name')
      .field('description', 'Updated description')
      .field('price', '300');

    expect(res.status).toBe(200);
    expect(res.body.data.itemname).toBe('Updated Name');
  });

  it('returns 404 when the item does not belong to the signed-in tenant', async () => {
    authAs('raj-wholesale');
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .put('/api/collections/not-mine')
      .set(AUTH_HEADER)
      .field('itemname', 'Updated Name');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, error: 'Item not found' });
  });
});

describe('DELETE /api/collections/:itemid', () => {
  it('rejects requests with no bearer token', async () => {
    const res = await request(app).delete('/api/collections/i1');
    expect(res.status).toBe(401);
  });

  it('returns 403 when the signed-in user has no tenant yet', async () => {
    authAs(null);

    const res = await request(app).delete('/api/collections/i1').set(AUTH_HEADER);

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ success: false, error: 'Unauthorized: tenant owner not found' });
  });

  it('deletes the item and returns it', async () => {
    authAs('raj-wholesale');
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 'uuid-1', tenantid: 'raj-wholesale', itemid: 'i1' }],
    });

    const res = await request(app).delete('/api/collections/i1').set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: 'Item deleted',
      data: { id: 'uuid-1', tenantid: 'raj-wholesale', itemid: 'i1' },
    });
  });

  it('returns 404 when the item does not exist for this tenant', async () => {
    authAs('raj-wholesale');
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).delete('/api/collections/missing').set(AUTH_HEADER);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, error: 'Item not found' });
  });
});
