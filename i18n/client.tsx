"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { defaultLocale, type Locale } from "./config";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
});

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useMemo(
    () => (l: Locale) => {
      setLocaleState(l);
      document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000`;
    },
    []
  );

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
