export default function HeroSection() {
  return (
    <section className="hero-material" style={{ padding: '4rem 2rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: 'var(--accent-color)' }}>
        EcoDex
      </h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.5', maxWidth: '400px', margin: '0 auto' }}>
        Your personal, AI-powered field guide. Snap a photo and discover the wildlife around you instantly.
      </p>
    </section>
  );
}