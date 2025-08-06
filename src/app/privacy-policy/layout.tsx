import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Toolzin",
  description: "Our privacy policy explains how we handle your data and protect your privacy.",
};

export default function PrivacyPolicyLayout({
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
