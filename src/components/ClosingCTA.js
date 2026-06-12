import React from 'react';
import styles from './ClosingCTA.module.css';

export default function ClosingCTA() {
  return (
    <div className={styles.block}>
      <div className={styles.eyebrow}>WHAT COMES NEXT</div>
      <div className={styles.title}>
        You proved you can start. The AI Business Blueprint™ is how you build it properly.
      </div>
      <p className={styles.body}>
        Five phases — Clarity, Brand, Build, Package, Launch. It starts before the build. Phase 1 tells you exactly what type of AI business fits your life before you create a single thing. You already know what you're building. Now here's the system that gets you to your first sale.
      </p>
      <a
        href="https://theaitoolstack.com/product-details/product/ai-business-blueprint"
        className={styles.btn}
        target="_blank"
        rel="noopener noreferrer"
      >
        Get the AI Business Blueprint™ →
      </a>
    </div>
  );
}
