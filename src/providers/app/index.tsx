"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  AppState,
  AppContextValue,
  LANGUAGES
} from "@/src/lib/types/app";
import { googleTranslate } from "@/src/lib/services/app/app.service";

export const AppCtx = createContext<AppContextValue | null>(null);

const KEY = "reko_state_v1";
const initial: AppState = {
  theme: "light",
  lang: "en",
};

function load(): AppState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const base = JSON.parse(raw);
      return {
        ...initial,
        ...base,
      };
    }
  } catch { }
  return initial;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setState(load()); setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(state));
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state, hydrated]);

  const value: AppContextValue = {
    ...state,
    setTheme: (theme) => setState((s) => ({ ...s, theme })),
    setLang: (lang) => setState((s) => ({ ...s, lang })),
    resetAppState: () => {
      setState({ ...initial, theme: state.theme, lang: state.lang });
    },
    t: (en, pidgin) => (state.lang === "pidgin" && pidgin ? pidgin : en),
    translate: async (text) => {
      const lang = LANGUAGES.find((l) => l.code === state.lang);
      if (!lang || lang.code === "en") return text;
      return googleTranslate(text, lang.gCode, "en");
    },
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
