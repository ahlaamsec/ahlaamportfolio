'use client';
export default function PrintButton() {
  return <button className="btn no-print" onClick={() => window.print()}>Save as PDF / Print</button>;
}
