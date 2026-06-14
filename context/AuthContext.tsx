'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/* =========================================================
 * 新方式の認証は route handler + httpOnly Cookie で管理するため、
 * クライアント側はログイン状態の表示だけを担当する。
 * 機密でない読み取り可能Cookie（cust_logged_in）の有無を見るだけ。
 * ======================================================= */

type AuthContextType = {
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const LOGGED_IN_COOKIE = 'cust_logged_in';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const has = document.cookie
      .split('; ')
      .some((c) => c.startsWith(`${LOGGED_IN_COOKIE}=`));
    setIsLoggedIn(has);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth は AuthProvider の中で使ってください');
  }
  return context;
}
