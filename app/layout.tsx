import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BusinessProvider } from "@/src/context/BusinessContextType";
import { getBusinessBySlug } from "@/src/utils/GetBusinessBySlug";
import { log } from "console";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The coffee cup",
  description: "My quiosco app for your restaurant",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  const businessSlug = (await headers()).get("x-business-slug");
  log('Business slug from headers: ', businessSlug);
  const business = await getBusinessBySlug(businessSlug!);
  
  if (!business) {
    redirect("/not-found");
  }
  
  return (
    <html lang="en">
      <head>
        <meta name="google" content="noTranslate" />
        <link rel="icon" type="image/svg+xml" href="/THE-CUP.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        <Providers>
          <BusinessProvider business={business}>
            {children}
          </BusinessProvider>
        </Providers>
      </body>
    </html>
  );
}
