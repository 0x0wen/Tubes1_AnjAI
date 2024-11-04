import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const icelandRegular = localFont({
  src: "./fonts/Iceland-Regular.ttf",
  variable: "--font-iceland-regular",
  weight: "400",
});

const northToSouth = localFont({
  src: "./fonts/NorthToSouth-jBP0.ttf",
  variable: "--font-north-to-south",
  weight: "400",
});

export const metadata: Metadata = {
  title: "DMC Solver",
  description: "A solver for the DMC puzzle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${icelandRegular.variable} ${northToSouth.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
