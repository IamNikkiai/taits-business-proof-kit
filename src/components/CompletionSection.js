import React, { useState } from 'react';
import { useCopy } from '../hooks/useCopy';
import { LAUNCH_CHECKLIST, SHARE_CAPTION } from '../data/days';
import styles from './CompletionSection.module.css';

function CheckItem({ label, checked, onChange }) {
  return (
    <button className={styles.checkItem} onClick={onChange} role="checkbox" aria-checked={checked}>
      <div className={checked ? styles.checkBoxChecked : styles.checkBox}>
        {checked && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
            <path d="M1 5l3.5 3.5L11 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={checked ? styles.checkTextDone : styles.checkText}>{label}</span>
    </button>
  );
}

export default function CompletionSection({ onResetAll }) {
  const { copy, copiedKey } = useCopy();
  const [launchChecks, setLaunchChecks] = useState(Array(LAUNCH_CHECKLIST.length).fill(false));

  const toggleLaunch = (i) => {
    const next = [...launchChecks];
    next[i] = !next[i];
    setLaunchChecks(next);
  };

  return (
    <div className={styles.wrap}>
      {/* Completion card */}
      <div className={styles.completionCard}>
        <div className={styles.completionLabel}>COMPLETE</div>
        <div className={styles.completionTitle}>The 5-Day Business Proof Kit™ — Complete.</div>
        <p className={styles.completionBody}>
          You came in without a sentence. You're leaving with one.
          <br /><br />
          You also have a configured workspace, a piece of content, a named skill, and an offer with a price. That's not nothing. That's more than most people have after six months of "figuring out AI."
          <br /><br />
          You didn't just finish something. You proved something.
        </p>
      </div>

      {/* Share block */}
      <div className={styles.card}>
        <div className={styles.sectionLabel}>YOUR PROOF IS SHAREABLE</div>
        <p className={styles.body}>
          Screenshot your sentence. Share it wherever you show up online. Tag @theaitoolstack or reply to your delivery email — Nicole reads every one.
        </p>
        <p className={styles.subBody}>
          You're not sharing an ad. You're sharing proof of something you built.
        </p>
        <pre className={styles.shareText}>{SHARE_CAPTION}</pre>
        <button
          className={copiedKey === 'share' ? styles.btnCopied : styles.btn}
          onClick={() => copy(SHARE_CAPTION, 'share')}
        >
          {copiedKey === 'share' ? 'Copied ✓' : 'Copy Caption'}
        </button>
      </div>

      {/* First Launch Checklist */}
      <div className={styles.card}>
        <div className={styles.bonusBadge}>
          Founding Member Bonus — included because you joined during the launch window.
        </div>
        <div className={styles.bonusTitle}>WHAT TO DO IN THE NEXT 48 HOURS</div>
        {LAUNCH_CHECKLIST.map((item, i) => (
          <CheckItem
            key={i}
            label={item}
            checked={launchChecks[i]}
            onChange={() => toggleLaunch(i)}
          />
        ))}
      </div>

      {/* Start Over */}
      <div className={styles.resetSection}>
        <p className={styles.resetLabel}>Want to go through the kit again with fresh eyes?</p>
        <button
          className={styles.resetBtn}
          onClick={() => {
            if (window.confirm('This will clear all your progress and answers so you can start fresh. Continue?')) {
              onResetAll && onResetAll();
            }
          }}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
