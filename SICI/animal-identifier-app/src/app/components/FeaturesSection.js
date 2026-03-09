import styles from "./FeaturesSection.module.css";

const features = [
  { icon: "⚡", title: "Powered by Gemini", desc: "Lightning fast, accurate generative AI." },
  { icon: "🌍", title: "Conservation First", desc: "Learn how to protect vulnerable wildlife." },
  { icon: "📚", title: "Personal Log", desc: "Build your own digital field guide over time." },
];

export default function FeaturesSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Why EcoDex?</h2>
      <div className={styles.grid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.iconPlaceholder}>{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}