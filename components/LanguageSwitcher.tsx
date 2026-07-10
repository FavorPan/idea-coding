"use client";

import { useLocale } from "@/i18n/client";
import { useTranslations } from "next-intl";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const t = useTranslations("language");

  const toggle = () => setLocale(locale === "en" ? "zh" : "en");

  return (
    <button
      onClick={toggle}
      className="language-switch"
      aria-label="Switch language"
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        border: "1px solid var(--border, #ccc)",
        background: "transparent",
        cursor: "pointer",
        fontSize: 13,
      }}
    >
      {locale === "en" ? t("zh") : t("en")}
    </button>
  );
}
