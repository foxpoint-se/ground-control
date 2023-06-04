import "./globals.css";
import { Mukta } from "next/font/google";

const mukta = Mukta({
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
      <body className={`${mukta.className}`}>{children}</body>
    </html>
  );
}
