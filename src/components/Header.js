import React from 'react';
import styles from './Header.module.css';

export default function Header({ completedCount, loading }) {
  const pct = (completedCount / 5) * 100;

  return (
    <div className={styles.header}>
      <span className={styles.badge}>Built for Curious Carla</span>
      <h1 className={styles.title}>The 5-Day Product Proof Kit™</h1>
      <p className={styles.sub}>
        One task. One prompt. One result — every day for 5 days. By Day 5, you'll have a real product — named, priced, and yours.
      </p>
      {loading ? (
        <p className={styles.loading}>Loading your progress...</p>
      ) : (
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
          <span className={styles.progressLabel}>{completedCount} of 5</span>
        </div>
      )}
    </div>
  );
}
