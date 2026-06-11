'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer } from '@/types';
import {
  customerAccessTokenCreate,
  customerAccessTokenDelete,
  customerCreate,
  getCustomer,
} from '@/lib/shopify';

// ログイン・登録の結果（成功 or エラーメッセージ）
type AuthResponse = { ok: true } | { ok: false; message: string };

type AuthContextType = {
  customer: Customer | null;
  isLoggedIn: boolean;
  isLoading: boolean; // 初回のトークン復元中かどうか
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'shopify_customer_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ページ読み込み時：保存済みトークンで顧客情報を復元
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    getCustomer(token)
      .then((restored) => {
        if (restored) {
          setCustomer(restored);
        } else {
          // トークン失効済みなら削除
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // トークンを保存して顧客情報を取得する共通処理
  async function applyToken(token: string): Promise<AuthResponse> {
    localStorage.setItem(TOKEN_KEY, token);
    const fetched = await getCustomer(token);
    if (!fetched) {
      localStorage.removeItem(TOKEN_KEY);
      return { ok: false, message: '顧客情報の取得に失敗しました。' };
    }
    setCustomer(fetched);
    return { ok: true };
  }

  async function login(email: string, password: string): Promise<AuthResponse> {
    const { data, errors } = await customerAccessTokenCreate(email, password);
    if (!data) {
      const message = errors[0]?.message ?? 'メールアドレスまたはパスワードが正しくありません。';
      return { ok: false, message };
    }
    return applyToken(data.accessToken);
  }

  async function register(input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthResponse> {
    const { data, errors } = await customerCreate(input);
    if (!data) {
      const message = errors[0]?.message ?? 'アカウントの作成に失敗しました。';
      return { ok: false, message };
    }
    // 作成後はそのままログイン
    return login(input.email, input.password);
  }

  async function logout() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await customerAccessTokenDelete(token);
      } catch {
        // 失敗してもローカルは消す
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    setCustomer(null);
  }

  // 注文履歴などを再取得
  async function refresh() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const fetched = await getCustomer(token);
    if (fetched) setCustomer(fetched);
  }

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoggedIn: customer !== null,
        isLoading,
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth は AuthProvider の中で使ってください');
  }
  return context;
}
