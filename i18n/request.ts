import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "./config";

export default getRequestConfig(async () => {
  // 静态导出：从 cookie 读取 locale（客户端通过 provider 传入；此处为兜底）
  let locale: Locale = defaultLocale;
  if (typeof document !== "undefined") {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="));
    const value = match?.split("=")[1] as Locale | undefined;
    if (value && locales.includes(value)) locale = value;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
