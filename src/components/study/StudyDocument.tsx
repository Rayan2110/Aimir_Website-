import { LogoMark } from "@/components/brand/Logo";
import { ExampleBadge } from "@/components/ui/Section";

/**
 * Étude comparative type — EXEMPLE FICTIF (brief §7, §15).
 * Reprend le profil « Restaurant — Île-de-France » du simulateur pour rester
 * cohérent. Aucun de ces chiffres ne provient d'un dossier réel.
 */
const MWH = 95;
const CURRENT = 168;
const OFFERS = [
  { supplier: "Fournisseur B", structure: "Prix fixe", duration: "24 mois", price: 139, approx: false, conditions: "Tolérance ± 20 % · garanties d'origine", chosen: true },
  { supplier: "Fournisseur D", structure: "Prix fixe", duration: "36 mois", price: 142, approx: false, conditions: "Tolérance ± 15 %", chosen: false },
  { supplier: "Fournisseur A", structure: "Prix indexé", duration: "12 mois", price: 131, approx: true, conditions: "Suit le marché de gros, budget variable", chosen: false },
];

const eur = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;
const pct = (n: number) => `${n.toFixed(1).replace(".", ",")} %`;

export function StudyDocument() {
  const base = CURRENT * MWH;
  return (
    <article className="relative mx-auto max-w-5xl overflow-hidden rounded-[4px] bg-paper text-ink-text shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9)]" aria-label="Étude comparative type, exemple illustratif">
      {/* en-tête du document */}
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-ink-text/15 px-6 py-6 md:px-10">
        <div className="flex items-center gap-3">
          <LogoMark className="size-8 text-ink-text" />
          <div className="leading-tight">
            <p className="text-[15px] font-semibold tracking-[0.18em]">INENCO</p>
            <p className="font-mono text-[9px] tracking-[0.4em] text-ink-text-2">ENERGY</p>
          </div>
        </div>
        <div className="text-right font-mono text-[11px] leading-relaxed text-ink-text-2">
          <p>Étude comparative · Réf. EX-2026-001</p>
          <p>Date de l&apos;étude : 13/10/2026 · prix valables 7 jours</p>
        </div>
        <ExampleBadge className="w-full justify-center border-[#b8731a]/40 bg-[#b8731a]/10 text-[#8a560f] md:w-auto">Exemple illustratif — données fictives, ne constitue pas une offre</ExampleBadge>
      </header>

      <div className="grid gap-10 px-6 py-8 md:px-10 md:py-10">
        {/* 1. profil */}
        <section className="grid gap-6 md:grid-cols-[200px_1fr]">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-text-2">01 · Profil</h3>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {[
              ["Activité", "Restaurant — Île-de-France"],
              ["Énergie", "Électricité · 1 site"],
              ["Segment", "C5 · 36 kVA · HP / HC"],
              ["Consommation", `${MWH} MWh / an`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-text-2">{k}</dt>
                <dd className="mt-1 text-[15px]">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 2. contrat actuel */}
        <section className="grid gap-6 border-t border-ink-text/10 pt-8 md:grid-cols-[200px_1fr]">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-text-2">02 · Contrat actuel</h3>
          <p className="text-[15px] leading-relaxed">
            Prix fixe signé en 2023, <strong>{CURRENT} €/MWh</strong> (moyenne pondérée HP / HC), échéance 03/2027, reconduction tacite de 12 mois sans action avant l&apos;échéance. Budget énergie annuel estimé : <strong>{eur(base)} HT</strong>.
          </p>
        </section>

        {/* 3. consultation */}
        <section className="grid gap-6 border-t border-ink-text/10 pt-8 md:grid-cols-[200px_1fr]">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-text-2">03 · Consultation</h3>
          <div>
            <p className="text-[15px] leading-relaxed">5 fournisseurs consultés sur un cahier des charges commun (même volume, même date de début) : 3 propositions reçues, 2 déclinaisons.</p>
            <ol className="mt-4 flex flex-wrap gap-2 font-mono text-[11px]">
              {["A · reçue", "B · reçue", "C · déclinée", "D · reçue", "E · déclinée"].map((s) => (
                <li key={s} className={`rounded-[2px] border px-2 py-1 ${s.includes("reçue") ? "border-ink-text/30" : "border-ink-text/10 text-ink-text-2 line-through decoration-ink-text/30"}`}>
                  Fournisseur {s}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4. propositions */}
        <section className="grid gap-6 border-t border-ink-text/10 pt-8 md:grid-cols-[200px_1fr]">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-text-2">04 · Propositions</h3>
          <div className="thin-scrollbar overflow-x-auto">
            <table className="num w-full min-w-[620px] text-left text-[13.5px]">
              <thead className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-text-2">
                <tr className="border-b border-ink-text/15">
                  <th className="py-2 pr-3 font-normal">Offre</th>
                  <th className="pr-3 font-normal">Structure</th>
                  <th className="pr-3 font-normal">Durée</th>
                  <th className="pr-3 text-right font-normal">€ / MWh</th>
                  <th className="pr-3 text-right font-normal">Budget / an</th>
                  <th className="text-right font-normal">Écart estimé</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-text/10 text-ink-text-2">
                  <td className="py-2.5 pr-3">Contrat actuel</td>
                  <td className="pr-3">Prix fixe</td>
                  <td className="pr-3">—</td>
                  <td className="pr-3 text-right">{CURRENT}</td>
                  <td className="pr-3 text-right">{eur(base)}</td>
                  <td className="text-right">—</td>
                </tr>
                {OFFERS.map((o) => {
                  const budget = o.price * MWH;
                  const gap = base - budget;
                  return (
                    <tr key={o.supplier} className={`border-b border-ink-text/10 ${o.chosen ? "bg-[#f0a33b]/15" : ""}`}>
                      <td className="py-2.5 pr-3">
                        {o.supplier}
                        {o.chosen && <span className="ml-2 rounded-[2px] bg-ink-text px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-paper">Recommandée</span>}
                        <span className="block text-[11.5px] text-ink-text-2">{o.conditions}</span>
                      </td>
                      <td className="pr-3">{o.structure}</td>
                      <td className="pr-3">{o.duration}</td>
                      <td className="pr-3 text-right">
                        {o.approx && "≈ "}
                        {o.price}
                      </td>
                      <td className="pr-3 text-right">
                        {o.approx && "≈ "}
                        {eur(budget)}
                      </td>
                      <td className="text-right font-medium">
                        {o.approx && "≈ "}−{eur(gap)}
                        <span className="block text-[11.5px] font-normal text-ink-text-2">−{pct((gap / base) * 100)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. lecture */}
        <section className="grid gap-6 border-t border-ink-text/10 pt-8 md:grid-cols-[200px_1fr]">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-text-2">05 · Notre lecture</h3>
          <div className="grid gap-3 text-[15px] leading-relaxed">
            <p>
              <strong>Fournisseur B, prix fixe 24 mois</strong> : meilleur écart parmi les offres à prix fixe, budget connu sur toute la durée, tolérance de volume confortable pour une activité saisonnière.
            </p>
            <p className="text-ink-text-2">
              L&apos;offre indexée du fournisseur A paraît plus basse à la date de l&apos;étude, mais son prix suivra le marché : elle expose le budget aux hausses comme aux baisses. Le choix revient au client.
            </p>
          </div>
        </section>

        {/* 6. hypothèses */}
        <section className="grid gap-6 rounded-[3px] bg-ink-text/[0.04] p-5 md:grid-cols-[200px_1fr]">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-text-2">Hypothèses</h3>
          <ul className="grid gap-1.5 text-[13px] leading-relaxed text-ink-text-2">
            <li>Base de comparaison identique : {MWH} MWh / an, même répartition HP / HC, même date de début.</li>
            <li>Prix de la part énergie seule, en € HT / MWh, commission du courtier incluse.</li>
            <li>Hors abonnement, acheminement (TURPE), accise, CTA et TVA, présentés à part dans une étude réelle.</li>
            <li>Prix valables à la date de l&apos;étude ; écarts estimatifs, non garantis.</li>
          </ul>
        </section>
      </div>
    </article>
  );
}
