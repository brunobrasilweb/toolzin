import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CPF Generator - Toolzin",
  description: "Generate valid CPFs for testing and development. Free and secure tool.",
};

export default function CPFGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
