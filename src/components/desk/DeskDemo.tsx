"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { demoPortfolio } from "@/content/demo/desk-demo";
import { ENERGY_LABEL, type DeskAlert, type EnergyContract } from "@/lib/desk/types";
import { daysBetween, formatDateFR, runOmega, siteStatus } from "@/lib/omega/engine";
import { LogoMark } from "@/components/brand/Logo";
import { FranceMap } from "./FranceMap";
import { ContractTimeline, ContractsGantt } from "./ContractTimeline";
import { ConsumptionChart, SpendBySite } from "./Charts";
import { AlertsCenter, LevelIcon } from "./AlertsCenter";
import { DocumentsCenter } from "./DocumentsCenter";
import { LEVEL_COLOR, STATUS_LABEL, compactEur, last12, nf, portfolioTotals } from "./format";
import { cn } from "@/lib/cn";
import { CountUp } from "@/components/motion/CountUp";

type View = "overview" | "sites" | "timeline" | "documents" | "studies" | "suppliers" | "alerts";

const VIEWS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Vue d'ensemble", icon: <path d="M2 2h5v5H2zM9 2h5v3H9zM9 7h5v7H9zM2 9h5v5H2z" /> },
  { id: "sites", label: "Carte des sites", icon: <path d="M8 14s5-4.5 5-8.5A5 5 0 003 5.5C3 9.5 8 14 8 14zM8 7.5a2 2 0 100-4 2 2 0 000 4z" /> },
  { id: "timeline", label: "Échéancier", icon: <path d="M2 4h12M2 8h12M2 12h12M5 2v4M10 6v4M7 10v4" /> },
  { id: "documents", label: "Documents", icon: <path d="M4 1.5h5l3 3V14.5H4zM9 1.5v3h3M6 8h4M6 10.5h4" /> },
  { id: "studies", label: "Études réalisées", icon: <path d="M2.5 13.5h11M4 11V7M7 11V4M10 11V8M13 11V5.5" /> },
  { id: "suppliers", label: "Fournisseurs", icon: <path d="M2 13.5V6l6-3.5L14 6v7.5M5.5 13.5v-4h5v4M2 13.5h12" /> },
  { id: "alerts", label: "Alertes", icon: <path d="M8 2a4 4 0 00-4 4v3l-1.5 2.5h11L12 9V6a4 4 0 00-4-4zM6.5 13.5a1.5 1.5 0 003 0" /> },
];

export function DeskDemo({ initialView = "overview", embedded = false }: { initialView?: View; embedded?: boolean }) {
  const p = demoPortfolio;
  const alerts = useMemo(() => runOmega(p), [p]);
  const totals = useMemo(() => portfolioTotals(p), [p]);
  const [view, setView] = useState<View>(initialView);
  const [siteId, setSiteId] = useState<string | null>("lyo-pre");
  const [toast, setToast] = useState<string | null>(null);

  const site = p.sites.find((s) => s.id === siteId) ?? null;

  const studies = useMemo(
    () =>
      p.documents
        .filter((d) => d.type === "etude")
        .map((doc) => {
          const st = p.sites.find((x) => x.id === doc.siteId);
          const soon = st ? siteStatus(st, p.asOf).level >= 2 : false;
          return {
            doc,
            site: st,
            energies: st ? st.contracts.map((c) => ENERGY_LABEL[c.energy]).join(" + ") : "—",
            status: soon ? "En cours" : "Archivée",
          };
        }),
    [p],
  );

  const suppliers = useMemo(() => {
    const map = new Map<string, { name: string; contracts: number; sites: Set<string>; elec: number; gas: number; next: EnergyContract | null }>();
    for (const s of p.sites)
      for (const c of s.contracts) {
        const e = map.get(c.supplier) ?? { name: c.supplier, contracts: 0, sites: new Set<string>(), elec: 0, gas: 0, next: null };
        e.contracts++;
        e.sites.add(s.id);
        if (c.energy === "electricite") e.elec++;
        else e.gas++;
        if (daysBetween(p.asOf, c.end) >= 0 && (!e.next || c.end < e.next.end)) e.next = c;
        map.set(c.supplier, e);
      }
    return [...map.values()].map((e) => ({ ...e, sites: e.sites.size })).sort((a, b) => b.contracts - a.contracts);
  }, [p]);
  const alertCount = { 1: 0, 2: 0, 3: 0 } as Record<1 | 2 | 3, number>;
  alerts.forEach((a) => alertCount[a.level]++);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 3600);
  };
  const onAction = (a: DeskAlert) => notify(`Démonstration — « ${a.action} » : dans l'espace client, cette action transmet la demande à votre conseiller INENCO.`);
  const selectSite = (id: string) => {
    setSiteId(id);
    setView("sites");
  };

  return (
    <div className={cn("relative flex flex-col overflow-hidden rounded-[8px] border border-[var(--line-strong)] bg-ink-900 text-fg shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]", embedded ? "h-full" : "lg:h-[820px]")}>
      {/* barre de titre */}
      <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] bg-ink-950/60 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <LogoMark className="size-5 text-fg" />
          <span className="truncate font-mono text-[11px] uppercase tracking-[0.16em] text-fg-2">
            INENCO ENERGY <span className="text-volt">DESK</span>
          </span>
          <span className="hidden text-fg-3 sm:inline">/</span>
          <span className="hidden truncate text-[12.5px] text-fg-2 sm:inline">{p.company}</span>
        </div>
        <span className="shrink-0 rounded-[2px] border border-warn/40 bg-warn/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-warn">
          Démo · données fictives au {formatDateFR(p.asOf)}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* navigation */}
        <nav aria-label="Navigation du Desk" className="no-scrollbar flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--line)] p-2 lg:w-[208px] lg:flex-col lg:border-b-0 lg:border-r lg:p-3">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-current={view === v.id ? "page" : undefined}
              onClick={() => setView(v.id)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-[4px] px-3 py-2 text-[13px] transition-colors",
                view === v.id ? "bg-fg/[0.08] text-fg" : "text-fg-2 hover:bg-fg/[0.04] hover:text-fg",
              )}
            >
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" aria-hidden>
                {v.icon}
              </svg>
              {v.label}
              {v.id === "alerts" && alertCount[3] > 0 && (
                <span className="num ml-auto rounded-full bg-crit/20 px-1.5 font-mono text-[10px] text-crit">{alertCount[3] + alertCount[2]}</span>
              )}
            </button>
          ))}
          <div className="mt-auto hidden border-t border-[var(--line)] pt-3 lg:block">
            <p className="px-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-fg-3">Bientôt</p>
            {["Utilisateurs & droits", "Exports", "Notifications"].map((l) => (
              <span key={l} className="block px-3 py-1.5 text-[12.5px] text-fg-3/70">
                {l}
              </span>
            ))}
            <div className="mx-3 mt-3 rounded-[4px] border border-volt/30 bg-volt/[0.06] p-2.5">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-volt">Ω OMEGA ENERGY</p>
              <p className="mt-1 text-[11px] leading-snug text-fg-2">{alerts.length} événements détectés par règles sur vos données.</p>
            </div>
          </div>
        </nav>

        {/* contenu */}
        <div className="thin-scrollbar relative min-h-0 flex-1 overflow-y-auto p-4 md:p-6" data-lenis-prevent>
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
              {view === "overview" && (
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-[var(--line)] bg-[var(--line)] xl:grid-cols-4">
                    <Kpi label="Dépenses énergie · 12 mois" value={compactEur(totals.spend)} count={{ value: Math.round(totals.spend / 1000), suffix: " k€" }} sub="part énergie, estimée, HT" />
                    <Kpi
                      label="Consommation · 12 mois"
                      value={`${nf(totals.elecMWh + totals.gasMWh)} MWh`}
                      count={{ value: Math.round(totals.elecMWh + totals.gasMWh), suffix: " MWh" }}
                      sub={`${nf(totals.elecMWh)} élec. · ${nf(totals.gasMWh)} gaz`}
                    />
                    <Kpi label="Contrats actifs" value={String(totals.contracts)} count={{ value: totals.contracts }} sub={`${p.sites.length} sites · ${new Set(p.sites.flatMap((s) => s.contracts.map((c) => c.supplier))).size} fournisseurs`} />
                    <Kpi
                      label="Prochaine échéance"
                      value={totals.next ? `J-${totals.next.days}` : "—"}
                      count={totals.next ? { value: totals.next.days, prefix: "J-" } : undefined}
                      sub={totals.next ? `${totals.next.s.name} · ${ENERGY_LABEL[totals.next.c.energy]}` : ""}
                      accent
                    />
                  </div>
                  <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
                    <Card>
                      <ConsumptionChart sites={p.sites} />
                    </Card>
                    <Card>
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[15px] tracking-tight">Alertes OMEGA</p>
                        <button type="button" onClick={() => setView("alerts")} className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-volt">
                          Tout voir →
                        </button>
                      </div>
                      <ul className="grid gap-2">
                        {alerts.slice(0, 4).map((a) => (
                          <li key={a.id}>
                            <button type="button" onClick={() => setView("alerts")} className="flex w-full gap-2.5 rounded-[3px] border border-[var(--line)] p-2.5 text-left hover:border-[var(--line-strong)]">
                              <LevelIcon level={a.level} className="mt-0.5" />
                              <span className="min-w-0">
                                <span className="block text-[13px] text-fg">{a.title}</span>
                                <span className="line-clamp-2 block text-[12px] leading-snug text-fg-2">{a.what}</span>
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
                    <Card className="p-0">
                      <div className="flex items-center justify-between px-4 pt-4">
                        <p className="text-[15px] tracking-tight">Vos {p.sites.length} sites</p>
                        <button type="button" onClick={() => setView("sites")} className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-volt">
                          Ouvrir la carte →
                        </button>
                      </div>
                      <FranceMap sites={p.sites} asOf={p.asOf} selected={null} onSelect={selectSite} className="aspect-[1.03] w-full" showLegend={false} />
                    </Card>
                    <Card>
                      <SpendBySite sites={p.sites} onSelect={selectSite} />
                    </Card>
                  </div>
                </div>
              )}

              {view === "sites" && (
                <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
                  <Card className="p-0">
                    <FranceMap sites={p.sites} asOf={p.asOf} selected={siteId} onSelect={setSiteId} className="aspect-[1.03] w-full" />
                  </Card>
                  <div className="grid content-start gap-4">
                    {site ? (
                      <Card>
                        <SitePanel siteId={site.id} onRenew={() => notify("Démonstration — « Préparer le renouvellement » : votre conseiller INENCO reçoit la demande et lance l'étude.")} />
                      </Card>
                    ) : (
                      <Card>
                        <p className="text-fg-2">Sélectionnez un établissement sur la carte.</p>
                      </Card>
                    )}
                    <Card className="p-0">
                      <ul className="thin-scrollbar max-h-[280px] overflow-y-auto" data-lenis-prevent aria-label="Liste des sites">
                        {p.sites.map((s) => {
                          const st = siteStatus(s, p.asOf);
                          return (
                            <li key={s.id}>
                              <button
                                type="button"
                                onClick={() => setSiteId(s.id)}
                                className={cn("flex w-full items-center gap-3 border-b border-[var(--line)] px-4 py-2.5 text-left text-[13px] hover:bg-fg/[0.03]", s.id === siteId && "bg-fg/[0.05]")}
                              >
                                <span className="size-2 rounded-full" style={{ background: LEVEL_COLOR[st.level] }} />
                                <span className="flex-1 text-fg">{s.name}</span>
                                <span className="text-fg-3">{s.type}</span>
                                <span className="num w-14 text-right font-mono text-[11px] text-fg-2">{st.days !== null ? `J-${st.days}` : "—"}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </Card>
                  </div>
                </div>
              )}

              {view === "timeline" && (
                <div className="grid gap-4">
                  {site && (
                    <Card>
                      <p className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-3">Energy timeline · {site.name}</p>
                      {site.contracts.map((c) => (
                        <div key={c.id} className="mt-6 first:mt-2">
                          <ContractTimeline contract={c} asOf={p.asOf} />
                        </div>
                      ))}
                    </Card>
                  )}
                  <Card>
                    <p className="mb-4 text-[15px] tracking-tight">Échéancier de tous les contrats</p>
                    <div className="thin-scrollbar overflow-x-auto">
                      <ContractsGantt sites={p.sites} asOf={p.asOf} onSelect={(id) => setSiteId(id)} />
                    </div>
                  </Card>
                </div>
              )}

              {view === "documents" && (
                <Card>
                  <DocumentsCenter documents={p.documents} sites={p.sites} onOpen={(d) => notify(`Démonstration — « ${d.title} » : le document s'ouvrirait ici dans l'espace client.`)} />
                </Card>
              )}

              {view === "studies" && (
                <Card>
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-[15px] tracking-tight">Études réalisées</p>
                      <p className="text-[12px] text-fg-3">Chaque étude comparative archivée, avec sa date et ses hypothèses</p>
                    </div>
                    <span className="num font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">{studies.length} études</span>
                  </div>
                  <div className="thin-scrollbar overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left text-[13px]">
                      <thead className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
                        <tr className="border-b border-[var(--line)]">
                          <th className="py-2 font-normal">Date</th>
                          <th className="font-normal">Site</th>
                          <th className="font-normal">Énergies étudiées</th>
                          <th className="font-normal">Statut</th>
                          <th className="font-normal" />
                        </tr>
                      </thead>
                      <tbody>
                        {studies.map(({ doc, site: st, energies, status }) => (
                          <tr key={doc.id} className="border-b border-[var(--line)] hover:bg-fg/[0.03]">
                            <td className="num py-2.5 pr-3 font-mono text-[11px] text-fg-3">{formatDateFR(doc.date)}</td>
                            <td className="pr-3 text-fg">{st?.name}</td>
                            <td className="pr-3 text-fg-2">{energies}</td>
                            <td className="pr-3">
                              <span className={cn("rounded-[2px] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]", status === "En cours" ? "bg-volt/15 text-volt" : "bg-fg/5 text-fg-2")}>{status}</span>
                            </td>
                            <td className="text-right">
                              <button type="button" onClick={() => notify(`Démonstration — « ${doc.title} » s'ouvrirait ici, au format de l'étude-type.`)} className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-volt hover:text-volt-2">
                                Ouvrir →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {view === "suppliers" && (
                <Card>
                  <div className="mb-4">
                    <p className="text-[15px] tracking-tight">Fournisseurs</p>
                    <p className="text-[12px] text-fg-3">Répartition de vos contrats actifs par fournisseur</p>
                  </div>
                  <div className="thin-scrollbar overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left text-[13px]">
                      <thead className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
                        <tr className="border-b border-[var(--line)]">
                          <th className="py-2 font-normal">Fournisseur</th>
                          <th className="text-right font-normal">Contrats</th>
                          <th className="text-right font-normal">Sites</th>
                          <th className="font-normal">Énergies</th>
                          <th className="font-normal">Prochaine échéance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suppliers.map((sp) => (
                          <tr key={sp.name} className="border-b border-[var(--line)]">
                            <td className="py-2.5 pr-3 text-fg">{sp.name}</td>
                            <td className="num pr-3 text-right text-fg-2">{sp.contracts}</td>
                            <td className="num pr-3 text-right text-fg-2">{sp.sites}</td>
                            <td className="pr-3">
                              <span className="flex items-center gap-2 text-fg-2">
                                {sp.elec > 0 && (
                                  <span className="flex items-center gap-1">
                                    <span className="size-2 rounded-[2px] bg-elec" /> {sp.elec} élec.
                                  </span>
                                )}
                                {sp.gas > 0 && (
                                  <span className="flex items-center gap-1">
                                    <span className="size-2 rounded-[2px] bg-gas" /> {sp.gas} gaz
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="num font-mono text-[11px] text-fg-2">
                              {sp.next ? `${formatDateFR(sp.next.end)} · J-${daysBetween(p.asOf, sp.next.end)}` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-[12px] text-fg-3">Fournisseurs anonymisés pour la démonstration.</p>
                </Card>
              )}

              {view === "alerts" && (
                <Card>
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-volt">Ω OMEGA ENERGY · centre d&apos;alertes</p>
                      <p className="mt-1 max-w-xl text-[13px] text-fg-2">
                        Chaque alerte découle d&apos;une règle explicite appliquée à vos données (échéances, factures, consommations). Aucune prédiction opaque.
                      </p>
                    </div>
                  </div>
                  <AlertsCenter alerts={alerts} sites={p.sites} onAction={onAction} onSelectSite={selectSite} />
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-1/2 z-20 w-[min(92%,520px)] -translate-x-1/2 rounded-[4px] border border-volt/40 bg-ink-950/95 px-4 py-3 text-[13px] text-fg-2 shadow-2xl backdrop-blur"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-[4px] border border-[var(--line)] bg-ink-850 p-4 md:p-5", className)}>{children}</section>;
}

function Kpi({
  label,
  value,
  sub,
  accent,
  count,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  count?: { value: number; prefix?: string; suffix?: string };
}) {
  return (
    <div className="bg-ink-850 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-3">{label}</p>
      <p className={cn("mt-2 text-[26px] font-medium leading-none tracking-tight", accent && "text-volt")} aria-label={value}>
        {count ? <CountUp value={count.value} prefix={count.prefix} suffix={count.suffix} duration={1400} /> : value}
      </p>
      {sub && <p className="mt-1.5 truncate text-[11.5px] text-fg-3">{sub}</p>}
    </div>
  );
}

function SitePanel({ siteId, onRenew }: { siteId: string; onRenew: () => void }) {
  const p = demoPortfolio;
  const site = p.sites.find((s) => s.id === siteId)!;
  const st = siteStatus(site, p.asOf);
  const cons = last12(site);
  return (
    <AnimatePresence mode="wait">
      <motion.div key={site.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.3 }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-3">Site</p>
            <p className="mt-1 text-[22px] uppercase tracking-tight">
              {site.city} <span className="text-fg-3">—</span> {site.type}
            </p>
            <p className="text-[12.5px] text-fg-2">{site.name}</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-[2px] border border-[var(--line)] px-2 py-1 text-[11px] text-fg-2">
            <span className="size-1.5 rounded-full" style={{ background: LEVEL_COLOR[st.level] }} />
            {STATUS_LABEL[st.level]}
          </span>
        </div>
        <dl className="mt-5 grid gap-px overflow-hidden rounded-[3px] border border-[var(--line)] bg-[var(--line)] text-[13px]">
          {site.contracts.map((c) => {
            const d = daysBetween(p.asOf, c.end);
            return (
              <div key={c.id} className="grid grid-cols-[110px_1fr] gap-3 bg-ink-850 px-3 py-2.5">
                <dt className="text-fg-3">{ENERGY_LABEL[c.energy]}</dt>
                <dd className="text-fg-2">
                  <span className="text-fg">Contrat actif</span> · {c.supplier} · {c.structure} · {c.segment}
                  <span className="mt-0.5 block font-mono text-[11px]">
                    Échéance : <span className="text-fg">{formatDateFR(c.end)}</span> ({d} jours avant échéance)
                  </span>
                </dd>
              </div>
            );
          })}
          <div className="grid grid-cols-[110px_1fr] gap-3 bg-ink-850 px-3 py-2.5">
            <dt className="text-fg-3">Consommation</dt>
            <dd className="num text-fg-2">
              {nf(cons.elec, 1)} MWh élec.{cons.gas > 0 && ` · ${nf(cons.gas, 1)} MWh gaz`} <span className="text-fg-3">(12 mois)</span>
            </dd>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-3 bg-ink-850 px-3 py-2.5">
            <dt className="text-fg-3">Dernière analyse</dt>
            <dd className="text-fg-2">{formatDateFR(site.lastAnalysis)}</dd>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-3 bg-ink-850 px-3 py-2.5">
            <dt className="text-fg-3">Dernière facture</dt>
            <dd className="text-fg-2">{formatDateFR(site.lastInvoice)}</dd>
          </div>
        </dl>
        {st.nextEnd && (
          <div className="mt-6">
            <ContractTimeline contract={st.nextEnd} asOf={p.asOf} compact />
          </div>
        )}
        <button
          type="button"
          onClick={onRenew}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[3px] bg-volt px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-950 hover:bg-volt-2"
        >
          Préparer le renouvellement →
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
