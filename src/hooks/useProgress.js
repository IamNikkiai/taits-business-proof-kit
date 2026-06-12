import { useState, useEffect, useCallback } from 'react';

const SCRIPT_URL = process.env.REACT_APP_SCRIPT_URL;

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load progress on mount
  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    async function loadProgress() {
      try {
        const url = `${SCRIPT_URL}?action=get&email=${encodeURIComponent(email)}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.found) {
          setProgress({
            'day-1': data['day-1'] || 'no',
            'day-2': data['day-2'] || 'no',
            'day-3': data['day-3'] || 'no',
            'day-4': data['day-4'] || 'no',
            'day-5': data['day-5'] || 'no',
            sentence: data.sentence || '',
          });
        }
      } catch (err) {
        setError('Could not load your progress. Your work will still save when you complete each day.');
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [email]);

  // Save a single field update
  const saveField = useCallback(async (field, value) => {
    if (!email || !SCRIPT_URL) return;

    setSaving(true);
    const updated = { ...progress, [field]: value };
    setProgress(updated);

    try {
      const params = new URLSearchParams({
        action: 'save',
        email,
        ...updated,
      });
      await fetch(`${SCRIPT_URL}?${params.toString()}`);
    } catch (err) {
      // Silent fail — state is still updated locally
    } finally {
      setSaving(false);
    }
  }, [email, progress]);

  const isDayComplete = (dayNumber) => progress[`day-${dayNumber}`] === 'yes';

  const isDayUnlocked = (dayNumber) => {
    if (dayNumber === 1) return true;
    return progress[`day-${dayNumber - 1}`] === 'yes';
  };

  const completeDay = (dayNumber) => saveField(`day-${dayNumber}`, 'yes');

  const saveSentence = (text) => saveField('sentence', text);

  const allComplete = [1, 2, 3, 4, 5].every(isDayComplete);

  return {
    progress,
    loading,
    error,
    saving,
    isDayComplete,
    isDayUnlocked,
    completeDay,
    saveSentence,
    allComplete,
  };
}
