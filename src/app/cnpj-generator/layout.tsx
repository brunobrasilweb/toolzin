import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CNPJ Generator - Toolzin",
  description: "Generate valid CNPJs for testing and development. Free and secure tool for developers.",
};

export default function CNPJGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
