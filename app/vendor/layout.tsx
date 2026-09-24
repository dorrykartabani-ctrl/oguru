'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import VendorSidebar from '@/components/VendorSidebar';
import type { Business, Profile } from '@/types/database';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVendorContext() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Not logged in → back to merchant login
      if (!user) {
        router.replace('/login/vendor');
        return;
      }

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      // If profile exists but is not a vendor, send them to foodie home
      if (profileData && profileData.role !== 'vendor') {
        router.replace('/home');
        return;
      }

      setProfile(profileData);

      // Load business owned by this user
      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      // No business yet → send to apply flow (if you have one)
      if (!businessData) {
        // Soft fallback: still show shell, dashboard can prompt setup
        setBusiness(null);
      } else {
        setBusiness(businessData);
      }

      setLoading(false);
    }

    loadVendorContext();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f4eb]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4a6410]/20 border-t-[#4a6410]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4eb] font-body">
      {/* Shared merchant sidebar (desktop + mobile bottom nav) */}
      <VendorSidebar business={business} profile={profile} />

      {/* Page content — dashboard already has md:ml-64, keep that */}
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
}
