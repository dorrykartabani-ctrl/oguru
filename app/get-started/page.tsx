'use client';

import { useRouter } from 'next/navigation';

export default function GetStartedPage() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#fbf9f4',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '-100px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'rgba(74, 100, 16, 0.06)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '-100px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'rgba(146, 71, 0, 0.06)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          paddingTop: '48px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <img
          src="/logo.png"
          alt="OGuru"
          style={{
            width: '80px',
            height: 'auto',
            marginBottom: '16px',
          }}
        />

        <h1
          style={{
            fontFamily: 'var(--font-display), system-ui, sans-serif',
            fontSize: '28px',
            fontWeight: 700,
            color: '#1b1c19',
            margin: 0,
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}
        >
          Welcome to OGuru
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-display), system-ui, sans-serif',
            fontSize: '16px',
            color: '#44483a',
            margin: 0,
            maxWidth: '320px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '24px',
          }}
        >
          How would you like to use the app?
        </p>
      </div>

      {/* Path selection cards */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px',
          padding: '32px 0',
          position: 'relative',
          zIndex: 1,
          maxWidth: '400px',
          width: '100%',
          alignSelf: 'center',
        }}
      >
        {/* Customer Card */}
        <button
          onClick={() => router.push('/home')}
          style={{
            padding: '28px 24px',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(119, 87, 77, 0.15)',
            borderRadius: '16px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(93, 64, 55, 0.06)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(93, 64, 55, 0.12)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(93, 64, 55, 0.06)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(74, 100, 16, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '28px',
              }}
            >
              🛒
            </div>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display), system-ui, sans-serif',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#1b1c19',
                  margin: 0,
                  marginBottom: '6px',
                  letterSpacing: '-0.01em',
                }}
              >
                I'm here to shop
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-display), system-ui, sans-serif',
                  fontSize: '14px',
                  color: '#44483a',
                  margin: 0,
                  lineHeight: '20px',
                }}
              >
                Discover vendors, pre-order, and send gifts to friends
              </p>
            </div>
            <div
              style={{
                fontSize: '20px',
                color: '#4a6410',
                marginTop: '18px',
              }}
            >
              →
            </div>
          </div>
        </button>

        {/* Vendor Card */}
        <button
          onClick={() => router.push('/vendor')}
          style={{
            padding: '28px 24px',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(119, 87, 77, 0.15)',
            borderRadius: '16px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(93, 64, 55, 0.06)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(93, 64, 55, 0.12)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(93, 64, 55, 0.06)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(146, 71, 0, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '28px',
              }}
            >
              🏪
            </div>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display), system-ui, sans-serif',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#1b1c19',
                  margin: 0,
                  marginBottom: '6px',
                  letterSpacing: '-0.01em',
                }}
              >
                I'm a vendor
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-display), system-ui, sans-serif',
                  fontSize: '14px',
                  color: '#44483a',
                  margin: 0,
                  lineHeight: '20px',
                }}
              >
                Reach new customers, use Ai to grow your business
              </p>
            </div>
            <div
              style={{
                fontSize: '20px',
                color: '#924700',
                marginTop: '18px',
              }}
            >
              →
            </div>
          </div>
        </button>
      </div>

      {/* Footer note */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#757969',
          margin: 0,
          marginBottom: '16px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        You can switch between modes anytime
      </p>
    </main>
  );
}
