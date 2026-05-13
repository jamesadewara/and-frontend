// Maps Reko app language codes to Google Translate language codes.
export type SupportedLang = {
  code: string; // Google Translate code
  appCode: string; // Internal Reko code (matches LangCode)
  label: string;
  native: string;
  flag: string;
};

export const SUPPORTED_LANGS: SupportedLang[] = [
  { code: "en", appCode: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "ha", appCode: "ha", label: "Hausa", native: "Hausa", flag: "🇳🇬" },
  { code: "yo", appCode: "yo", label: "Yoruba", native: "Yorùbá", flag: "🇳🇬" },
  { code: "ig", appCode: "ig", label: "Igbo", native: "Igbo", flag: "🇳🇬" },
  { code: "fr", appCode: "fr", label: "Français", native: "Français", flag: "🇫🇷" },
];

export const appCodeToGoogle = (appCode: string): string =>
  SUPPORTED_LANGS.find((l) => l.appCode === appCode)?.code ?? "en";
