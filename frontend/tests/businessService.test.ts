import { describe, it, expect, vi, beforeEach } from 'vitest';

const get = vi.fn();
vi.mock('@/lib/apiClient', () => ({
  default: { get: (...args: unknown[]) => get(...args) },
}));

import { fetchAllBusinesses } from '@/services/businessService';

describe('fetchAllBusinesses', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('requests /businesses with the given filters and returns the data array', async () => {
    get.mockResolvedValue({ data: { data: [{ tenantid: 'raj-wholesale' }], count: 1 } });

    const result = await fetchAllBusinesses({ cat: 'broker', search: 'steel' });

    expect(get).toHaveBeenCalledWith('/businesses', { params: { cat: 'broker', search: 'steel' } });
    expect(result).toEqual([{ tenantid: 'raj-wholesale' }]);
  });

  it('returns an empty array when the response has no data', async () => {
    get.mockResolvedValue({ data: {} });

    const result = await fetchAllBusinesses();

    expect(result).toEqual([]);
  });

  it('propagates errors from the API client', async () => {
    get.mockRejectedValue(new Error('network error'));

    await expect(fetchAllBusinesses()).rejects.toThrow('network error');
  });
});
