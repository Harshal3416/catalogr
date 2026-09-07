import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '@/app/home/page';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

// next/link needs an App Router context to run its real prefetch logic;
// for these tests a plain <a> is all we need to assert on.
vi.mock('next/link', () => ({
  default: ({ href, children, onClick, ...rest }: any) => (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  ),
}));

// Note: the desktop nav (`hidden md:flex`) is always present in the DOM —
// only CSS hides it at narrow widths, which jsdom doesn't apply — so these
// tests scope to the mobile nav panel (data-testid="mobile-nav") rather than
// asserting on link presence/absence for the whole document.

describe('home page Header — mobile menu', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('starts closed: the mobile nav panel is not rendered', () => {
    render(<Header />);

    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toggle menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  // Regression test: the mobile hamburger button used to render with no
  // onClick handler and no dropdown markup at all, so mobile visitors could
  // never reach Features/How it Works/Directory/Create Free Store.
  it('opens the mobile nav panel when the hamburger button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole('button', { name: 'Toggle menu' }));

    expect(screen.getByRole('button', { name: 'Toggle menu' })).toHaveAttribute('aria-expanded', 'true');
    const mobileNav = within(screen.getByTestId('mobile-nav'));
    expect(mobileNav.getByRole('link', { name: 'Features' })).toBeInTheDocument();
    expect(mobileNav.getByRole('link', { name: 'How it Works' })).toBeInTheDocument();
    expect(mobileNav.getByRole('link', { name: 'Directory' })).toBeInTheDocument();
    expect(mobileNav.getByText('Create Free Store')).toBeInTheDocument();
  });

  it('closes again on a second click of the hamburger button', async () => {
    const user = userEvent.setup();
    render(<Header />);
    const toggle = screen.getByRole('button', { name: 'Toggle menu' });

    await user.click(toggle);
    expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();

    await user.click(toggle);
    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the menu and navigates to /admin/settings when "Create Free Store" is clicked in the mobile panel', async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole('button', { name: 'Toggle menu' }));
    await user.click(within(screen.getByTestId('mobile-nav')).getByText('Create Free Store'));

    expect(pushMock).toHaveBeenCalledWith('/admin/settings');
    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
  });

  it('closes the mobile menu when a nav link is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole('button', { name: 'Toggle menu' }));
    await user.click(within(screen.getByTestId('mobile-nav')).getByRole('link', { name: 'Directory' }));

    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
  });
});
