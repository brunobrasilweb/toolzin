import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de CNPJ - Toolzin",
  description: "Gere CNPJs válidos para testes e desenvolvimento. Ferramenta gratuita e segura para desenvolvedores.",
};

export default function CNPJGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
