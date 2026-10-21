'use client';
import Link from 'next/link';
import { useEditMode } from './EditModeProvider';

// The owner's editor bar. Visitors see nothing here: logging in happens on /admin.
export default function EditModeToggle() {
  const { authed, editing, logout, setEditing } = useEditMode();
  if (!authed) return null;

  return (
    <div className="edit-toggle">
      <div className="edit-panel edit-panel-active">
        <button className="btn" onClick={() => setEditing(!editing)}>
          {editing ? 'Stop editing' : 'Edit this site'}
        </button>
        <Link className="btn ghost" href="/admin">
          Dashboard
        </Link>
        <button className="btn ghost" onClick={logout}>
          Log out
        </button>
      </div>
    </div>
  );
}
