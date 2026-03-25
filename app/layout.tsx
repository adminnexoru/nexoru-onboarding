import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.nexoru.ai"),
  title: {
    default: "Nexoru Onboarding",
    template: "%s | Nexoru",
  },
  description:
    "Onboarding de Nexoru para definir la mejor configuración operativa de automatización para tu negocio.",
  applicationName: "Nexoru Onboarding",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo-nexoru.png",
  },
  openGraph: {
    title: "Nexoru Onboarding",
    description: "Define la mejor configuración Nexoru para tu negocio.",
    url: "https://app.nexoru.ai",
    siteName: "Nexoru",
    images: [
      {
        url: "/logo-nexoru.png",
        width: 1200,
        height: 630,
        alt: "Nexoru Onboarding",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexoru Onboarding",
    description: "Define la mejor configuración Nexoru para tu negocio.",
    images: ["/logo-nexoru.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}