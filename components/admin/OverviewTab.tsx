'use client';
import { useEffect, useState } from 'react';

type Stats = {
  range: number;
  days: { date: string; views: number; visitors: number }[];
  totals: {
    live: number; todayViews: number; todayVisitors: number;
    rangeViews: number; rangeVisitors: number; weekVisitors: number;
    allViews: number; allVisitors: number;
  };
  pages: [string, number][];
  referrers: [string, number][];
  countries: [string, number][];
  devices: [string, number][];
};

const fmt = (n: number) => n.toLocaleString();
const dayLabel = (d: string, opts: Intl.DateTimeFormatOptions) => new Date(`${d}T00:00:00Z`).toLocaleDateString(undefined, { timeZone: 'UTC', ...opts });

let regionNames: Intl.DisplayNames | null = null;
function countryName(code: string) {
  try {
    regionNames ??= new Intl.DisplayNames(undefined, { type: 'region' });
    return regionNames.of(code) || code;
  } catch {
    return code;
  }
}

function pageName(path: string) {
  if (path === '/') return 'Home';
  return path;
}

export default function OverviewTab() {
  const [range, setRange] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () => fetch(`/api/stats?days=${range}`)
      .then((r) => r.json())
      .then((d) => { if (!alive) return; if (d.ok) { setStats(d); setError(null); } else setError(d.error || 'Could not load visitor numbers.'); })
      .catch(() => alive && setError('Network error.'));
    load();
    // Refresh every minute so "on the site now" stays current.
    const t = setInterval(load, 60_000);
    return () => { alive = false; clearInterval(t); };
  }, [range]);

  return (
    <div className="overview">
      <div className="overview__bar">
        <p className="note">Visitors are counted once per day per device. Bots, your own visits while logged in, and people with "do not track" switched on are left out. No cookies are used.</p>
        <div className="chips" role="group" aria-label="Time range">
          {[7, 30, 90].map((n) => (
            <button key={n} type="button" aria-pressed={range === n} onClick={() => setRange(n)}>Last {n} days</button>
          ))}
        </div>
      </div>

      {error && <p className="admin-warn">{error}</p>}
      {!stats && !error && <p className="muted">Loading…</p>}

      {stats && (
        <>
          <dl className="tiles">
            <div className="tile-stat tile-stat--live"><dt>On the site now</dt><dd>{fmt(stats.totals.live)}</dd><span className="note">last 5 minutes</span></div>
            <div className="tile-stat"><dt>Visitors today</dt><dd>{fmt(stats.totals.todayVisitors)}</dd><span className="note">{fmt(stats.totals.todayViews)} page views</span></div>
            <div className="tile-stat"><dt>Visitors, last 7 days</dt><dd>{fmt(stats.totals.weekVisitors)}</dd></div>
            <div className="tile-stat"><dt>Visitors, last {stats.range} days</dt><dd>{fmt(stats.totals.rangeVisitors)}</dd><span className="note">{fmt(stats.totals.rangeViews)} page views</span></div>
            <div className="tile-stat"><dt>All time</dt><dd>{fmt(stats.totals.allVisitors)}</dd><span className="note">{fmt(stats.totals.allViews)} page views</span></div>
          </dl>

          <DailyChart days={stats.days} />

          <div className="overview__lists">
            <RankList title="Most viewed pages" unit="views" rows={stats.pages.map(([p, n]) => [pageName(p), n, p])} empty="No page views yet." />
            <RankList title="Where visitors came from" unit="visits" rows={stats.referrers.map(([h, n]) => [h, n])} empty="No outside links yet. Visits typed in directly or from apps aren't listed." />
            <RankList title="Countries" unit="views" rows={stats.countries.map(([c, n]) => [countryName(c), n])} empty="Countries show once the site is live on Vercel." />
            <RankList title="Devices" unit="views" rows={stats.devices.map(([d, n]) => [d[0].toUpperCase() + d.slice(1), n])} empty="No data yet." />
          </div>
        </>
      )}
    </div>
  );
}

// One series (visitors per day), so the chart's title names it and no legend is needed.
function DailyChart({ days }: { days: Stats['days'] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...days.map((d) => d.visitors));
  const W = 720, H = 220, PAD_L = 44, PAD_B = 32, PAD_T = 12;
  const plotW = W - PAD_L, plotH = H - PAD_B - PAD_T;
  const slot = plotW / days.length;
  const barW = Math.max(2, slot - 2);
  const ticks = niceTicks(max);
  const y = (v: number) => PAD_T + plotH - (v / ticks[ticks.length - 1]) * plotH;
  const labelEvery = Math.ceil(days.length / 6);
  const h = hover !== null ? days[hover] : null;

  return (
    <figure className="chart">
      <figcaption className="chart__head">
        <h3>Visitors per day</h3>
        <span className="note">{h ? `${dayLabel(h.date, { weekday: 'short', month: 'short', day: 'numeric' })}: ${fmt(h.visitors)} visitors, ${fmt(h.views)} page views` : 'Point at a bar for the numbers.'}</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart__svg" role="img" aria-label={`Visitors per day over the last ${days.length} days`} onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD_L} x2={W} y1={y(t)} y2={y(t)} className="chart__grid" />
            <text x={PAD_L - 6} y={y(t)} className="chart__axis" textAnchor="end" dominantBaseline="middle">{t}</text>
          </g>
        ))}
        {days.map((d, i) => {
          const x = PAD_L + i * slot + (slot - barW) / 2;
          const top = y(d.visitors);
          const bh = Math.max(0, PAD_T + plotH - top);
          const r = Math.min(4, barW / 2, bh);
          return (
            <g key={d.date}>
              {bh > 0 && (
                <path
                  className={`chart__bar${hover === i ? ' is-hover' : ''}`}
                  d={`M${x},${top + bh} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${top + bh} Z`}
                />
              )}
              {/* Full-height hit area, wider than the bar, so small days are easy to point at. */}
              <rect x={PAD_L + i * slot} y={PAD_T} width={slot} height={plotH} fill="transparent" onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} tabIndex={-1}>
                <title>{`${dayLabel(d.date, { month: 'short', day: 'numeric' })}: ${d.visitors} visitors, ${d.views} page views`}</title>
              </rect>
              {i % labelEvery === 0 && (
                <text x={PAD_L + i * slot + slot / 2} y={H - 6} className="chart__axis" textAnchor="middle">{dayLabel(d.date, { month: 'short', day: 'numeric' })}</text>
              )}
            </g>
          );
        })}
        <line x1={PAD_L} x2={W} y1={PAD_T + plotH} y2={PAD_T + plotH} className="chart__base" />
      </svg>
      <details className="chart__table">
        <summary className="mono">Show as a table</summary>
        <table>
          <thead><tr><th>Day</th><th>Visitors</th><th>Page views</th></tr></thead>
          <tbody>
            {[...days].reverse().map((d) => (
              <tr key={d.date}><td>{dayLabel(d.date, { weekday: 'short', month: 'short', day: 'numeric' })}</td><td>{d.visitors}</td><td>{d.views}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

function niceTicks(max: number): number[] {
  const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10000];
  const step = steps.find((s) => max / s <= 4) || Math.ceil(max / 4);
  const out: number[] = [];
  for (let v = 0; v <= max + step - 1 && out.length < 6; v += step) out.push(v);
  if (out[out.length - 1] < max) out.push(out[out.length - 1] + step);
  return out;
}

function RankList({ title, unit, rows, empty }: { title: string; unit: string; rows: [string, number, string?][]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <section className="rank">
      <h3>{title}</h3>
      {rows.length === 0 ? <p className="note">{empty}</p> : (
        <ol>
          {rows.map(([label, n, href]) => (
            <li key={label}>
              <span className="rank__meter" style={{ width: `${(n / max) * 100}%` }} aria-hidden />
              <span className="rank__label">{href ? <a href={href} target="_blank" rel="noreferrer">{label}</a> : label}</span>
              <span className="rank__n" title={`${n} ${unit}`}>{fmt(n)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
