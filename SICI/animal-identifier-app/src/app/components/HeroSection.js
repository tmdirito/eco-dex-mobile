"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const videos = [
    "/videos/nature-love.mp4",
  ];

  const [video, setVideo] = useState(null);

  useEffect(() => {
    // Select the video only after the component mounts on the client
    const random = videos[Math.floor(Math.random() * videos.length)];
    setVideo(random);
  }, []);

  return (
    <section className={styles.heroSection}>
      {/* ADDED: Background fallback if video fails */}
      <div className={styles.heroBgFallback}></div> 

      {video && (
        <video
          key={video}
          autoPlay
          loop
          muted
          playsInline
          className={styles.backgroundVideo}
          poster="/images/hero-poster.jpg" // <--- CRITICAL: Add a static image here
        >
          <source src={video} type="video/mp4" />
        </video>
      )}

      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <h1 className={styles.title}>Discover the Wild with AI</h1>
        <p className={styles.subtitle}>
          Upload a photo and uncover the secrets of wildlife — from species name
          to conservation status.
        </p>

        <div className={styles.buttons}>
          <Link href="/dashboard" className={styles.primaryBtn}>
            Get Started
          </Link>
          <Link href="#how-it-works" className={styles.secondaryBtn}>
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}