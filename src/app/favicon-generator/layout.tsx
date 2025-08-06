import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favicon Generator - Toolzin",
  description: "Generate high-quality favicon from JPG or PNG images. Create ICO with multiple resolutions and PNG favicons for web, mobile, and desktop with HTML code included. Free and secure tool.",
};

export default function FaviconGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
