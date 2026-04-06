import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import NavigationLayout from "@/components/layout/NavigationLayout";
import { verifyMemberSessionToken, MEMBER_COOKIE_NAME } from "@/lib/member-session";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "ぽんずアカデミー | サロンオーナーのための集客とリピートの学校",
  description: "サロン経営をワンランク上に。集客からリピート率向上まで、サロンオーナーのための実践的なナレッジベース。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = (await cookieStore).get(MEMBER_COOKIE_NAME)?.value;
  const session = token ? await verifyMemberSessionToken(token) : null;
  const isAdmin = session?.role === 'ADMIN';

  return (
    <html lang="ja">
      <body>
        <NavigationLayout 
          sidebar={<Sidebar isAdmin={isAdmin} />} 
          header={<Header />}
        >
          {children}
        </NavigationLayout>
        
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
