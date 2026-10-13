import { Fragment, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Titre découpé en mots, révélés en cascade à l'entrée dans le viewport.
 * Composant serveur : le découpage est fait au rendu, l'animation en CSS.
 * Les segments `*entre astérisques*` sont rendus en italique serif.
 */
export function Split({
  as: Tag = "h2",
  text,
  className,
  delay = 0,
  accentClassName = "serif italic font-normal tracking-[-0.02em]",
  immediate = false,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  delay?: number;
  accentClassName?: string;
  /** Anime au chargement (contenu au-dessus de la ligne de flottaison) plutôt qu'au scroll. */
  immediate?: boolean;
}) {
  let i = 0;
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  const nodes: ReactNode[] = [];
  parts.forEach((part, pi) => {
    const accent = part.startsWith("*") && part.endsWith("*");
    const words = (accent ? part.slice(1, -1) : part).split(/(\s+|\n)/);
    words.forEach((w, wi) => {
      if (w === "\n") {
        nodes.push(<br key={`${pi}-${wi}`} />);
        return;
      }
      if (/^\s+$/.test(w) || w === "") {
        if (w) nodes.push(<Fragment key={`${pi}-${wi}`}> </Fragment>);
        return;
      }
      nodes.push(
        <span key={`${pi}-${wi}`} className="w">
          <span className={accent ? accentClassName : undefined} style={{ ["--i" as string]: i++ }}>
            {w}
          </span>
        </span>,
      );
    });
  });

  return (
    <Tag className={cn("split", immediate && "split-load", className)} data-reveal={immediate ? undefined : "fade"} style={{ ["--d" as string]: delay }} aria-label={text.replace(/\*/g, "").replace(/\n/g, " ")}>
      <span aria-hidden>{nodes}</span>
    </Tag>
  );
}
