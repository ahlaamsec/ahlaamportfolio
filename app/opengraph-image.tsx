import { ImageResponse } from 'next/og';

export const alt = 'Ahlaam Abdallah, computer science and cybersecurity';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: '#111219', color: '#f2f2f5' }}>
        <div style={{ fontSize: 28, color: '#ff7a45', letterSpacing: 4, textTransform: 'uppercase' }}>Kumasi, Ghana</div>
        <div style={{ fontSize: 88, fontWeight: 800, marginTop: 20 }}>Ahlaam Abdallah</div>
        <div style={{ fontSize: 36, color: '#9b9eb0', marginTop: 24 }}>Cybersecurity, human-centred computing and technical writing</div>
      </div>
    ),
    size
  );
}
