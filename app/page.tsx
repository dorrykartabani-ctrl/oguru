'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Page() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // User is logged in — check their status and route accordingly
        const { data: business } = await supabase
          .from('businesses')
          .select('status')
          .eq('owner_id', user.id)
          .single();

        if (!business) {
          // No business yet — send to apply
          router.push('/vendor/apply');
        } else if (business.status === 'approved') {
          router.push('/vendor/dashboard');
        } else {
          router.push('/vendor/pending');
        }
      } else {
        // Not logged in — go to welcome flow after splash
        setTimeout(() => {
          router.push('/welcome');
        }, 2500);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      // On error, just show onboarding
      setTimeout(() => {
        router.push('/welcome');
      }, 2500);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#fbf9f4',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background circles */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '-80px',
          width: '256px',
          height: '256px',
          borderRadius: '50%',
          background: 'rgba(74, 100, 16, 0.05)',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '-80px',
          width: '256px',
          height: '256px',
          borderRadius: '50%',
          background: 'rgba(146, 71, 0, 0.05)',
          filter: 'blur(60px)',
        }}
      />

      {/* Logo */}
      <div
        style={{
          animation: 'fadeInScale 0.8s ease-out',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          src="/logo.png"
          alt="OGuru"
          style={{
            width: '240px',
            height: 'auto',
            maxWidth: '80vw',
          }}
        />

        <p
          style={{
            marginTop: '8px',
            fontSize: '13px',
            color: '#44483a',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontWeight: 600,
            textAlign: 'center',
            fontFamily: 'var(--font-label), system-ui, sans-serif',
          }}
        >
          Organic Marketplace
        </p>
      </div>

      {/* Loading dots */}
      <div
        style={{
          position: 'absolute',
          bottom: '64px',
          display: 'flex',
          gap: '8px',
          animation: 'fadeIn 1s ease-out 0.3s both',
        }}
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4a6410', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4a6410', animation: 'pulse 1.5s ease-in-out 0.2s infinite' }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4a6410', animation: 'pulse 1.5s ease-in-out 0.4s infinite' }} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  );
}
