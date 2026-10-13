import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { Cursor } from "@/components/motion/Cursor";
import { Suspense } from "react";
import { MobileCta } from "@/components/layout/MobileCta";
import { ScrollEnergyLine } from "@/components/motion/ScrollEnergyLine";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="contenu" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <Suspense fallback={null}>
        <SmoothScroll />
      </Suspense>
      <RevealObserver />
      <ScrollEnergyLine />
      <Suspense fallback={null}>
        <MobileCta />
      </Suspense>
      <Cursor />
    </>
  );
}
