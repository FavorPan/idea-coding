import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Idea Coding",
  description:
    "Idea Coding：90 个最好玩、最好用、最好搓的项目推荐榜单，带新手选择器、项目体检、开工提示词和本周增长最快的 GitHub 明星项目。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
