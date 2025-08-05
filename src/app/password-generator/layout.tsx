import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Generator - Toolzin",
  description: "Generate secure passwords with custom options. Free and secure password generator tool.",
};

export default function PasswordGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
