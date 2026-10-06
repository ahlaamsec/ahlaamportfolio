'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lab } from '@/content/data';

type GridLab = Pick<Lab, 'slug' | 'title' | 'platform' | 'status' | 'objective' | 'findings'> & { full?: unknown };

export default function LabsGrid({ staticLabs }: { staticLabs: Lab[] }) {
  const [custom, setCustom] = useState<GridLab[]>([]);

  useEffect(() => {
    fetch('/api/entries')
      .then((r) => r.json())
      .then((d) => setCustom(d.labs || []))
      .catch(() => {});
  }, []);

  const all: GridLab[] = [...custom, ...staticLabs];

  return (
    <div className="grid cols-2" style={{ marginTop: '1.5rem' }}>
      {all.map((l) =>
        'full' in l && l.full ? (
          <Link className="tile" key={l.slug} href={`/cyber-lab/${l.slug}`}>
            <div className="thumb alt" />
            <p className="tag">{l.platform}</p>
            <h3>{l.title}</h3>
            <p className="note">{l.findings}</p>
          </Link>
        ) : (
          <Link className="tile" key={l.slug} href={`/cyber-lab/${l.slug}`} style={{ opacity: 0.85 }}>
            <div className="thumb" style={{ background: 'var(--surface-2)' }} />
            <p className="tag">{l.platform} · {l.status}</p>
            <h3>{l.title}</h3>
            <p className="note">{l.objective}</p>
          </Link>
        )
      )}
    </div>
  );
}
