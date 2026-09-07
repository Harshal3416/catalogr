-- ============================================
-- Core Tenant Tables Schema for Supabase
-- ============================================
-- These are the tables the backend actually reads/writes today
-- (backend/routes/adminDetails.js, siteDetails.js, collections.js,
-- businesses.js) but which 001_create_businesses_table.sql never
-- created — businesses.js was rewritten to aggregate from these
-- normalized tables instead of a single flat `businesses` row.

-- ============================================
-- admindetails — one row per business owner (clerkid) / tenant
-- ============================================
CREATE TABLE IF NOT EXISTS admindetails (
  clerkid VARCHAR(255) PRIMARY KEY,
  tenantid VARCHAR(255) UNIQUE NOT NULL,

  ownername VARCHAR(255),
  ownertitle VARCHAR(255),
  aboutowner TEXT,
  yearsofexperience VARCHAR(50),
  productssold VARCHAR(50),
  happyclients VARCHAR(50),
  shoptype VARCHAR(100),

  createdat TIMESTAMP DEFAULT NOW(),
  updatedat TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admindetails_tenantid ON admindetails(tenantid);

-- ============================================
-- siteinformation — branding/logo/copy for a tenant's storefront
-- ============================================
CREATE TABLE IF NOT EXISTS siteinformation (
  tenantid VARCHAR(255) PRIMARY KEY,

  sitelogourl JSONB,
  sitetitle VARCHAR(255) NOT NULL,
  sitesubtitle VARCHAR(255),
  trustedtagline VARCHAR(255),
  sitedescription TEXT,

  updatedat TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- admincontact — how customers reach a tenant
-- ============================================
CREATE TABLE IF NOT EXISTS admincontact (
  tenantid VARCHAR(255) PRIMARY KEY,

  contactemail VARCHAR(255),
  contactphone VARCHAR(50),
  alternatecontactphone VARCHAR(50),
  address TEXT,

  updatedat TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- adminsocial — social/review links for a tenant
-- ============================================
CREATE TABLE IF NOT EXISTS adminsocial (
  tenantid VARCHAR(255) PRIMARY KEY,

  instagramurl VARCHAR(500),
  googlemapurl VARCHAR(500),
  justdialurl VARCHAR(500),

  updatedat TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- openinghours — weekly hours for a tenant
-- ============================================
CREATE TABLE IF NOT EXISTS openinghours (
  tenantid VARCHAR(255) PRIMARY KEY,

  monday VARCHAR(100),
  tuesday VARCHAR(100),
  wednesday VARCHAR(100),
  thursday VARCHAR(100),
  friday VARCHAR(100),
  saturday VARCHAR(100),
  sunday VARCHAR(100),

  updatedat TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- collections — products/items in a tenant's catalog
-- ============================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY,
  tenantid VARCHAR(255) NOT NULL,
  itemid VARCHAR(255) NOT NULL,

  itemname VARCHAR(255) NOT NULL,
  description TEXT,
  itemassets JSONB,
  price NUMERIC,

  createdat TIMESTAMP DEFAULT NOW(),
  updatedat TIMESTAMP DEFAULT NOW(),

  CONSTRAINT uq_collections_tenant_item UNIQUE (tenantid, itemid)
);

CREATE INDEX IF NOT EXISTS idx_collections_tenantid ON collections(tenantid);
CREATE INDEX IF NOT EXISTS idx_collections_createdat ON collections(createdat DESC);

-- ============================================
-- Trigger to auto-update updatedat on modification
-- (mirrors 001_create_businesses_table.sql's pattern; reused per-table
-- since triggers are per-table objects in Postgres)
-- ============================================
CREATE OR REPLACE FUNCTION update_updatedat_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedat = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_admindetails_updatedat ON admindetails;
CREATE TRIGGER trigger_update_admindetails_updatedat
BEFORE UPDATE ON admindetails
FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();

DROP TRIGGER IF EXISTS trigger_update_siteinformation_updatedat ON siteinformation;
CREATE TRIGGER trigger_update_siteinformation_updatedat
BEFORE UPDATE ON siteinformation
FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();

DROP TRIGGER IF EXISTS trigger_update_admincontact_updatedat ON admincontact;
CREATE TRIGGER trigger_update_admincontact_updatedat
BEFORE UPDATE ON admincontact
FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();

DROP TRIGGER IF EXISTS trigger_update_adminsocial_updatedat ON adminsocial;
CREATE TRIGGER trigger_update_adminsocial_updatedat
BEFORE UPDATE ON adminsocial
FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();

DROP TRIGGER IF EXISTS trigger_update_openinghours_updatedat ON openinghours;
CREATE TRIGGER trigger_update_openinghours_updatedat
BEFORE UPDATE ON openinghours
FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();

DROP TRIGGER IF EXISTS trigger_update_collections_updatedat ON collections;
CREATE TRIGGER trigger_update_collections_updatedat
BEFORE UPDATE ON collections
FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();
