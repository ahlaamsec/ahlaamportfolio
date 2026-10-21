'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Counts one page view per page change. The outside site that sent someone
// here is only reported on the first page they land on.
export default function VisitTracker() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!pathname) return;
    const referrer = first.current ? document.referrer : '';
    first.current = false;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, referrer }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
