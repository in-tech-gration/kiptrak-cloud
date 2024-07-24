import "./globals.css";
import { Toaster } from "react-hot-toast";
import { GeistSans } from "geist/font/sans";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { SessionProvider } from "@/providers/SessionProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "KipTrak Cloud",
  description: "The ideal tool to keep track of your progress!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <ReactQueryProvider>
            <SessionProvider>
              <Header />
              <Toaster position="top-center" />
              {children}
              <Footer />
            </SessionProvider>
          </ReactQueryProvider>
        </main>
      </body>
    </html>
  );
}
