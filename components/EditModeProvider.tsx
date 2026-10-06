'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Ctx = {
  authed: boolean;
  editing: boolean;
  login: (password: string) => Promise<string | null>;
  logout: () => void;
  setEditing: (v: boolean) => void;
};

const EditModeContext = createContext<Ctx>({
  authed: false,
  editing: false,
  login: async () => 'Not ready yet.',
  logout: () => {},
  setEditing: () => {},
});

export function useEditMode() {
  return useContext(EditModeContext);
}

export default function EditModeProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch('/api/auth')
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authed)))
      .catch(() => {});
  }, []);

  async function login(password: string): Promise<string | null> {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setAuthed(true);
        return null;
      }
      return data.error || 'Could not log in.';
    } catch {
      return 'Network error — try again.';
    }
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' }).catch(() => {});
    setAuthed(false);
    setEditing(false);
  }

  return (
    <EditModeContext.Provider value={{ authed, editing, login, logout, setEditing }}>
      {children}
    </EditModeContext.Provider>
  );
}
