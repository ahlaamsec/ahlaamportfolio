'use client';
import { useState } from 'react';
import { useEditMode } from './EditModeProvider';
import SettingsForm from './SettingsForm';

export default function SiteSettingsButton() {
  const { authed } = useEditMode();
  const [open, setOpen] = useState(false);

  if (!authed) return null;

  return (
    <>
      <button className="settings-fab" onClick={() => setOpen(true)} aria-label="Site settings">Settings</button>
      {open && (
        <div className="add-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="add-modal" onClick={(e) => e.stopPropagation()}>
            <SettingsForm onDone={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
