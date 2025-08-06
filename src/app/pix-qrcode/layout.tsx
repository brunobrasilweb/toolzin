import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de QR Code PIX | Toolzin",
  description: "Gere QR Codes para pagamentos via PIX facilmente e gratuitamente. Uma ferramenta simples para criar códigos PIX estáticos.",
  keywords: ["pix", "qr code", "pagamento", "qr code pix", "gerador pix", "pix copia e cola", "banco central"],
  openGraph: {
    title: "Gerador de QR Code PIX | Toolzin",
    description: "Gere QR Codes para pagamentos via PIX facilmente e gratuitamente",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gerador de QR Code PIX",
      },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
