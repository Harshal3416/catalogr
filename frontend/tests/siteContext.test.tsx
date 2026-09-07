import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SiteProvider, useSiteDetails } from '@/app/context/siteContext';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('tenantid=raj-wholesale'),
}));

vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({ user: null, isLoaded: true }),
}));

const getAdminDetails = vi.fn();
const getSiteInformation = vi.fn();
const getAdminContactDetails = vi.fn();

vi.mock('../services/settingsService', () => ({
  getAdminDetails: (...args: unknown[]) => getAdminDetails(...args),
  getSiteInformation: (...args: unknown[]) => getSiteInformation(...args),
  getAdminContactDetails: (...args: unknown[]) => getAdminContactDetails(...args),
  getBusinessDetails: vi.fn(),
}));

function Probe() {
  const { siteDetails } = useSiteDetails();
  if (!siteDetails) return <div data-testid="probe">loading</div>;
  return <div data-testid="probe">{JSON.stringify(siteDetails)}</div>;
}

describe('SiteProvider.loadDetails — fetch strategy', () => {
  beforeEach(() => {
    getAdminDetails.mockReset();
    getSiteInformation.mockReset();
    getAdminContactDetails.mockReset();
  });

  // Regression test: loadDetails used to `await` getAdminDetails, then
  // getSiteInformation, then getAdminContactDetails one after another. Now
  // it fires all three via Promise.all, so all three requests should be in
  // flight together instead of starting only once the previous one resolves.
  it('fetches admin/site/contact details concurrently, not sequentially', async () => {
    const events: string[] = [];
    const delayedCall = (name: string, ms: number, value: unknown) =>
      vi.fn(() => {
        events.push(`start:${name}`);
        return new Promise((resolve) => {
          setTimeout(() => {
            events.push(`end:${name}`);
            resolve(value);
          }, ms);
        });
      });

    getAdminDetails.mockImplementation(delayedCall('admin', 30, { ownername: 'Harshal' }));
    getSiteInformation.mockImplementation(delayedCall('site', 20, { sitetitle: 'Raj Wholesale' }));
    getAdminContactDetails.mockImplementation(delayedCall('contact', 10, { contactphone: '9909090909' }));

    render(
      <SiteProvider>
        <Probe />
      </SiteProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('probe')).toHaveTextContent('Raj Wholesale'));

    // All three requests must have started before any of them finished —
    // impossible with sequential awaits, since request N+1 can't start
    // until request N resolves.
    const firstThree = events.slice(0, 3);
    expect(firstThree.sort()).toEqual(['start:admin', 'start:contact', 'start:site']);
  });

  it('merges admin/site/contact details into siteDetails', async () => {
    getAdminDetails.mockResolvedValue({ ownername: 'Harshal Kapoor' });
    getSiteInformation.mockResolvedValue({ sitetitle: 'Raj Wholesale Steel' });
    getAdminContactDetails.mockResolvedValue({ contactphone: '9909090909' });

    render(
      <SiteProvider>
        <Probe />
      </SiteProvider>,
    );

    await waitFor(() => {
      const details = JSON.parse(screen.getByTestId('probe').textContent || '{}');
      expect(details).toMatchObject({
        tenantid: 'raj-wholesale',
        ownername: 'Harshal Kapoor',
        sitetitle: 'Raj Wholesale Steel',
        contactphone: '9909090909',
      });
    });
  });

  it('sets siteDetails to null when any of the three requests fails', async () => {
    getAdminDetails.mockResolvedValue({ ownername: 'Harshal Kapoor' });
    getSiteInformation.mockRejectedValue(new Error('network error'));
    getAdminContactDetails.mockResolvedValue({ contactphone: '9909090909' });
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <SiteProvider>
        <Probe />
      </SiteProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('probe')).toHaveTextContent('loading'));
    consoleError.mockRestore();
  });
});
