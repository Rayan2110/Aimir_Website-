"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { RouteSync } from "./RouteSync";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { nav } from "@/content/site";
import { sectors } from "@/content/sectors";
import { cn } from "@/lib/cn";

function ParisClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const f = new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setTime(f.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="num tabular-nums">{time ?? "--:--:--"}</span>;
}

function StatusBar() {
  return (
    <div className="hidden h-8 items-center justify-between border-b border-[var(--line)] px-[var(--gutter)] font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-3 lg:flex">
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-2">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-ok" />
            <span className="relative size-1.5 rounded-full bg-ok" />
          </span>
          Courtage &amp; optimisation énergétique
        </span>
        <span className="hidden xl:inline">Professionnels · France</span>
      </div>
      <div className="flex items-center gap-6">
        <span>Analyse · Consultation · Décision · Suivi</span>
        <span className="text-fg-2">
          Paris <ParisClock />
        </span>
      </div>
    </div>
  );
}

type MenuKey = "expertise" | "secteurs" | null;

export function Header() {
  const [pathname, setPathname] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState<MenuKey>(null);
  const [mobile, setMobile] = useState(false);
  const lastY = useRef(0);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 320 && y > lastY.current + 4);
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermer les menus à chaque navigation.
  const onRoute = useCallback((path: string) => {
    setPathname(path);
    setMenu(null);
    setMobile(false);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? "hidden" : "";
    if (mobile) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [mobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = (k: MenuKey) => {
    window.clearTimeout(closeTimer.current);
    setMenu(k);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setMenu(null), 160);
  };

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-700 ease-[var(--ease-out-expo)]",
        hidden && !menu && !mobile ? "-translate-y-[calc(100%+48px)]" : "translate-y-0",
        scrolled || menu || mobile
          ? "border-b border-[var(--line)] bg-ink-950/80 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent",
      )}
    >
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:bg-volt focus:px-4 focus:py-2 focus:text-ink-950"
      >
        Aller au contenu
      </a>
      <Suspense fallback={null}>
        <RouteSync onChange={onRoute} />
      </Suspense>
      <StatusBar />
      <div className="flex h-[var(--header-h)] items-center justify-between gap-6 px-[var(--gutter)]">
        <Link href="/" aria-label="INENCO ENERGY — accueil" className="relative z-10 text-fg">
          <Logo />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex" onMouseLeave={scheduleClose}>
          <Link href="/methode" className={navItem(isActive("/methode"))}>
            Méthode
          </Link>
          <button
            type="button"
            className={navItem(menu === "expertise" || ["/electricite", "/gaz", "/etudes-de-cas"].some(isActive))}
            aria-expanded={menu === "expertise"}
            aria-controls="menu-expertise"
            onMouseEnter={() => open("expertise")}
            onClick={() => setMenu(menu === "expertise" ? null : "expertise")}
          >
            Expertise <Chevron open={menu === "expertise"} />
          </button>
          <button
            type="button"
            className={navItem(menu === "secteurs" || isActive("/secteurs"))}
            aria-expanded={menu === "secteurs"}
            aria-controls="menu-secteurs"
            onMouseEnter={() => open("secteurs")}
            onClick={() => setMenu(menu === "secteurs" ? null : "secteurs")}
          >
            Secteurs <Chevron open={menu === "secteurs"} />
          </button>
          {nav.primary.slice(1).map((l) => (
            <Link key={l.href} href={l.href} className={navItem(isActive(l.href))} onMouseEnter={() => setMenu(null)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2">
          <Link href="/connexion" className="hidden h-10 items-center px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-2 transition-colors hover:text-fg xl:inline-flex">
            Connexion
          </Link>
          <span className="hidden sm:block">
            <ButtonLink href="/envoyer-une-facture" className="h-10 px-4" magnetic>
              Analyser ma facture
            </ButtonLink>
          </span>
          <button
            type="button"
            className="relative inline-flex size-10 items-center justify-center lg:hidden"
            aria-label={mobile ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobile}
            aria-controls="menu-mobile"
            onClick={() => setMobile((v) => !v)}
          >
            <span className={cn("absolute h-px w-5 bg-fg transition-transform duration-500", mobile ? "rotate-45" : "-translate-y-[4px]")} />
            <span className={cn("absolute h-px w-5 bg-fg transition-transform duration-500", mobile ? "-rotate-45" : "translate-y-[4px]")} />
          </button>
        </div>
      </div>

      {/* Méga-menus desktop */}
      <div
        className={cn(
          "absolute inset-x-0 top-full hidden overflow-hidden border-b border-[var(--line)] bg-ink-950/95 backdrop-blur-xl transition-[clip-path,opacity] duration-700 ease-[var(--ease-out-expo)] lg:block",
          menu ? "opacity-100 [clip-path:inset(0_0_0_0)]" : "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]",
        )}
        onMouseEnter={() => window.clearTimeout(closeTimer.current)}
        onMouseLeave={scheduleClose}
      >
        <div id="menu-expertise" hidden={menu !== "expertise"} className="grid grid-cols-12 gap-8 px-[var(--gutter)] py-10">
          <div className="col-span-4">
            <p className="eyebrow mb-4">Expertise</p>
            <p className="max-w-xs text-sm leading-relaxed text-fg-2">
              Électricité, gaz, multi-sites : nous lisons vos contrats, consultons les fournisseurs et vous présentons des offres que vous pouvez comparer.
            </p>
          </div>
          <ul className="col-span-8 grid grid-cols-2 gap-x-8">
            {nav.expertise.map((l, i) => (
              <li key={l.href}>
                <Link href={l.href} className="group flex items-start gap-4 border-t border-[var(--line)] py-5 transition-colors hover:border-volt/60">
                  <span className="pt-1 font-mono text-[11px] text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-lg tracking-tight transition-colors group-hover:text-volt">{l.label}</span>
                    <span className="mt-1 block text-sm text-fg-3">{l.hint}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div id="menu-secteurs" hidden={menu !== "secteurs"} className="grid grid-cols-12 gap-8 px-[var(--gutter)] py-10">
          <div className="col-span-4">
            <p className="eyebrow mb-4">Secteurs</p>
            <p className="max-w-xs text-sm leading-relaxed text-fg-2">
              Chaque activité a son profil de consommation. Nos études partent de vos contraintes réelles.
            </p>
            <Link href="/secteurs" className="link-u mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-volt">
              Tous les secteurs →
            </Link>
          </div>
          <ul className="col-span-8 grid grid-cols-3 gap-x-8">
            {sectors.map((s) => (
              <li key={s.slug}>
                <Link href={`/secteurs/${s.slug}`} className="group block border-t border-[var(--line)] py-4 transition-colors hover:border-volt/60">
                  <span className="block tracking-tight transition-colors group-hover:text-volt">{s.name}</span>
                  <span className="mt-0.5 block text-[13px] text-fg-3">{s.short}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Menu mobile plein écran */}
      <div
        id="menu-mobile"
        className={cn(
          "fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto bg-ink-950 px-[var(--gutter)] pb-10 pt-6 transition-[clip-path] duration-700 ease-[var(--ease-in-out-quart)] lg:hidden",
          mobile ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
        )}
        data-lenis-prevent
        aria-hidden={!mobile}
        inert={!mobile}
      >
        <ul className="flex flex-col">
          {[
            { href: "/", label: "Accueil" },
            { href: "/methode", label: "Notre méthode" },
            { href: "/electricite", label: "Électricité" },
            { href: "/gaz", label: "Gaz naturel" },
            { href: "/multi-sites", label: "Multi-sites" },
            { href: "/secteurs", label: "Secteurs" },
            { href: "/etudes-de-cas", label: "Études de cas" },
            { href: "/desk", label: "INENCO ENERGY DESK" },
            { href: "/a-propos", label: "À propos" },
            { href: "/faq", label: "FAQ" },
            { href: "/contact", label: "Contact" },
          ].map((l, i) => (
            <li
              key={l.href}
              className="border-b border-[var(--line)] transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]"
              style={{
                transitionDelay: mobile ? `${120 + i * 40}ms` : "0ms",
                opacity: mobile ? 1 : 0,
                transform: mobile ? "none" : "translateY(16px)",
              }}
            >
              <Link href={l.href} className="flex items-baseline justify-between py-4 text-[26px] tracking-tight">
                {l.label}
                <span className="font-mono text-[11px] text-fg-3">{String(i + 1).padStart(2, "0")}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid gap-3">
          <ButtonLink href="/envoyer-une-facture" className="w-full">
            Analyser ma facture
          </ButtonLink>
          <ButtonLink href="/connexion" variant="ghost" className="w-full" arrow={false}>
            Connexion client
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

function navItem(active: boolean) {
  return cn(
    "relative inline-flex h-10 items-center gap-1.5 whitespace-nowrap px-2.5 text-[14px] tracking-tight transition-colors xl:px-3.5",
    active ? "text-fg" : "text-fg-2 hover:text-fg",
    "after:absolute after:inset-x-2.5 xl:after:inset-x-3.5 after:bottom-1.5 after:h-px after:origin-left after:bg-volt after:transition-transform after:duration-500",
    active ? "after:scale-x-100" : "after:scale-x-0",
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 10 6" className={cn("size-2.5 transition-transform duration-500", open && "rotate-180")} aria-hidden>
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
