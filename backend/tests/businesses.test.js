const request = require('supertest');

jest.mock('../database/db/db');
const pool = require('../database/db/db');
const app = require('../server');

describe('GET /api/businesses', () => {
  it('returns businesses aggregated from admindetails/siteinformation/admincontact', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          tenantid: 'raj-wholesale',
          sitelogourl: JSON.stringify({ url: 'https://example.com/logo.png' }),
          sitetitle: 'Raj Wholesale Steel',
          ownername: 'Harshal Kapoor',
          shoptype: 'broker',
          sitedescription: 'Steel wholesale',
          address: 'Chikpete, Bangalore',
        },
      ],
    });

    const res = await request(app).get('/api/businesses');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0]).toEqual({
      tenantid: 'raj-wholesale',
      siteLogo: { url: 'https://example.com/logo.png' },
      siteTitle: 'Raj Wholesale Steel',
      ownerName: 'Harshal Kapoor',
      shopType: 'broker',
      siteDescription: 'Steel wholesale',
      address: 'Chikpete, Bangalore',
    });
  });

  it('returns an empty list when no businesses exist', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/api/businesses');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: [], count: 0 });
  });

  it('handles a sitelogourl that is already an object (jsonb column)', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          tenantid: 'test',
          sitelogourl: { url: '/uploads/logo.png' },
          sitetitle: null,
          ownername: null,
          shoptype: null,
          sitedescription: null,
          address: null,
        },
      ],
    });

    const res = await request(app).get('/api/businesses');

    expect(res.status).toBe(200);
    expect(res.body.data[0].siteLogo).toEqual({ url: '/uploads/logo.png' });
  });

  it('returns 500 when the database query fails', async () => {
    pool.query.mockRejectedValueOnce(new Error('connection refused'));

    const res = await request(app).get('/api/businesses');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      error: 'Server error: connection refused',
    });
  });
});
