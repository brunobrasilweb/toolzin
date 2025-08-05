import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Generator - Toolzin",
  description: "Generate various types of hash values from text input. Free and secure tool.",
};

export default function HashGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
