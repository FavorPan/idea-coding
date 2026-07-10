import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { LocaleProvider } from "@/i18n/client";
import { defaultLocale, type Locale } from "@/i18n/config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Idea Coding",
  description:
    "Idea Coding: 90 of the most fun, useful, and buildable projects for AI-coding beginners, with a starter picker, project health check, starter prompts, and the fastest-growing GitHub star projects this week.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

function readCookieLocale(cookieHeader: string | undefined): Locale {
  if (!cookieHeader) return defaultLocale;
  const match = cookieHeader
    .split("; ")
    .find((row) => row.startsWith("NEXT_LOCALE="));
  const value = match?.split("=")[1] as Locale | undefined;
  return value === "zh" || value === "en" ? value : defaultLocale;
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = readCookieLocale(
    typeof document !== "undefined" ? document.cookie : undefined
  );
  const messages = await getMessages();

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
