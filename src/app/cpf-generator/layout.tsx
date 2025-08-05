import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de CPF - Toolzin",
  description: "Gere CPFs válidos para testes e desenvolvimento. Ferramenta gratuita e segura.",
};

export default function CPFGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
