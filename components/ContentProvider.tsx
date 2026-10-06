'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Ctx = {
  overrides: Record<string, string>;
  setLocalOverride: (id: string, value: string) => void;
  configured: boolean;
};

const ContentContext = createContext<Ctx>({
  overrides: {},
  setLocalOverride: () => {},
  configured: false,
});

export function useContent() {
  return useContext(ContentContext);
}

export default function ContentProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => {
        setOverrides(d.overrides || {});
        setConfigured(Boolean(d.configured));
      })
      .catch(() => {});
  }, []);

  function setLocalOverride(id: string, value: string) {
    setOverrides((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <ContentContext.Provider value={{ overrides, setLocalOverride, configured }}>
      {children}
    </ContentContext.Provider>
  );
}
