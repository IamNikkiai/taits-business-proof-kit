import { useState, useEffect, useCallback, useRef } from 'react';

const SCRIPT_URL = process.env.REACT_APP_SCRIPT_URL;

const DEFAULT_INPUT = {
  'day-1': [false, false, false, false, false],
  'day-3': ['', '', '', '', ''],
};

const DEFAULT_PROGRESS = {
  'day-1': 'no',
  'day-2': 'no',
  'day-3': 'no',
  'day-4': 'no',
  'day-5': 'no',
  sentence: '',
};

export function useProgress(email) {
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [inputState, setInputState] = useState(DEFAULT_INPUT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Refs so save callbacks always see latest state without stale closures
  const progressRef = useRef(DEFAULT_PROGRESS);
  const inputRef = useRef(DEFAULT_INPUT);
  const debounceRef = useRef(null);

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { inputRef.current = inputState; }, [inputState]);

  // ── Load all progress on mount ──────────────────────────────────────────
  useEffect(() => {
    if (!email) { setLoading(false); return; }

    async function load() {
      try {
        const url = `${SCRIPT_URL}?action=get&email=${encodeURIComponent(email)}`;
        const res = await fetch(url);
        const text = await res.text();
        const data = JSON.parse(text);

        if (data.found) {
          const loaded = {
            'day-1': data['day-1'] || 'no',
            'day-2': data['day-2'] || 'no',
            'day-3': data['day-3'] || 'no',
            'day-4': data['day-4'] || 'no',
            'day-5': data['day-5'] || 'no',
            sentence: data.sentence || '',
          };
          setProgress(loaded);
          progressRef.current = loaded;

          if (data['checklist-state']) {
            try {
              const parsed = JSON.parse(data['checklist-state']);
              const merged = { ...DEFAULT_INPUT, ...parsed };
              setInputState(merged);
              inputRef.current = merged;
            } catch (_) {}
          }
        }
      } catch (_) {
        setError('Could not load your progress. Keep going — your work will save as you complete each day.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [email]);

  // ── Core persist — always sends full current state ──────────────────────
  const persist = useCallback(async (pOverride, iOverride) => {
    if (!email || !SCRIPT_URL) return;
    const p = pOverride ?? progressRef.current;
    const inp = iOverride ?? inputRef.current;
    try {
      const params = new URLSearchParams({
        action: 'save',
        email,
        ...p,
        'checklist-state': JSON.stringify(inp),
      });
      await fetch(`${SCRIPT_URL}?${params.toString()}`);
    } catch (_) {}
  }, [email]);

  // ── Mark a day complete (Day 5 can pass sentence to co-save) ───────────
  const completeDay = useCallback((dayNumber, sentenceText) => {
    setSaving(true);
    const updated = { ...progressRef.current, [`day-${dayNumber}`]: 'yes' };
    if (sentenceText !== undefined) updated.sentence = sentenceText;
    setProgress(updated);
    progressRef.current = updated;
    persist(updated, null).finally(() => setSaving(false));
  }, [persist]);

  // ── Save sentence (call on textarea blur) ───────────────────────────────
  const saveSentence = useCallback((text) => {
    const updated = { ...progressRef.current, sentence: text };
    setProgress(updated);
    progressRef.current = updated;
    persist(updated, null);
  }, [persist]);

  // ── Day 1: toggle checklist item (immediate save) ───────────────────────
  const setChecklistItem = useCallback((index, value) => {
    const items = [...(inputRef.current['day-1'] || [false, false, false, false, false])];
    items[index] = value;
    const updated = { ...inputRef.current, 'day-1': items };
    setInputState(updated);
    inputRef.current = updated;
    persist(null, updated);
  }, [persist]);

  // ── Day 3: update answer (debounced 1.5s save) ──────────────────────────
  const setDay3Answer = useCallback((index, value) => {
    const answers = [...(inputRef.current['day-3'] || ['', '', '', '', ''])];
    answers[index] = value;
    const updated = { ...inputRef.current, 'day-3': answers };
    setInputState(updated);
    inputRef.current = updated;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => persist(null, updated), 1500);
  }, [persist]);

  // ── Clear a day's typed content (keeps completion status) ───────────────
  const resetDayInputs = useCallback((dayNumber) => {
    const updated = { ...inputRef.current };
    if (dayNumber === 1) updated['day-1'] = [false, false, false, false, false];
    if (dayNumber === 3) updated['day-3'] = ['', '', '', '', ''];
    setInputState(updated);
    inputRef.current = updated;
    persist(null, updated);
  }, [persist]);

  // ── Full reset — wipes all progress and inputs ──────────────────────────
  const resetAll = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    setInputState(DEFAULT_INPUT);
    progressRef.current = DEFAULT_PROGRESS;
    inputRef.current = DEFAULT_INPUT;
    persist(DEFAULT_PROGRESS, DEFAULT_INPUT);
  }, [persist]);

  const isDayComplete = (dayNumber) => progress[`day-${dayNumber}`] === 'yes';

  const isDayUnlocked = (dayNumber) => {
    if (dayNumber === 1) return true;
    return progress[`day-${dayNumber - 1}`] === 'yes';
  };

  const allComplete = [1, 2, 3, 4, 5].every(isDayComplete);

  return {
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
  };
}
