import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "ぽんずアカデミー | サロンオーナーのための集客とリピートの学校",
  description: "サロン経営をワンランク上に。集客からリピート率向上まで、サロンオーナーのための実践的なナレッジベース。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="layout-root">
          <Sidebar />
          <div className="main-container">
            <Header />
            <main className="content">
              {children}
            </main>
          </div>
        </div>
        
        <style dangerouslySetInnerHTML={{ __html: `
          .layout-root {
            display: flex;
            min-height: 100vh;
            background-color: hsl(var(--background));
          }
          .main-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            transition: padding-left 0.3s ease;
          }
          .content {
            flex: 1;
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
          }
          @media (max-width: 768px) {
            .content {
              padding: 1rem;
            }
          }
        `}} />
      </body>
    </html>
  );
}
