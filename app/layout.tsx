import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { StoreProvider } from "../store/provider";
import Providers from "@/components/Provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "POYNT",
  description: "POYNT ADVERT MANAGEMENT WEBSITE",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <Providers>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
          </body>
        </html>
      </Providers>
    </StoreProvider>
  );
}
