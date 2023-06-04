import "./globals.css";
import { Dosis } from "next/font/google";

const dosis = Dosis({
  subsets: ["latin"],
  weight: ["400", "700"],
});

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
      <body className={`${dosis.className}`}>{children}</body>
    </html>
  );
}
