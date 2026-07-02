'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const slides = [
  {
    emoji: '🌾',
    title: 'Real food. Real people.',
    description: 'Discover local artisans, farmers, and cafés. Every vendor on OGuru is verified and vetted.',
  },
  {
    emoji: '⚡',
    title: 'Skip the queue',
    description: 'Pre-order from your favourites, gift treats to friends, and never miss a fresh drop.',
  },
  {
    emoji: '📈',
    title: 'Grow your business',
    description: 'Vendors reach local customers, run smart campaigns, and let AI handle the marketing.',
  },
  {
    emoji: '🌿',
    title: 'Better together',
    description: 'Join a community that celebrates local, organic, and artisan producers.',
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      router.push('/get-started');
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    router.push('/get-started');
  };

  const slide = slides[currentSlide];

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
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '-80px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(74, 100, 16, 0.05)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '-80px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(146, 71, 0, 0.05)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontSize: '12px',
            color: '#44483a',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 600,
            margin: 0,
          }}
        >
          {currentSlide + 1} of {slides.length}
        </p>

        <button
          onClick={handleSkip}
          style={{
            background: 'none',
            border: 'none',
            color: '#44483a',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            padding: '8px 12px',
            fontFamily: 'inherit',
          }}
        >
          Skip
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
        key={currentSlide}
      >
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(74, 100, 16, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '48px',
            animation: 'fadeInScale 0.5s ease-out',
          }}
        >
          <span style={{ fontSize: '96px', lineHeight: 1 }}>
            {slide.emoji}
          </span>
        </div>

        <h1
  style={{
    fontSize: '32px',
    fontWeight: 700,
    color: '#1b1c19',
    margin: 0,
    marginBottom: '16px',
    letterSpacing: '-0.02em',
    maxWidth: '400px',
    animation: 'fadeInUp 0.5s ease-out 0.1s both',
    fontFamily: 'var(--font-display), system-ui, sans-serif',
  }}
>
  {slide.title}
</h1>

        <p
          style={{
            fontSize: '17px',
            lineHeight: '26px',
            color: '#44483a',
            margin: 0,
            maxWidth: '340px',
            animation: 'fadeInUp 0.5s ease-out 0.2s both',
          }}
        >
          {slide.description}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {slides.map((_, index) => (
          <div
            key={index}
            style={{
              width: index === currentSlide ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: index === currentSlide ? '#4a6410' : 'rgba(74, 100, 16, 0.25)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        style={{
          width: '100%',
          maxWidth: '400px',
          alignSelf: 'center',
          padding: '16px 24px',
          backgroundColor: '#4a6410',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '0.05em',
          fontFamily: 'inherit',
          transition: 'transform 0.15s ease',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 1,
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {isLastSlide ? 'Get Started →' : 'Next →'}
      </button>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
