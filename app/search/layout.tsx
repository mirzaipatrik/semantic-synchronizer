import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Search",
  description: "Semantic Search",
};

export default function SearchLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <section>{children}</section>
  }