'use client';

import { useEffect } from 'react';

export default function ScrollbarManager() {
  useEffect(() => {
    const timers = new WeakMap<Element, ReturnType<typeof setTimeout>>();

    function onScroll(e: Event) {
      const el = e.target as Element;
      el.classList.add('scrolling');
      const existing = timers.get(el);
      if (existing) clearTimeout(existing);
      timers.set(el, setTimeout(() => el.classList.remove('scrolling'), 1500));
    }

    document.addEventListener('scroll', onScroll, true);
    return () => document.removeEventListener('scroll', onScroll, true);
  }, []);

  return null;
}
