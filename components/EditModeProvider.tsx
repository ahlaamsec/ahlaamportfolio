'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Ctx = {
  authed: boolean;
  // True when no admin password exists yet and /admin should offer to create one.
  needsSetup: boolean;
  ready: boolean;
  editing: boolean;
  login: (password: string) => Promise<string | null>;
  setup: (password: string) => Promise<string | null>;
  logout: () => void;
  setEditing: (v: boolean) => void;
};

const EditModeContext = createContext<Ctx>({
  authed: false,
  needsSetup: false,
  ready: false,
  editing: false,
  login: async () => 'Not ready yet.',
  setup: async () => 'Not ready yet.',
  logout: () => {},
  setEditing: () => {},
});

export function useEditMode() {
  return useContext(EditModeContext);
}

export default function EditModeProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch('/api/auth')
      .then((r) => r.json())
      .then((d) => {
        setAuthed(Boolean(d.authed));
        setNeedsSetup(Boolean(d.needsSetup));
        // Links from the dashboard add ?edit=1 to open a page straight in edit mode.
        if (d.authed && new URLSearchParams(window.location.search).get('edit') === '1') setEditing(true);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  async function send(body: object): Promise<string | null> {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setAuthed(true);
        setNeedsSetup(false);
        return null;
      }
      if (data.needsSetup) setNeedsSetup(true);
      if (res.status === 409 && !data.needsSetup) setNeedsSetup(false);
      return data.error || 'Could not log in.';
    } catch {
      return 'Network error. Please try again.';
    }
  }

  const login = (password: string) => send({ password });
  const setup = (password: string) => send({ setup: true, password });

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' }).catch(() => {});
    setAuthed(false);
    setEditing(false);
  }

  return (
    <EditModeContext.Provider value={{ authed, needsSetup, ready, editing, login, setup, logout, setEditing }}>
      {children}
    </EditModeContext.Provider>
  );
}
