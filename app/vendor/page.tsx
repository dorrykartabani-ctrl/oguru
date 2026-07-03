'use client';

import { useRouter } from 'next/navigation';

const valueProps = [
  {
    icon: '📊',
    title: 'Ready-made audience',
    description: 'Hundreds of organic shoppers in your area are already looking for vendors like you.',
    color: '#4a6410',
    bgColor: 'rgba(74, 100, 16, 0.1)',
  },
  {
    icon: '🤖',
    title: 'AI marketing assistant',
    description: 'Auto-generate campaigns, social posts, and promotions. Marketing on autopilot.',
    color: '#924700',
    bgColor: 'rgba(146, 71, 0, 0.1)',
  },
  {
    icon: '📈',
    title: 'Smart customer insights',
    description: 'See what your customers love, when they buy, and how to bring them back.',
    color: '#77574d',
    bgColor: 'rgba(119, 87, 77, 0.1)',
  },
  {
    icon: '🎁',
    title: 'Gifting drives discovery',
    description: 'Customers gift your products to friends, introducing you to new audiences.',
    color: '#4a6410',
    bgColor: 'rgba(74, 100, 16, 0.1)',
  },
];

const steps = [
  {
    number: '01',
    title: 'Apply & get verified',
    description: 'Quick application, human review. We ensure quality for everyone.',
  },
  {
    number: '02',
    title: 'Connect your POS',
    description: 'Sync menu from Square, Toast, or others. Or add products manually.',
  },
  {
    number: '03',
    title: 'Start receiving orders',
    description: 'Customers pre-order, gift, and follow you. Payments go through your POS.',
  },
];

const testimonials = [
  {
    quote: 'OGuru brought us 30 new regulars in the first month. The AI writes better captions than I do!',
    author: 'Sarah',
    business: 'BrewHouse Café',
    emoji: '☕',
  },
  {
    quote: 'The gifting feature is brilliant. My honey gets sent as thank-you gifts constantly now.',
    author: 'Marcus',
    business: 'Wildflower Apiary',
    emoji: '🍯',
  },
];

export default function VendorLandingPage() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#fbf9f4',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '-150px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(74, 100, 16, 0.05)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '-150px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(146, 71, 0, 0.05)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top nav */}
      <nav
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.push('/get-started')}
          style={{
            background: 'none',
            border: 'none',
            color: '#44483a',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            padding: '8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'inherit',
          }}
        >
          ← Back
        </button>

        <img
          src="/logo.png"
          alt="OGuru"
          style={{ height: '32px', width: 'auto' }}
        />

        <button
          onClick={() => router.push('/vendor/login')}
          style={{
            background: 'none',
            border: 'none',
            color: '#4a6410',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '8px 0',
            fontFamily: 'inherit',
          }}
        >
          Sign in
        </button>
      </nav>

      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Hero Section */}
        <section
          style={{
            paddingTop: '32px',
            paddingBottom: '48px',
            textAlign: 'center',
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              backgroundColor: 'rgba(74, 100, 16, 0.1)',
              color: '#4a6410',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              fontFamily: 'var(--font-label), system-ui, sans-serif',
            }}
          >
            🌾 For Vendors
          </div>

          <h1
            style={{
              fontSize: '40px',
              fontWeight: 700,
              color: '#1b1c19',
              margin: 0,
              marginBottom: '16px',
              letterSpacing: '-0.02em',
              lineHeight: '48px',
              fontFamily: 'var(--font-display), system-ui, sans-serif',
            }}
          >
            Grow your business the organic way
          </h1>

          <p
            style={{
              fontSize: '17px',
              lineHeight: '26px',
              color: '#44483a',
              margin: 0,
              marginBottom: '32px',
            }}
          >
            Reach local customers who value quality, authenticity, and craft. Let AI handle the marketing so you can focus on what you do best.
          </p>

          <button
            onClick={() => router.push('/vendor/apply')}
            style={{
              width: '100%',
              padding: '18px 24px',
              backgroundColor: '#4a6410',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              fontFamily: 'var(--font-label), system-ui, sans-serif',
              transition: 'transform 0.15s ease, box-shadow 0.2s ease',
              boxShadow: '0 4px 12px rgba(74, 100, 16, 0.25)',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Apply Now →
          </button>

          <p
            style={{
              fontSize: '13px',
              color: '#757969',
              marginTop: '16px',
              margin: '16px 0 0 0',
            }}
          >
            Free to join · No monthly fees during beta
          </p>
        </section>

        {/* Value Props Section */}
        <section
          style={{
            paddingBottom: '48px',
          }}
        >
          <h2
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#4a6410',
              margin: 0,
              marginBottom: '20px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textAlign: 'center',
              fontFamily: 'var(--font-label), system-ui, sans-serif',
            }}
          >
            Why OGuru?
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {valueProps.map((prop, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid rgba(119, 87, 77, 0.1)',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  boxShadow: '0 2px 8px rgba(93, 64, 55, 0.04)',
                  animation: `fadeInUp 0.5s ease-out ${0.1 * index}s both`,
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: prop.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0,
                  }}
                >
                  {prop.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: '#1b1c19',
                      margin: 0,
                      marginBottom: '4px',
                      letterSpacing: '-0.01em',
                      fontFamily: 'var(--font-display), system-ui, sans-serif',
                    }}
                  >
                    {prop.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#44483a',
                      margin: 0,
                    }}
                  >
                    {prop.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section style={{ paddingBottom: '48px' }}>
          <h2
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#4a6410',
              margin: 0,
              marginBottom: '20px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textAlign: 'center',
              fontFamily: 'var(--font-label), system-ui, sans-serif',
            }}
          >
            How it works
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {steps.map((step, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#c5c8b6',
                    fontFamily: 'var(--font-display), system-ui, sans-serif',
                    lineHeight: 1,
                    flexShrink: 0,
                    minWidth: '48px',
                  }}
                >
                  {step.number}
                </div>
                <div style={{ flex: 1, paddingTop: '4px' }}>
                  <h3
                    style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: '#1b1c19',
                      margin: 0,
                      marginBottom: '4px',
                      letterSpacing: '-0.01em',
                      fontFamily: 'var(--font-display), system-ui, sans-serif',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#44483a',
                      margin: 0,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ paddingBottom: '48px' }}>
          <h2
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#4a6410',
              margin: 0,
              marginBottom: '20px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textAlign: 'center',
              fontFamily: 'var(--font-label), system-ui, sans-serif',
            }}
          >
            From our vendors
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'rgba(74, 100, 16, 0.05)',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid rgba(74, 100, 16, 0.1)',
                }}
              >
                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: '22px',
                    color: '#1b1c19',
                    margin: 0,
                    marginBottom: '12px',
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(74, 100, 16, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                    }}
                  >
                    {testimonial.emoji}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#1b1c19',
                        margin: 0,
                      }}
                    >
                      {testimonial.author}
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#757969',
                        margin: 0,
                      }}
                    >
                      {testimonial.business}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section
          style={{
            paddingBottom: '48px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              padding: '32px 24px',
              background: 'linear-gradient(135deg, #4a6410 0%, #627e29 100%)',
              borderRadius: '20px',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(74, 100, 16, 0.25)',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 700,
                margin: 0,
                marginBottom: '8px',
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-display), system-ui, sans-serif',
              }}
            >
              Ready to grow?
            </h2>
            <p
              style={{
                fontSize: '15px',
                margin: 0,
                marginBottom: '24px',
                opacity: 0.9,
                lineHeight: '22px',
              }}
            >
              Apply in under 5 minutes. Get verified. Start selling.
            </p>
            <button
              onClick={() => router.push('/vendor/apply')}
              style={{
                width: '100%',
                padding: '16px 24px',
                backgroundColor: '#ffffff',
                color: '#4a6410',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.05em',
                fontFamily: 'var(--font-label), system-ui, sans-serif',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Apply Now →
            </button>
          </div>

          <p
            style={{
              fontSize: '13px',
              color: '#757969',
              marginTop: '20px',
              margin: '20px 0 0 0',
            }}
          >
            Already a vendor?{' '}
            <button
              onClick={() => router.push('/vendor/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#4a6410',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
                fontSize: '13px',
                textDecoration: 'underline',
              }}
            >
              Sign in here
            </button>
          </p>
        </section>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
