import styles from "./AboutMission.module.css";

export default function AboutMission() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Our Mission</h2>
        <p className={styles.text}>
          We unite Artificial Intelligence with the wonders of nature to empower you in identifying, learning, and protecting wildlife. Every discovery brings us closer to a sustainable planet.
        </p>
      </div>
    </section>
  );
}