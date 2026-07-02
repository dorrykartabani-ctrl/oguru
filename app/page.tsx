'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

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
        fontFamily: 'system-ui, -apple-system, sans-serif',
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
          Ai Assisted Vendor Marketing and Ordering
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
