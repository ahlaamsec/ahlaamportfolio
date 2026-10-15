'use client';
import { useEffect, useState } from 'react';

type Line = { cmd?: string; out?: string };

// Types each command character by character, then prints its output. Shows everything at once for reduced motion.
export default function Terminal({ lines, label }: { lines: Line[]; label: string }) {
  const [step, setStep] = useState(0); // index of the line being typed
  const [chars, setChars] = useState(0);
  const done = step >= lines.length;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setStep(lines.length);
  }, [lines.length]);

  useEffect(() => {
    if (done) return;
    const cmd = lines[step].cmd ?? '';
    const t = chars < cmd.length
      ? setTimeout(() => setChars((c) => c + 1), 38 + Math.random() * 40)
      : setTimeout(() => { setStep((s) => s + 1); setChars(0); }, 420);
    return () => clearTimeout(t);
  }, [step, chars, done, lines]);

  return (
    <figure className="terminal" aria-label={label}>
      <div className="terminal__bar" aria-hidden>
        <span /><span /><span />
        <p>ahlaam@kumasi: ~</p>
      </div>
      <pre className="terminal__body" aria-hidden>
        {lines.slice(0, done ? lines.length : step + 1).map((l, i) => {
          const typing = i === step && !done;
          return (
            <span key={i} className="terminal__line">
              {l.cmd !== undefined && <><b>$</b> {typing ? l.cmd.slice(0, chars) : l.cmd}{typing && <i className="caret" />}{'\n'}</>}
              {!typing && l.out && <span className="terminal__out">{l.out}{'\n'}</span>}
            </span>
          );
        })}
        {done && <><b>$</b> <i className="caret" /></>}
      </pre>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
