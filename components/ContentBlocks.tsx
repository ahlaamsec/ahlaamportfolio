const IMG_RE = /^!\[([^\]]*)\]\((.+)\)$/;

export default function ContentBlocks({ blocks }: { blocks: string[] }) {
  const out: React.ReactNode[] = [];
  let bulletBuf: string[] = [];

  function flushBullets(key: string) {
    if (bulletBuf.length === 0) return;
    out.push(
      <ul key={key}>
        {bulletBuf.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
    );
    bulletBuf = [];
  }

  blocks.forEach((raw, i) => {
    const line = raw;
    const imgMatch = line.match(IMG_RE);

    if (line.startsWith('- ')) {
      bulletBuf.push(line.slice(2));
      return;
    }
    flushBullets(`ul-${i}`);

    if (imgMatch) {
      const [, alt, src] = imgMatch;
      out.push(
        <figure key={i} style={{ margin: '1rem 0' }}>
          <img src={src} alt={alt} loading="lazy" />
          {alt && <figcaption>{alt}</figcaption>}
        </figure>
      );
      return;
    }
    if (line.startsWith('## ')) {
      out.push(<h2 key={i}>{line.slice(3)}</h2>);
      return;
    }
    if (line.startsWith('### ')) {
      out.push(<h3 key={i}>{line.slice(4)}</h3>);
      return;
    }
    out.push(<p key={i} style={{ marginBottom: '1rem' }}>{line}</p>);
  });
  flushBullets('ul-end');

  return <>{out}</>;
}
