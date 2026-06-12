import { useState, useCallback } from 'react';

export function useCopy() {
  const [copiedKey, setCopiedKey] = useState(null);

  const copy = useCallback((text, key) => {
    try {
      navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1600);
  }, []);

  return { copy, copiedKey };
}
