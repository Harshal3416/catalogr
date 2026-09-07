// Dummy env vars so tests never depend on (or accidentally hit) real
// credentials/services. dotenv.config() in server.js does not override
// already-set variables, so these win over backend/.env when both exist.
process.env.PORT = '0';
process.env.CLERK_SECRET_KEY = 'test-clerk-secret';
process.env.CLERK_JWT_KEY = 'test-clerk-jwt-key';
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.SUPABASE_SITE_LOGO_BUCKET = 'sitelogourl';
process.env.SUPABASE_COLLECTION_BUCKET = 'collectionassets';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
