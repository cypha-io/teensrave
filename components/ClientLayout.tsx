'use client';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollProvider from "../components/ScrollProvider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollProvider>
      <Navbar />
      {children}
      <Footer />
    </ScrollProvider>
  );
}