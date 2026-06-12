import React from 'react';
import styles from './ResultBlock.module.css';

export default function ResultBlock({ result }) {
  return (
    <div className={styles.block}>
      <div className={styles.label}>YOUR RESULT</div>
      <p className={styles.text}>{result}</p>
    </div>
  );
}
