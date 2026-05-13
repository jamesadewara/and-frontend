import { useEffect, useCallback, useState, useRef } from "react";
import { SUPPORTED_LANGS, appCodeToGoogle } from "@/src/utils/localization-config";

interface GoogleTranslateOptions {
  pageLanguage: string;
  includedLanguages?: string;
  autoDisplay?: boolean;
  layout?: number;
}

interface GoogleTranslateElement {
  new (options: GoogleTranslateOptions, elementId: string): void;
}

interface GoogleNamespace {
  translate?: {
    TranslateElement: GoogleTranslateElement;
  };
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: GoogleNamespace;
  }
}

const SCRIPT_ID = "google-translate-script";
const ELEMENT_ID = "google_translate_element";

function fireChange(googleCode: string) {
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (combo) {
    combo.value = googleCode;
    combo.dispatchEvent(new Event("change"));
    return true;
  }
  return false;
}

export function useGoogleTranslate(appLang: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const initRef = useRef(false);

  const clearCookies = useCallback(() => {
    const domains = [
      window.location.hostname,
      "." + window.location.hostname,
      "." + window.location.hostname.split('.').slice(-2).join('.')
    ];
    const path = "/";
    // Clear googtrans
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path};`;
    domains.forEach(domain => {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain};`;
    });
  }, []);

  const resetToEnglish = useCallback(() => {
    // 1. Check if a translation is actually active via cookie
    const googtrans = document.cookie.split('; ').find(row => row.startsWith('googtrans='))?.split('=')[1];
    
    // 2. Aggressive cookie clearing
    const domains = [
      window.location.hostname,
      "." + window.location.hostname,
      window.location.hostname.split('.').slice(-2).join('.'),
      "." + window.location.hostname.split('.').slice(-2).join('.')
    ];
    
    const clear = (name: string) => {
      document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      domains.forEach(d => {
        document.cookie = `${name}=; Path=/; Domain=${d}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      });
    };

    clear("googtrans");

    // 3. If we were translated, force a reload to get clean English
    // We check googtrans existence OR the presence of Google's banner/classes
    if (googtrans || document.documentElement.classList.contains("translated-ltr") || document.querySelector(".goog-te-banner-frame")) {
        window.location.reload();
        return;
    }
    
    // 4. UI Cleanup (for cases where reload isn't triggered)
    document.body.style.top = "0";
    document.documentElement.classList.remove("translated-ltr", "translated-rtl");
    const container = document.getElementById(":1.container");
    if (container) container.style.display = "none";
  }, []);

  const changeLanguage = useCallback((nextAppCode: string) => {
    if (nextAppCode === "en") {
      resetToEnglish();
      return;
    }

    const googleCode = appCodeToGoogle(nextAppCode);
    
    // Show container if hidden
    const container = document.getElementById(":1.container");
    if (container) container.style.display = "block";

    let tries = 0;
    const tick = () => {
      if (fireChange(googleCode)) return;
      if (tries++ < 30) setTimeout(tick, 200);
    };
    tick();
  }, [resetToEnglish]);

  // Load script only when a translation is requested
  useEffect(() => {
    if (appLang === "en" && !initRef.current) return;
    if (initRef.current) return;

    initRef.current = true;

    if (!document.getElementById(ELEMENT_ID)) {
      const host = document.createElement("div");
      host.id = ELEMENT_ID;
      host.style.display = "none";
      document.body.appendChild(host);
    }

    const includedLanguages = SUPPORTED_LANGS.map((l) => l.code).join(",");

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages, autoDisplay: false },
          ELEMENT_ID,
        );
        setIsLoaded(true);
      }
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      if (window.google?.translate) window.googleTranslateElementInit?.();
    }
  }, [appLang]);

  // Sync language changes
  useEffect(() => {
    if (isLoaded || (appLang === "en" && initRef.current)) {
      changeLanguage(appLang);
    }
  }, [appLang, isLoaded, changeLanguage]);

  return { isLoaded };
}
