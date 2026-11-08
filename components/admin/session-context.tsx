'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type AdminSession = { loaded: boolean; isAdmin: boolean; permissions: string[]; can: (section: string, action: 'view' | 'manage') => boolean };

const SessionContext = createContext<AdminSession>({ loaded: false, isAdmin: false, permissions: [], can: () => false });

export const useAdminSession = () => useContext(SessionContext);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<{ kind: string; permissions: string[] } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => {
        if (response.status === 401) window.location.href = '/login';
        return response.ok ? response.json() : null;
      })
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  const value = useMemo<AdminSession>(() => {
    const permissions = me?.permissions ?? [];
    return { loaded: me !== null, isAdmin: me?.kind === 'admin', permissions, can: (section, action) => permissions.includes(`${section}.${action}`) };
  }, [me]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
