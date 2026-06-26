import React, { useState, useEffect } from 'react';
import { DAYS } from './data/days';
import { useProgress } from './hooks/useProgress';
import Header from './components/Header';
import DayTabs from './components/DayTabs';
import DayContent from './components/DayContent';
import CompletionSection from './components/CompletionSection';
import ClosingCTA from './components/ClosingCTA';
import styles from './App.module.css';

function getEmailFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return (params.get('email') || '').toLowerCase().trim();
}

export default function App() {
  const email = getEmailFromUrl();
  const [activeDay, setActiveDay] = useState(0);
  const [sentence, setSentence] = useState('');

  const {
    loading,
    error,
    saving,
    checklistState,
    setChecklistItem,
    isDayComplete,
    isDayUnlocked,
    completeDay,
    saveSentence,
    allComplete,
  } = useProgress(email);

  const completedCount = [1, 2, 3, 4, 5].filter(isDayComplete).length;

  // Once progress loads, jump to the first incomplete (but unlocked) day
  useEffect(() => {
    if (loading) return;
    const firstIncomplete = [1, 2, 3, 4, 5].find(
      (n) => isDayUnlocked(n) && !isDayComplete(n)
    );
    if (firstIncomplete) setActiveDay(firstIncomplete - 1);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const day = DAYS[activeDay];

  const handleMarkDone = () => {
    completeDay(day.number);
    // Auto-advance to next day if not the last
    if (activeDay < DAYS.length - 1) {
      setTimeout(() => setActiveDay(activeDay + 1), 400);
    }
  };

  const handleSentenceChange = (val) => {
    setSentence(val);
  };

  const handleSentenceSave = () => {
    if (sentence.trim()) saveSentence(sentence.trim());
  };

  // No email in URL — show a friendly message
  if (!email) {
    return (
      <div className={styles.noEmail}>
        <div className={styles.noEmailCard}>
          <h1>Link not found</h1>
          <p>This link needs your personal access code to load your progress. Check your delivery email for the correct link.</p>
          <p>Questions? Email <a href="mailto:hello@theaitoolstack.com">hello@theaitoolstack.com</a></p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Header completedCount={completedCount} loading={loading} />
      <DayTabs
        days={DAYS}
        activeDay={activeDay}
        isDayComplete={isDayComplete}
        isDayUnlocked={isDayUnlocked}
        onSelect={setActiveDay}
      />

      <div className={styles.content}>
        {error && (
          <div className={styles.errorBanner}>{error}</div>
        )}

        {/* Active day card */}
        <div className={styles.dayCard}>
          <div className={styles.dayNum}>DAY {day.number} OF 5</div>
          <div className={styles.dayTitle}>{day.title}</div>

          <DayContent
            day={day}
            sentence={sentence}
            onSentenceChange={handleSentenceChange}
            checklistItems={checklistState[`day-${day.number}`]}
            onChecklistChange={(index, value) => setChecklistItem(`day-${day.number}`, index, value)}
          />

          {/* Mark done row */}
          <div className={styles.markRow}>
            <span className={isDayComplete(day.number) ? styles.completionMsg : styles.pendingMsg}>
              {isDayComplete(day.number) ? day.completionCopy : 'Mark day complete when you\'re done.'}
            </span>
            <div className={styles.markActions}>
              {day.number === 5 && !isDayComplete(5) && sentence.trim() && (
                <button className={styles.saveBtn} onClick={handleSentenceSave}>
                  Save Sentence
                </button>
              )}
              {!isDayComplete(day.number) && (
                <button
                  className={styles.markBtn}
                  onClick={handleMarkDone}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Mark Done'}
                </button>
              )}
              {isDayComplete(day.number) && (
                <button className={styles.markBtnDone} disabled>
                  ✓ Done
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Post-completion blocks */}
        {allComplete && <CompletionSection />}

        {/* CTA always visible */}
        <ClosingCTA />
      </div>
    </div>
  );
}
