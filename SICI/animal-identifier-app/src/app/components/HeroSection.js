export default function HeroSection() {
  return (
    <section className="hero-material" style={{
      padding: '4rem 2rem 2rem',
      textAlign: 'center',
      background: 'linear-gradient(180deg, #05150b 0%, #0d2a17 100%)',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#00ff88' }}>
        EcoDex
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#b3d4c0', lineHeight: '1.5', maxWidth: '400px', margin: '0 auto' }}>
        Your personal, AI-powered field guide. Snap a photo and discover the wildlife around you instantly.
      </p>
    </section>
  );
}