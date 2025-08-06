import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Toolzin",
  description: "Get in touch with the Toolzin team. Send us your questions, feedback, or suggestions.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
