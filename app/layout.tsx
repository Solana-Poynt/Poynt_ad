import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
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

// // Font configurations
// const geistSans = localFont({
//   src: [
//     {
//       path: "./fonts/GeistVF.woff2",
//       weight: "100 900",
//       style: "normal",
//     },
//   ],
//   variable: "--font-geist-sans",
//   display: "swap",
//   preload: true,
// });

// const geistMono = localFont({
//   src: [
//     {
//       path: "./fonts/GeistMonoVF.woff2",
//       weight: "100 900",
//       style: "normal",
//     },
//   ],
//   variable: "--font-geist-mono",
//   display: "swap",
//   preload: true,
// });

// // Enhanced metadata configuration
// export const metadata: Metadata = {
//   title: {
//     default: "POYNT",
//     template: "%s | POYNT",
//   },
//   description: "POYNT ADVERT MANAGEMENT WEBSITE",
//   keywords: ["advertising", "management", "poynt", "digital marketing"],
//   authors: [{ name: "POYNT Team" }],
//   creator: "POYNT",
//   metadataBase: new URL(
//     process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
//   ),
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: "/",
//     title: "POYNT",
//     description: "POYNT ADVERT MANAGEMENT WEBSITE",
//     siteName: "POYNT",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "POYNT",
//     description: "POYNT ADVERT MANAGEMENT WEBSITE",
//   },
// };

// // Viewport configuration
// export const viewport: Viewport = {
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "white" },
//     { media: "(prefers-color-scheme: dark)", color: "black" },
//   ],
//   width: "device-width",
//   initialScale: 1,
// };

// // Type for layout props
// interface RootLayoutProps {
//   children: ReactNode;
// }

// // Loading component
// function LoadingFallback() {
//   return (
//     <div className="flex h-screen w-full items-center justify-center">
//       <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
//     </div>
//   );
// }

// export default async function RootLayout({
//   children,
// }: Readonly<RootLayoutProps>) {
//   const session = await getServerSession();
//   return (
//     <html
//       lang="en"
//       suppressHydrationWarning
//       className={cn(
//         geistSans.variable,
//         geistMono.variable,
//         "scroll-smooth antialiased"
//       )}
//     >
//       <body className="min-h-screen bg-background font-sans">
//         <Suspense fallback={<LoadingFallback />}>
//           <StoreProvider>
//             <SessionProvider session={session}>
//               <main className="relative flex min-h-screen flex-col">
//                 {children}
//               </main>
//             </SessionProvider>
//           </StoreProvider>
//         </Suspense>
//       </body>
//     </html>
//   );
// }
