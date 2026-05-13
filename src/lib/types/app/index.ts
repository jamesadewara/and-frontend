export type Theme = "light" | "dark";
export type LangCode = "en" | "pidgin" | "ha" | "yo" | "ig" | "fr";

export interface Language {
  code: LangCode;
  label: string;
  flag: string;
  gCode: string;
  native: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧", gCode: "en" },
  { code: "ha", label: "Hausa", native: "Hausa", flag: "🇳🇬", gCode: "ha" },
  { code: "yo", label: "Yoruba", native: "Yorùbá", flag: "🇳🇬", gCode: "yo" },
  { code: "ig", label: "Igbo", native: "Igbo", flag: "🇳🇬", gCode: "ig" },
  { code: "fr", label: "Français", native: "Français", flag: "🇫🇷", gCode: "fr" },
];

export interface AppState {
  theme: Theme;
  lang: LangCode;
}

export interface AppContextValue extends AppState {
  setTheme: (t: Theme) => void;
  setLang: (l: LangCode) => void;
  resetAppState: () => void;
  t: (en: string, pidgin?: string) => string;
  translate: (text: string) => Promise<string>;
}
