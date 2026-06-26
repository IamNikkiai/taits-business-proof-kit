import React from 'react';
import PromptBlock from './PromptBlock';
import ResultBlock from './ResultBlock';
import styles from './DayContent.module.css';

function SectionLabel({ children }) {
  return <div className={styles.sectionLabel}>{children}</div>;
}

function CheckItem({ label, checked, onChange }) {
  return (
    <button
      className={styles.checkItem}
      onClick={onChange}
      role="checkbox"
      aria-checked={checked}
    >
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

// Day 1 — checklist + prompt (checks come from Sheets via props)
function Day1Content({ day, checklistItems, onChecklistChange }) {
  const checks = checklistItems || Array(day.checklist.length).fill(false);
  const allChecked = checks.every(Boolean);

  return (
    <>
      <SectionLabel>TASK</SectionLabel>
      <p className={styles.body}>{day.task}</p>
      <SectionLabel>
        CHECKLIST{allChecked ? ' — all done ✓' : ` — ${checks.filter(Boolean).length} of ${checks.length}`}
      </SectionLabel>
      <div className={styles.checkList}>
        {day.checklist.map((item, i) => (
          <CheckItem
            key={i}
            label={item}
            checked={!!checks[i]}
            onChange={() => onChecklistChange(i, !checks[i])}
          />
        ))}
      </div>
      <SectionLabel>AI PROMPT</SectionLabel>
      <PromptBlock prompt={day.prompt} copyKey="day1-prompt" />
      <ResultBlock result={day.result} />
    </>
  );
}

// Day 2 — prompt only
function Day2Content({ day }) {
  return (
    <>
      <SectionLabel>TASK</SectionLabel>
      <p className={styles.body}>{day.task}</p>
      <SectionLabel>AI PROMPT</SectionLabel>
      <PromptBlock prompt={day.prompt} copyKey="day2-prompt" />
      <ResultBlock result={day.result} />
    </>
  );
}

// Day 3 — questions + dynamic prompt (answers come from Sheets via props)
function Day3Content({ day, answers, onAnswerChange }) {
  const vals = answers || Array(5).fill('');

  const filledPrompt = day.promptTemplate
    .replace('[Q1]', vals[0] || '[PASTE ANSWER TO QUESTION 1]')
    .replace('[Q2]', vals[1] || '[PASTE ANSWER TO QUESTION 2]')
    .replace('[Q3]', vals[2] || '[PASTE ANSWER TO QUESTION 3]')
    .replace('[Q4]', vals[3] || '[PASTE ANSWER TO QUESTION 4]')
    .replace('[Q5]', vals[4] || '[PASTE ANSWER TO QUESTION 5]');

  return (
    <>
      <SectionLabel>TASK</SectionLabel>
      <p className={styles.body}>{day.task}</p>
      <SectionLabel>THE 5 QUESTIONS</SectionLabel>
      <div className={styles.questions}>
        {day.questions.map((q, i) => (
          <div key={i} className={styles.questionItem}>
            <label className={styles.qLabel}>{i + 1}. {q}</label>
            <textarea
              className={styles.qInput}
              rows={2}
              placeholder="Your answer..."
              value={vals[i]}
              onChange={(e) => onAnswerChange(i, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className={styles.fallback}>{day.fallback}</div>
      <SectionLabel>AI PROMPT</SectionLabel>
      <p className={styles.hint}>Fill in your answers above, then copy this prompt with your answers included.</p>
      <PromptBlock prompt={filledPrompt} copyKey="day3-prompt" />
      <ResultBlock result={day.result} />
    </>
  );
}

// Day 4 — naming formula + pricing + prompt
function Day4Content({ day }) {
  return (
    <>
      <SectionLabel>TASK</SectionLabel>
      <p className={styles.body}>{day.task}</p>
      <SectionLabel>THE NAMING FORMULA</SectionLabel>
      <pre className={styles.codeBlock}>{day.namingFormula}</pre>
      <SectionLabel>THE PRICING FRAMEWORK</SectionLabel>
      <div className={styles.pricingTable}>
        {day.pricingTiers.map((tier, i) => (
          <div key={i} className={styles.priceRow}>
            <span className={styles.priceRange}>{tier.range}</span>
            <span className={styles.priceCond}>{tier.condition}</span>
          </div>
        ))}
        <div className={styles.priceNote}>{day.pricingNote}</div>
      </div>
      <SectionLabel>AI PROMPT</SectionLabel>
      <PromptBlock prompt={day.prompt} copyKey="day4-prompt" />
      <ResultBlock result={day.result} />
    </>
  );
}

// Day 5 — formula + prompt + sentence input (sentence synced from Sheets via props)
function Day5Content({ day, sentence, onSentenceChange, onSentenceBlur }) {
  return (
    <>
      <SectionLabel>TASK</SectionLabel>
      <p className={styles.body}>{day.task}</p>
      <SectionLabel>THE FORMULA</SectionLabel>
      <pre className={styles.codeBlock}>{day.formula}</pre>
      <SectionLabel>AI PROMPT</SectionLabel>
      <PromptBlock prompt={day.prompt} copyKey="day5-prompt" />
      <SectionLabel>YOUR SENTENCE</SectionLabel>
      <div className={styles.sentenceWrap}>
        <textarea
          className={styles.sentenceInput}
          rows={3}
          placeholder="I help..."
          value={sentence}
          onChange={(e) => onSentenceChange(e.target.value)}
          onBlur={(e) => onSentenceBlur && onSentenceBlur(e.target.value)}
        />
        <p className={styles.sentenceHint}>
          Write the one that sounds most like you. This is your sentence — not AI's. Edit it until it sounds right. It saves automatically when you click away.
        </p>
      </div>
      <ResultBlock result={day.result} />
    </>
  );
}

export default function DayContent({
  day,
  sentence,
  onSentenceChange,
  onSentenceBlur,
  checklistItems,
  onChecklistChange,
  day3Answers,
  onDay3AnswerChange,
}) {
  const n = day.number;
  return (
    <div className={styles.wrap}>
      {n === 1 && (
        <Day1Content
          day={day}
          checklistItems={checklistItems}
          onChecklistChange={onChecklistChange}
        />
      )}
      {n === 2 && <Day2Content day={day} />}
      {n === 3 && (
        <Day3Content
          day={day}
          answers={day3Answers}
          onAnswerChange={onDay3AnswerChange}
        />
      )}
      {n === 4 && <Day4Content day={day} />}
      {n === 5 && (
        <Day5Content
          day={day}
          sentence={sentence}
          onSentenceChange={onSentenceChange}
          onSentenceBlur={onSentenceBlur}
        />
      )}
    </div>
  );
}
