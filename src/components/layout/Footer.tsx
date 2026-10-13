import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { nav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] bg-ink-950">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">Une question, une facture ?</p>
            <p className="max-w-md text-[28px] leading-[1.15] tracking-tight">
              Envoyez-nous votre facture. Nous vous montrons ce que le marché peut vous proposer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/envoyer-une-facture">Analyser ma facture</ButtonLink>
              <ButtonLink href="/contact" variant="ghost" arrow={false}>
                Nous écrire
              </ButtonLink>
            </div>
            <dl className="mt-12 grid gap-4 font-mono text-[12px] tracking-wide text-fg-2">
              <div className="flex gap-4">
                <dt className="w-20 text-fg-3">E-mail</dt>
                <dd>
                  <a className="link-u" href={`mailto:${site.contact.email}`}>
                    {site.contact.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-20 text-fg-3">Téléphone</dt>
                <dd>
                  <a className="link-u" href={`tel:${site.contact.phoneHref}`}>
                    {site.contact.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-20 text-fg-3">Horaires</dt>
                <dd>{site.contact.hours}</dd>
              </div>
            </dl>
          </div>

          <nav aria-label="Plan du site" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {Object.entries(nav.footer).map(([title, links]) => (
              <div key={title}>
                <p className="eyebrow mb-5">{title}</p>
                <ul className="grid gap-3 text-[14px] text-fg-2">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link className="link-u transition-colors hover:text-fg" href={l.href}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 border-t border-[var(--line)] pt-6 text-[12px] leading-relaxed text-fg-3">
          <p className="max-w-4xl">
            {site.name} est un intermédiaire en fourniture d&apos;énergie (courtier). Il n&apos;est ni fournisseur d&apos;électricité ou de gaz, ni gestionnaire de réseau, et n&apos;est affilié à aucun organisme public. Aucun frais n&apos;est facturé au client : INENCO est rémunéré par le fournisseur retenu, via une commission incluse dans le prix de son offre. Les exemples chiffrés présentés sur ce site sont illustratifs et ne constituent pas une offre.{" "}
            <Link href="/remuneration" className="underline underline-offset-2 hover:text-fg-2">
              Comment sommes-nous rémunérés ?
            </Link>
          </p>
        </div>
      </div>

      <div className="relative mt-10 select-none" aria-hidden>
        <div className="flex items-end gap-[2vw] px-[var(--gutter)]">
          <LogoMark className="mb-[1.6vw] size-[9vw] text-fg/80" />
          <span className="display block translate-y-[18%] text-[19vw] leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(236_234_228/0.16)]">
            INENCO
          </span>
        </div>
      </div>

      <div className="relative border-t border-[var(--line)] bg-ink-950">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-[var(--gutter)] py-5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-3 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © <CurrentYear /> {site.name} — {site.tagline}
          </span>
          <span>Conçu en France · Sans traceur publicitaire</span>
        </div>
      </div>
    </footer>
  );
}
