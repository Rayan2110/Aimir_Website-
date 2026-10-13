export type FaqItem = { q: string; a: string };
export type FaqGroup = { title: string; items: FaqItem[] };

export const faq: FaqGroup[] = [
  {
    title: "Le service",
    items: [
      {
        q: "Combien coûte l'accompagnement INENCO ?",
        a: "Aucun frais ne vous est facturé par INENCO. Nous sommes rémunérés par le fournisseur retenu, via une commission incluse dans le prix de son offre. Les offres que nous vous présentons sont donc comparées commission comprise, et c'est ce prix que vous payez.",
      },
      {
        q: "Suis-je engagé en envoyant ma facture ?",
        a: "Non. L'envoi d'une facture nous permet seulement de préparer une étude. Vous restez libre de donner suite ou non, et rien n'est signé sans votre accord explicite.",
      },
      {
        q: "Me proposerez-vous forcément une nouvelle offre ?",
        a: "Non. Nous ne vous présentons une proposition que si elle améliore votre situation actuelle, en prix ou en conditions. Si votre contrat est déjà bien placé, nous vous le disons.",
      },
      {
        q: "Avec quels fournisseurs travaillez-vous ?",
        a: "Nous consultons plusieurs fournisseurs d'électricité et de gaz partenaires, choisis selon votre profil : consommation, segment, localisation, durée souhaitée. Nous ne prétendons pas couvrir l'ensemble du marché : la liste des fournisseurs consultés figure dans chaque étude.",
      },
      {
        q: "Combien de temps prend une étude ?",
        a: "Il faut généralement quelques jours ouvrés entre la réception d'une facture complète et la présentation de l'étude. Le délai dépend du nombre de sites et des délais de réponse des fournisseurs.",
      },
    ],
  },
  {
    title: "Changement de fournisseur",
    items: [
      {
        q: "Y a-t-il un risque de coupure ?",
        a: "Non. Le changement de fournisseur est un changement purement contractuel. Le réseau, le compteur et la qualité de l'approvisionnement ne changent pas, et aucune intervention technique n'est nécessaire.",
      },
      {
        q: "Dois-je résilier mon contrat actuel ?",
        a: "En règle générale, la souscription chez le nouveau fournisseur entraîne la résiliation du contrat précédent. Certains contrats professionnels prévoient un préavis ou des frais de sortie anticipée : nous les vérifions avant toute recommandation.",
      },
      {
        q: "Qui s'occupe des démarches ?",
        a: "Nous préparons le dossier de souscription, vérifions les informations du site (PDL pour l'électricité, PCE pour le gaz) et suivons l'activation du contrat. Vous n'avez qu'à valider l'offre choisie.",
      },
      {
        q: "Je suis au tarif réglementé. Est-ce que ça vous concerne ?",
        a: "Oui. Les tarifs réglementés d'électricité restent ouverts aux entreprises de moins de 10 personnes dont le chiffre d'affaires ou le total de bilan ne dépasse pas 2 M€, ainsi qu'aux syndicats de copropriété d'immeubles d'habitation. Si vous y êtes éligible, nous comparons ce tarif aux offres de marché : il reste parfois l'option la plus adaptée, et nous vous le disons. Pour le gaz, les tarifs réglementés ont disparu le 1er juillet 2023.",
      },
      {
        q: "Y a-t-il des frais si je quitte mon contrat avant son terme ?",
        a: "Cela dépend de votre contrat. Pour les petits professionnels (jusqu'à 36 kVA en électricité, moins de 30 MWh par an en gaz), les indemnités de résiliation anticipée sont en principe interdites, sauf pour les contrats à prix fixe et à durée déterminée. Les contrats plus importants prévoient souvent des conditions de sortie. Nous les vérifions systématiquement avant toute recommandation.",
      },
      {
        q: "Puis-je changer d'avis après avoir signé ?",
        a: "Si votre entreprise compte 5 salariés au plus et que le contrat est conclu hors établissement (par exemple lors d'un rendez-vous dans vos locaux) pour un service qui n'entre pas dans votre activité principale, vous bénéficiez d'un délai de rétractation de 14 jours (article L.221-3 du Code de la consommation). Le détail figure dans nos conditions générales.",
      },
      {
        q: "En cas de litige avec mon fournisseur, qui contacter ?",
        a: "Adressez d'abord une réclamation écrite à votre fournisseur. Si votre entreprise compte moins de 10 personnes et réalise au plus 2 M€ de chiffre d'affaires, vous pouvez ensuite saisir gratuitement le Médiateur national de l'énergie. Le site energie-info.fr, service public d'information, détaille vos droits. Nous vous accompagnons dans ces démarches.",
      },
    ],
  },
  {
    title: "Documents & données",
    items: [
      {
        q: "Quels documents faut-il envoyer ?",
        a: "Une facture récente d'électricité et/ou de gaz suffit pour commencer : un PDF ou une simple photo lisible. Pour une analyse plus fine, nous pourrons vous demander un historique de consommation ou votre contrat.",
      },
      {
        q: "Que faites-vous de ma facture ?",
        a: "Elle sert uniquement à préparer votre étude. Elle est transmise de façon chiffrée, n'est accessible qu'à l'équipe INENCO chargée de votre dossier et n'est conservée que pendant la durée nécessaire. Le détail figure dans notre politique de confidentialité.",
      },
      {
        q: "Vos études sont-elles faites par une intelligence artificielle ?",
        a: "Non. Aujourd'hui, chaque facture est lue et analysée par notre équipe. Si nous utilisons un jour des outils de lecture automatique, nous l'indiquerons clairement.",
      },
    ],
  },
  {
    title: "Marché de l'énergie",
    items: [
      {
        q: "Qu'est-ce qui a changé avec la fin de l'ARENH ?",
        a: "Le dispositif ARENH, qui permettait aux fournisseurs d'acheter une partie de l'électricité nucléaire d'EDF à prix fixe, a pris fin le 31 décembre 2025. Il est remplacé depuis 2026 par un nouveau mécanisme de redistribution. Pour vous, cela peut modifier la structure des offres proposées : c'est un point que nous expliquons dans chaque étude.",
      },
      {
        q: "Prix fixe ou prix indexé : que choisir ?",
        a: "Un prix fixe sécurise votre budget pendant toute la durée du contrat. Un prix indexé suit le marché, à la hausse comme à la baisse. Il n'y a pas de bonne réponse universelle : cela dépend de votre tolérance au risque, de votre trésorerie et du moment. Nous présentons les deux options lorsque c'est pertinent, avec leurs risques.",
      },
    ],
  },
  {
    title: "Multi-sites & suivi",
    items: [
      {
        q: "Vous accompagnez des entreprises avec plusieurs établissements ?",
        a: "Oui, c'est l'une de nos spécialités. Nous inventorions tous vos sites et leurs contrats, puis nous établissons un calendrier des échéances et une stratégie d'achat, groupée ou site par site.",
      },
      {
        q: "Que se passe-t-il après la signature ?",
        a: "Nous suivons votre contrat jusqu'à son échéance. Nous vous recontactons avant la fenêtre de renouvellement pour relancer une consultation au bon moment.",
      },
      {
        q: "Qu'est-ce qu'INENCO ENERGY DESK ?",
        a: "C'est notre espace client en préparation. Vous y retrouverez vos sites, contrats, échéances, documents et alertes dans une seule interface. Il ouvrira progressivement à nos clients, et vous pouvez en découvrir une démonstration sur ce site.",
      },
    ],
  },
];
