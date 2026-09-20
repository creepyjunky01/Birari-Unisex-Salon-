import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Birari Unisex Salon | Pre-Book Your Appointment",
  description:
    "Pre-book your appointment at Birari Unisex Salon and unlock an exclusive offer for your next visit.",
  icons: {
    icon: "/assets/birari-unisex-salon-logo.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b0b0c"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
