"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import { defaultLocale, locales, type Locale } from "./config";
import enMessages from "../messages/en.json";
import zhMessages from "../messages/zh.json";

const messageMap: Record<Locale, typeof enMessages> = {
  en: enMessages,
  zh: zhMessages,
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
});

function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("NEXT_LOCALE="));
  const value = match?.split("=")[1] as Locale | undefined;
  return value && locales.includes(value) ? value : null;
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // On mount: if the NEXT_LOCALE cookie differs from the initial locale
  // (e.g. returning user with a saved preference), sync state to the cookie.
  useEffect(() => {
    const cookieLocale = readCookieLocale();
    if (cookieLocale && cookieLocale !== locale) {
      setLocaleState(cookieLocale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useMemo(
    () => (l: Locale) => {
      setLocaleState(l);
      document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000`;
    },
    []
  );

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  const messages = messageMap[locale];

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
