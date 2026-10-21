import Link from 'next/link';
import { ReactNode } from 'react';

export default function PageHead({ kicker, title, lede, back, children }: {
  kicker: ReactNode;
  title?: ReactNode;
  lede?: ReactNode;
  back?: [string, string];
  children?: ReactNode;
}) {
  return (
    <section className="band band--black page-head">
      <div className="wrap">
        {back && <p className="hero__in" style={{ '--d': 0 } as React.CSSProperties}><Link className="back" href={back[1]}>← {back[0]}</Link></p>}
        <p className="kicker hero__in" style={{ '--d': 0 } as React.CSSProperties}>{kicker}</p>
        {title && <h1 className="display display--page hero__in" style={{ '--d': 1 } as React.CSSProperties}>{title}</h1>}
        {children}
        {lede && <div className="lede hero__in" style={{ '--d': 2 } as React.CSSProperties}>{lede}</div>}
      </div>
    </section>
  );
}
