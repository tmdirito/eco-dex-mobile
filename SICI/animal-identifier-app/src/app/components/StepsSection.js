import styles from "./StepsSection.module.css";

export default function StepsSection() {
  const steps = [
    { num: "1", title: "Upload a Photo", desc: "Take a picture or select one from your gallery." },
    { num: "2", title: "AI Analysis", desc: "Our Gemini-powered model identifies the species in seconds." },
    { num: "3", title: "Learn & Save", desc: "Get detailed conservation info and save it to your history." },
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>How it Works</h2>
      <div>
        {steps.map((step, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.circle}>{step.num}</div>
            <div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}