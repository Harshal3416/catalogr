import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        // Public landing/directory lives at /home — no reason to gate it
        // behind sign-in. Owners are sent to /admin/products after login
        // (see NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL), so '/' is free to be
        // the customer-facing entry point.
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
