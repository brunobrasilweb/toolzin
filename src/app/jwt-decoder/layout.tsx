import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder - Toolzin",
  description: "Decode and verify JSON Web Tokens (JWT). Free and secure online tool.",
};

export default function JWTDecoderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
