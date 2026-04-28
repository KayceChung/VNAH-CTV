"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AuthSession } from "@/types/employee";
import { ToastViewport } from "@/components/Toast";
import { useServiceWorkerRegistration } from "@/lib/useServiceWorkerRegistration";

type ToastTone = "success" | "error" | "info";

type ToastItem = {
  id: string;
  message: string;
  tone: ToastTone;
};

type AuthContextValue = {
  session: AuthSession | null;
  setSession: (value: AuthSession) => void;
  clearSession: () => void;
  pushToast: (message: string, tone?: ToastTone) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutMap = useRef<Map<string, number>>(new Map());

  // Register service worker for PWA support
  useServiceWorkerRegistration();

  useEffect(() => {
    const activeTimeouts = timeoutMap.current;

    return () => {
      activeTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      activeTimeouts.clear();
    };
  }, []);

  const setSession = useCallback((value: AuthSession) => {
    setSessionState(value);
  }, []);

  const clearSession = useCallback(() => {
    setSessionState(null);
  }, []);

  const pushToast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setToasts((current) => [...current, { id, message, tone }]);

    const timeoutId = window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
      timeoutMap.current.delete(id);
    }, 3200);

    timeoutMap.current.set(id, timeoutId);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      setSession,
      clearSession,
      pushToast,
    }),
    [clearSession, pushToast, session, setSession],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <ToastViewport
        toasts={toasts}
        onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}