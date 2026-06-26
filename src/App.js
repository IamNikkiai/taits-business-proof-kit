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
    progress,
    inputState,
    loading,
    error,
    saving,
    isDayComplete,
    isDayUnlocked,
    completeDay,
    saveSentence,
    setChecklistItem,
    setDay3Answer,
    resetDayInputs,
    resetAll,
    allComplete,
  } = useProgress(email);

  const completedCount = [1, 2, 3, 4, 5].filter(isDayComplete).length;

  // Once progress loads: sync sentence and jump to first incomplete unlocked day
  useEffect(() => {
    if (loading) return;
    setSentence(progress.sentence || '');
    const firstIncomplete = [1, 2, 3, 4, 5].find(
      (n) => isDayUnlocked(n) && !isDayComplete(n)
    );
    if (firstIncomplete) setActiveDay(firstIncomplete - 1);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const day = DAYS[activeDay];

  const handleMarkDone = () => {
    if (day.number === 5) {
      completeDay(5, sentence.trim());
    } else {
      completeDay(day.number);
    }
    if (activeDay < DAYS.length - 1) {
      setTimeout(() => setActiveDay(activeDay + 1), 400);
    }
  };

  const markDoneLabel = day.number === 5 ? 'Complete My Kit' : 'Mark Done';

  // No email in URL — show a friendly gate
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
        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.dayCard}>
          <div className={styles.dayNum}>DAY {day.number} OF 5</div>
          <div className={styles.dayTitle}>{day.title}</div>

          <DayContent
            day={day}
            sentence={sentence}
            onSentenceChange={setSentence}
            onSentenceBlur={saveSentence}
            checklistItems={inputState['day-1']}
            onChecklistChange={(index, value) => setChecklistItem(index, value)}
            day3Answers={inputState['day-3']}
            onDay3AnswerChange={setDay3Answer}
          />

          {/* Mark done row */}
          <div className={styles.markRow}>
            <span className={isDayComplete(day.number) ? styles.completionMsg : styles.pendingMsg}>
              {isDayComplete(day.number)
                ? day.completionCopy
                : "Mark day complete when you're done."}
            </span>
            <div className={styles.markActions}>
              {!isDayComplete(day.number) && (
                <button
                  className={styles.markBtn}
                  onClick={handleMarkDone}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : markDoneLabel}
                </button>
              )}
              {isDayComplete(day.number) && (
                <button className={styles.markBtnDone} disabled>
                  ✓ Done
                </button>
              )}
            </div>
          </div>

          {/* Clear & redo — only for days with saved inputs */}
          {isDayComplete(day.number) && (day.number === 1 || day.number === 3) && (
            <div className={styles.redoRow}>
              <button
                className={styles.redoBtn}
                onClick={() => resetDayInputs(day.number)}
              >
                ↩ Clear & redo this day's work
              </button>
            </div>
          )}
        </div>

        {allComplete && <CompletionSection onResetAll={resetAll} />}
        <ClosingCTA />
      </div>
    </div>
  );
}
