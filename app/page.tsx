export default function Page() {
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
      }}
    >
      {/* Logo circle */}
      <div
        style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          backgroundColor: 'rgba(74, 100, 16, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle cx="50" cy="50" r="35" fill="#4a6410" opacity="0.15" />
          <circle cx="50" cy="50" r="25" fill="#4a6410" opacity="0.3" />
          <circle cx="50" cy="50" r="18" fill="#77574d" />
          <circle cx="43" cy="46" r="2" fill="#fbf9f4" />
          <circle cx="57" cy="46" r="2" fill="#fbf9f4" />
          <path
            d="M 42 54 Q 50 60 58 54"
            stroke="#fbf9f4"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* App name */}
      <h1
        style={{
          fontSize: '56px',
          fontWeight: 700,
          color: '#77574d',
          margin: 0,
          letterSpacing: '-0.02em',
        }}
      >
        OGuru
      </h1>

      {/* Tagline */}
      <p
        style={{
          marginTop: '12px',
          fontSize: '12px',
          color: '#44483a',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        Organic Marketplace
      </p>

      {/* Loading dots */}
      <div
        style={{
          position: 'absolute',
          bottom: '64px',
          display: 'flex',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#4a6410',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#4a6410',
            animation: 'pulse 1.5s ease-in-out 0.2s infinite',
          }}
        />
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#4a6410',
            animation: 'pulse 1.5s ease-in-out 0.4s infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  );
}
