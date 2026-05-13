"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Globe, ChevronDown } from "lucide-react";
import { SUPPORTED_LANGS } from "@/src/utils/localization-config";
import { useApp } from "@/src/hooks/app";
import { LangCode } from "@/src/lib/types/app";

export function FooterLanguagePicker() {
  const { lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const visible = SUPPORTED_LANGS.slice(0, 4);
  const rest = SUPPORTED_LANGS.slice(4);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const pick = (appCode: string) => { setLang(appCode as LangCode); setOpen(false); };

  return (
    <div className="flex flex-col lg:items-end gap-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/80">
        <Globe className="h-3.5 w-3.5 text-primary animate-pulse" />
        <span>Translate this site</span>
      </div>
      <div className="flex flex-wrap lg:justify-end items-center gap-2.5">
        {visible.map((l) => {
          const active = l.appCode === lang;
          return (
            <button
              key={l.appCode}
              onClick={() => pick(l.appCode)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs transition-all duration-300 ${
                active 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105 z-10" 
                  : "glass border-border hover:border-primary/40 hover:bg-secondary/50"
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span className="font-semibold tracking-wide">{l.label}</span>
              {active && <Check className="h-3.5 w-3.5 animate-in fade-in zoom-in duration-300" />}
            </button>
          );
        })}
        
        {rest.length > 0 && (
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs glass transition-all hover:border-primary/40 ${
                open ? "bg-secondary" : ""
              }`}
            >
              <span className="font-semibold">More</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
            
            {open && (
              <div className="absolute right-0 bottom-full mb-4 z-50 w-64 rounded-2xl border border-border bg-popover/95 backdrop-blur-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-3 border-b border-border bg-muted/30">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">Select Language</p>
                </div>
                <ul className="max-h-64 overflow-y-auto scrollbar-thin py-2">
                  {rest.map((l) => {
                    const active = l.appCode === lang;
                    return (
                      <li key={l.appCode}>
                        <button
                          onClick={() => pick(l.appCode)}
                          className={`w-full flex items-center gap-4 px-4 py-3 text-sm transition-colors hover:bg-primary/10 ${
                            active ? "bg-primary/5 text-primary" : ""
                          }`}
                        >
                          <span className="text-xl">{l.flag}</span>
                          <div className="text-left flex-1">
                            <div className="font-bold">{l.label}</div>
                            <div className="text-[10px] text-muted-foreground/80 leading-none mt-1">{l.native}</div>
                          </div>
                          {active && <Check className="h-4 w-4" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
