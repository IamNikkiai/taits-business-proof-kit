import React from 'react';
import { useCopy } from '../hooks/useCopy';
import styles from './PromptBlock.module.css';

export default function PromptBlock({ prompt, copyKey }) {
  const { copy, copiedKey } = useCopy();
  const copied = copiedKey === copyKey;

  return (
    <div className={styles.block}>
      <pre className={styles.text}>{prompt}</pre>
      <button
        className={copied ? styles.btnCopied : styles.btn}
        onClick={() => copy(prompt, copyKey)}
        aria-label={copied ? 'Copied' : 'Copy prompt to clipboard'}
      >
        {copied ? 'Copied ✓' : 'Copy Prompt'}
      </button>
    </div>
  );
}
