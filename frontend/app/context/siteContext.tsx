"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from '@clerk/nextjs';
import { getAdminContactDetails, getAdminDetails, getSiteInformation, getBusinessDetails } from "../../services/settingsService";
import { SiteDetail } from "@/app/interfaces/interface";
import { useSearchParams } from "next/navigation";

interface SiteContextType {
  siteDetails: SiteDetail | null;
  authTenantId: string | null;
  isAuthorizedTenant: boolean;
  authTenantLoaded: boolean;
  refetchSiteInfo: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [siteDetails, setSiteDetails] = useState<SiteDetail | null>(null);

  // Only use search params on client side
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const tenantidFromUrl = searchParams?.get('tenantid') || null;
  const tenantid = tenantidFromUrl;
  const [tenantidfromdb, setTenantidFromDb] = useState('');
  const [authTenantId, setAuthTenantId] = useState<string | null>(null);
  const [authTenantLoaded, setAuthTenantLoaded] = useState(false);
  const [isAuthorizedTenant, setIsAuthorizedTenant] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadAuthTenant = useCallback(async () => {
    if (!isLoaded) return;

    try {
      if (!user) {
        setAuthTenantId(null);
        return;
      }

      const authAdminData = await getAdminDetails();
      setAuthTenantId(authAdminData?.tenantid || null);
    } catch (error) {
      console.error('Failed to load authenticated admin details:', error);
      setAuthTenantId(null);
    } finally {
      setAuthTenantLoaded(true);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    loadAuthTenant();
  }, [loadAuthTenant]);

  useEffect(() => {
    setIsAuthorizedTenant(Boolean(tenantid && (authTenantId === tenantid || authTenantId === null)));
  }, [authTenantId, tenantid]);

  const loadDetails = useCallback(async (overrideTenantId?: string) => {
    const currentTenantId = overrideTenantId || tenantid;

    if (!currentTenantId) {
      setSiteDetails(null);
      return;
    }

    try {
      const [adminDataRaw, siteDataRaw, contactDetailsRaw] = await Promise.all([
        getAdminDetails(currentTenantId),
        getSiteInformation(currentTenantId),
        getAdminContactDetails(currentTenantId),
      ]);
      const adminData = adminDataRaw || {};
      const siteData = siteDataRaw || {};
      const contactDetails = contactDetailsRaw || {};

      const fallbackDetails: SiteDetail = {
        tenantid: currentTenantId,
        tenantdomain: '',
        ownertitle: '',
        aboutowner: '',
        sitesubtitle: '',
        trustedtagline: '',
        shoptype: '',
        shortdescription: '',
        yearsofexperience: '',
        productssold: '',
        happyclients: '',
        sitetitle: '',
        sitelogourl: null,
      };

      const details = {
        ...fallbackDetails,
        ...adminData,
        ...siteData,
        ...contactDetails,
        tenantid: currentTenantId,
      };

      setTenantidFromDb(currentTenantId);
      console.log("Context Data", details);
      setSiteDetails(details);
    } catch (error) {
      console.error("Failed to load site details:", error);
      setSiteDetails(null);
    }
  }, [tenantid]);

  const refetchSiteInfo = useCallback(async () => {
    const currentTenantId = tenantidfromdb || tenantid;
    if (!currentTenantId) return;

    await loadDetails(currentTenantId);
    await loadAuthTenant();
  }, [loadDetails, loadAuthTenant, tenantid, tenantidfromdb]);

  useEffect(() => {
    if (isClient && tenantid) {
      loadDetails();
    }
  }, [isClient, tenantid, loadDetails]);

  return (
    <SiteContext.Provider value={{ siteDetails, authTenantId, isAuthorizedTenant, authTenantLoaded, refetchSiteInfo }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteDetails() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteDetails must be used within a SiteProvider');
  }
  return context;
}
