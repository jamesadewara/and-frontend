"use client";
import { useGoogleTranslate } from "@/src/hooks/use-google-translate";
import { useApp } from "../hooks/app";

/**
 * Mounts the Google Translate widget once and syncs its target language
 * with the user's selected language from the app store.
 */
export function GoogleTranslate() {
  const { lang } = useApp();
  useGoogleTranslate(lang);
  return null;
}
