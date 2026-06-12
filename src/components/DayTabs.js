import React from 'react';
import styles from './DayTabs.module.css';

export default function DayTabs({ days, activeDay, isDayComplete, isDayUnlocked, onSelect }) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Days">
      {days.map((day, i) => {
        const complete = isDayComplete(day.number);
        const unlocked = isDayUnlocked(day.number);
        const active = activeDay === i;

        return (
          <button
            key={day.number}
            role="tab"
            aria-selected={active}
            disabled={!unlocked}
            onClick={() => unlocked && onSelect(i)}
            className={[
              styles.tab,
              active ? styles.active : '',
              complete && !active ? styles.done : '',
              !unlocked ? styles.locked : '',
            ].join(' ')}
          >
            {complete && (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <circle cx="6.5" cy="6.5" r="6.5" fill={active ? '#000' : '#B8952A'} />
                <path d="M3.5 6.5l2.2 2.2L9.5 4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {!unlocked && (
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden="true">
                <rect x="1" y="5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M3 5V3.5a2.5 2.5 0 015 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            )}
            Day {day.number}
          </button>
        );
      })}
    </div>
  );
}
