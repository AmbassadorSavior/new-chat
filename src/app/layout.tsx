import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Oppora — Opportunity discovery for Africa",
  description:
    "Oppora helps you discover, qualify for, prepare for and track scholarships, jobs, grants, internships, fellowships and more.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
