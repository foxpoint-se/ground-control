import "./globals.css";
import { Secular_One } from "next/font/google";

const secularOne = Secular_One({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: "Ground control - Foxpoint",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${secularOne.className}`}>{children}</body>
    </html>
  );
}
