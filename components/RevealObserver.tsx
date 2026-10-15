'use client';
import { useEffect } from 'react';

// Fades in any element marked data-reveal as it scrolls into view. Also picks up
// elements that appear later (client-loaded entries, route changes).
export default function RevealObserver() {
  useEffect(() => {
    (window as Window & { __reveal?: boolean }).__reveal = true;
    if (!('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('js');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    const seen = new WeakSet<Element>();
    const scan = () => document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
      if (!seen.has(el)) { seen.add(el); io.observe(el); }
    });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  return null;
}
