export type SessionNotes = {
  casePlayed: string;
  detectedIssues: string;
  voicedConsequences: string;
  relevantSolution: string;
  objection: string;
  closingAttempt: string;
  result: string;
  debrief: string;
};

export type TrainingStep = {
  id: string;
  shortLabel: string;
  title: string;
  objective: string;
  formulations: string[];
  watchouts: string[];
  checklist: string[];
};

export type DiscoveryAxis = {
  id: string;
  title: string;
  intent: string;
  questions: string[];
};

export type ClientScenario = {
  id: string;
  title: string;
  cabinet: string;
  size: string;
  interlocutor: string;
  dominantIssue: string;
  openingMood: string;
  context: string[];
  visibleIrritants: string[];
  consequences: string[];
  spontaneousLines: string[];
  hiddenSignals: string[];
  objection: string;
  expectedClosingReaction: string;
  relevantSolutions: string[];
  responseBank: {
    commercialQuestion: string;
    clientAnswer: string;
  }[];
};

export const defaultNotes: SessionNotes = {
  casePlayed: "",
  detectedIssues: "",
  voicedConsequences: "",
  relevantSolution: "",
  objection: "",
  closingAttempt: "",
  result: "",
  debrief: "",
};

export const trainingSteps: TrainingStep[] = [
  {
    id: "brise-glace",
    shortLabel: "Contact",
    title: "Brise-glace",
    objective:
      "Installer une relation simple et professionnelle avant d'entrer dans le fond.",
    formulations: [
      "Merci pour votre temps. Vous avez pu vous connecter facilement ?",
      "Avant de commencer, comment se passe la semaine au cabinet ?",
      "Je vous propose qu'on prenne quelques minutes pour comprendre votre organisation avant de parler solution.",
    ],
    watchouts: [
      "Ne pas demarrer par le produit.",
      "Ne pas prolonger trop longtemps la conversation informelle.",
      "Rester naturel, pas familier.",
    ],
    checklist: [
      "J'ai cree un contact simple.",
      "J'ai garde un ton professionnel.",
      "Je suis pret a poser le cadre.",
    ],
  },
  {
    id: "cadre",
    shortLabel: "Cadre",
    title: "Cadre de l'echange",
    objective:
      "Dire clairement pourquoi on se parle et eviter un entretien flou ou subi.",
    formulations: [
      "L'objectif aujourd'hui, c'est de comprendre votre fonctionnement actuel et de voir si Septeo peut vous aider sur des sujets concrets.",
      "Je ne vais pas commencer par vous derouler un catalogue. Je veux d'abord comprendre ce qui compte vraiment pour votre cabinet.",
      "Si on identifie un vrai sujet, je vous proposerai une avancee simple a la fin de l'echange.",
    ],
    watchouts: [
      "Ne pas promettre de tout traiter.",
      "Ne pas annoncer un entretien uniquement technique.",
      "Ne pas laisser le client definir seul le rythme.",
    ],
    checklist: [
      "Le client sait pourquoi on echange.",
      "La logique decouverte puis solution est posee.",
      "La possibilite d'une avancee finale est annoncee.",
    ],
  },
  {
    id: "plan",
    shortLabel: "Plan",
    title: "Plan de l'entretien",
    objective:
      "Donner un fil conducteur court pour securiser le client et guider le commercial.",
    formulations: [
      "Je vous propose trois temps : votre organisation actuelle, les points qui freinent, puis ce qu'on peut envisager concretement.",
      "On commence par votre situation, on creuse les impacts, puis je vous dirai ce qui me semble pertinent cote Septeo.",
      "A la fin, si c'est coherent, on decide ensemble de la prochaine etape.",
    ],
    watchouts: [
      "Ne pas annoncer dix etapes.",
      "Ne pas utiliser de jargon commercial.",
      "Ne pas oublier de parler de la prochaine etape.",
    ],
    checklist: [
      "Le plan est court.",
      "Le client comprend son role dans l'echange.",
      "La fin de l'entretien est cadree.",
    ],
  },
  {
    id: "timing",
    shortLabel: "Timing",
    title: "Timing",
    objective:
      "Verifier la disponibilite reelle du client et proteger le temps de closing.",
    formulations: [
      "Nous avons bien une vingtaine de minutes devant nous ?",
      "Je vous propose de garder cinq minutes a la fin pour decider de la suite.",
      "Si un point merite d'etre approfondi, je vous le signalerai et on priorisera.",
    ],
    watchouts: [
      "Ne pas decouvrir a la fin que le client doit partir.",
      "Ne pas sacrifier le closing faute de temps.",
      "Ne pas imposer un timing sans validation.",
    ],
    checklist: [
      "La duree est validee.",
      "Un temps de decision est preserve.",
      "Je peux avancer sans precipiter.",
    ],
  },
  {
    id: "validation",
    shortLabel: "Accord",
    title: "Validation",
    objective:
      "Obtenir un accord explicite sur la maniere d'avancer avant la decouverte.",
    formulations: [
      "Est-ce que cette maniere de proceder vous convient ?",
      "Ca vous va si on commence par votre organisation actuelle ?",
      "Si je vous pose quelques questions assez concretes, c'est bon pour vous ?",
    ],
    watchouts: [
      "Ne pas enchainer trop vite.",
      "Ne pas confondre silence et accord.",
      "Ne pas oublier de reformuler si le client hesite.",
    ],
    checklist: [
      "Le client a valide le cadre.",
      "Je peux questionner sans etre intrusif.",
      "L'entretien est engage.",
    ],
  },
  {
    id: "mini-pitch",
    shortLabel: "Pitch",
    title: "Mini-pitch Septeo",
    objective:
      "Presenter Septeo en moins de 45 secondes, sans voler la place de la decouverte.",
    formulations: [
      "Septeo accompagne les cabinets d'avocats sur leur organisation, leurs dossiers, leur relation client, leur pilotage et leurs gains de temps.",
      "Notre sujet, ce n'est pas seulement un logiciel. C'est de voir ou votre cabinet perd du temps, de la visibilite ou de la fluidite.",
      "Selon vos enjeux, on peut parler dossiers, facturation, espace client, rendez-vous, paiement en ligne ou IA avec Septeo Brain.",
    ],
    watchouts: [
      "Ne pas transformer le mini-pitch en demonstration produit.",
      "Ne pas citer toutes les offres.",
      "Ne pas supposer le besoin avant d'avoir questionne.",
    ],
    checklist: [
      "Mon pitch est court.",
      "Je parle enjeux avant produit.",
      "Je rebascule vite vers le client.",
    ],
  },
  {
    id: "decouverte",
    shortLabel: "Decouverte",
    title: "Mini-decouverte orientee enjeux",
    objective:
      "Faire emerger la situation, les frictions, les consequences et la valeur potentielle d'une solution.",
    formulations: [
      "Comment gerez-vous ce sujet aujourd'hui ?",
      "Qu'est-ce qui est le moins fluide dans votre organisation actuelle ?",
      "Quelles consequences cela a-t-il sur votre quotidien, vos clients ou votre equipe ?",
    ],
    watchouts: [
      "Ne pas argumenter pendant la decouverte.",
      "Ne pas accepter une reponse vague sans creuser.",
      "Ne pas oublier les consequences concretes.",
    ],
    checklist: [
      "J'ai compris la situation actuelle.",
      "J'ai identifie au moins un irritant fort.",
      "Le client a verbalise une consequence.",
      "J'ai valide que le sujet compte vraiment.",
    ],
  },
  {
    id: "argumentation",
    shortLabel: "Argumenter",
    title: "Argumentation a partir du client",
    objective:
      "Relier la solution Septeo a ce que le client vient de reconnaitre lui-meme.",
    formulations: [
      "Vous m'avez dit que..., et que cela avait pour consequence... La solution que je vous propose va vous permettre de...",
      "Ce que je retiens, c'est moins un sujet outil qu'un sujet de temps, de visibilite et de fluidite.",
      "La bonne entree Septeo ici, c'est celle qui traite votre irritant principal, pas un catalogue complet.",
    ],
    watchouts: [
      "Ne pas presenter une fonctionnalite sans la relier a un enjeu.",
      "Ne pas utiliser des benefices generiques.",
      "Ne pas oublier de verifier l'accord du client.",
    ],
    checklist: [
      "J'argumente avec les mots du client.",
      "Je relie enjeu, consequence et solution.",
      "Je demande ce que le client en pense.",
    ],
  },
  {
    id: "objection",
    shortLabel: "Objection",
    title: "Objection scriptée",
    objective:
      "Accueillir une objection sans se disperser, puis revenir aux enjeux reconnus.",
    formulations: [
      "Je comprends, c'est un budget et c'est normal de le regarder serieusement.",
      "Hormis le budget, est-ce qu'il y a un autre frein sur ce que nous venons de voir ?",
      "Si on remet ce budget en face des consequences que vous avez decrites, comment le regardez-vous ?",
    ],
    watchouts: [
      "Ne pas se justifier trop vite.",
      "Ne pas traiter une objection non isolee.",
      "Ne pas oublier de revenir a l'impact concret.",
    ],
    checklist: [
      "J'ai accueilli l'objection.",
      "J'ai isole le frein.",
      "Je suis revenu aux consequences exprimees.",
      "J'ai prepare le closing.",
    ],
  },
  {
    id: "closing",
    shortLabel: "Closing",
    title: "Closing sobre et assume",
    objective:
      "Proposer une avancee claire, puis reengager si le client se refugie dans une reflexion vague.",
    formulations: [
      "Puisque nous sommes d'accord sur les enjeux et sur l'utilite de la solution, je vous propose de programmer la mise en place. Le 8 ou le 16 vous conviendrait le mieux ?",
      "J'ai plutot le sentiment que l'essentiel est clarifie : vous avez tel enjeu, telle consequence, et cette solution repond bien au sujet. Le vrai sujet maintenant, c'est d'avancer.",
      "Je comprends. Pour moi, c'etait important de vous aider a sortir de cette situation. Prenez ce temps, et je vous propose qu'on fasse le point en fin de semaine.",
    ],
    watchouts: [
      "Ne pas demander timidement si le client veut reflechir.",
      "Ne pas forcer si le refus est maintenu.",
      "Ne pas closer sans avoir resume les enjeux.",
    ],
    checklist: [
      "J'ai resume les enjeux et consequences.",
      "J'ai propose une date ou une avancee concrete.",
      "J'ai reengage une fois si le client veut reflechir.",
      "J'ai su sortir proprement si le refus persiste.",
    ],
  },
];

export const discoveryAxes: DiscoveryAxis[] = [
  {
    id: "temps",
    title: "Temps perdu et charge mentale",
    intent:
      "Faire apparaitre les taches chronophages qui eloignent l'avocat de son coeur de metier.",
    questions: [
      "Aujourd'hui, qu'est-ce qui vous fait perdre le plus de temps au cabinet ?",
      "Sur quels sujets avez-vous le sentiment de passer trop d'energie pour peu de valeur ?",
      "Quelles consequences cela a-t-il sur votre disponibilite, votre stress ou vos delais ?",
    ],
  },
  {
    id: "dossiers",
    title: "Dossiers, actes et documents",
    intent:
      "Identifier les frictions dans la gestion des dossiers, pieces, actes et analyses documentaires.",
    questions: [
      "Comment gerez-vous aujourd'hui vos dossiers, vos pieces et vos actes ?",
      "Ou observez-vous le plus de lenteur ou de manipulation repetitive ?",
      "Si cette partie etait plus fluide, qu'est-ce que cela changerait pour vous ?",
    ],
  },
  {
    id: "facturation",
    title: "Facturation et tresorerie",
    intent:
      "Mesurer l'impact des factures, paiements, encaissements et impayes sur le pilotage.",
    questions: [
      "Comment suivez-vous la facturation et les encaissements aujourd'hui ?",
      "Avez-vous des delais de reglement qui vous penalisent ?",
      "Qu'est-ce que cela vous coute en temps, serenite ou visibilite ?",
    ],
  },
  {
    id: "relation-client",
    title: "Relation client et fluidite",
    intent:
      "Faire exprimer les appels, mails, relances et coordinations qui saturent le cabinet.",
    questions: [
      "Vos clients ont-ils facilement acces aux informations dont ils ont besoin ?",
      "Votre equipe recoit-elle beaucoup d'appels ou de mails de suivi ?",
      "Quel serait l'impact d'une relation client plus fluide et plus autonome ?",
    ],
  },
  {
    id: "pilotage",
    title: "Pilotage et visibilite",
    intent:
      "Comprendre si le cabinet sait lire son activite, sa rentabilite et ses priorites.",
    questions: [
      "Avez-vous une vision claire de la performance du cabinet ?",
      "Savez-vous identifier ce qui est rentable, ce qui consomme du temps, et ce qui bloque ?",
      "Comment ce manque de visibilite pese-t-il sur vos decisions ?",
    ],
  },
  {
    id: "confidentialite",
    title: "Confidentialite et IA",
    intent:
      "Rassurer sans minimiser les exigences de confidentialite propres aux avocats.",
    questions: [
      "Quand vous pensez IA ou automatisation, quelle est votre premiere reserve ?",
      "Quelles exigences de confidentialite sont non negociables pour vous ?",
      "A quelles conditions jugeriez-vous un outil compatible avec votre pratique ?",
    ],
  },
];

const standardPriceObjection =
  "C'est interessant, mais ca represente quand meme un budget tres important. Ca me fait hesiter.";

const standardPriceClosingReaction =
  "Accepte une prochaine etape si le commercial reconnait le budget, revient aux enjeux exprimes et propose une avancee simple et datee.";

export const clientScenarios: ClientScenario[] = [
  {
    id: "durand-associes",
    title: "Analyse documentaire sous tension",
    cabinet: "Durand & Associes",
    size: "6 avocats, 4 assistantes",
    interlocutor: "Associe en droit des affaires",
    dominantIssue: "Trop de volume documentaire et trop de temps perdu en analyse.",
    openingMood:
      "Ouvert, mais prudent sur l'IA et tres attentif a la confidentialite.",
    context: [
      "Le cabinet traite des dossiers avec beaucoup de pieces, de contrats et d'annexes.",
      "Les collaborateurs passent des heures a lire, trier, comparer et reformuler.",
      "L'associe veut gagner du temps sans mettre en risque la qualite juridique.",
    ],
    visibleIrritants: [
      "Lecture documentaire trop chronophage.",
      "Travail repetitif pour extraire l'essentiel.",
      "Retards sur certains dossiers complexes.",
      "Fatigue des collaborateurs sur les phases d'analyse.",
    ],
    consequences: [
      "Charge mentale forte pour l'associe et l'equipe.",
      "Moins de disponibilite pour le conseil client.",
      "Risque de delais qui s'allongent.",
      "Impression de subir le volume plutot que piloter les dossiers.",
    ],
    spontaneousLines: [
      "Nous avons un vrai sujet sur le volume des documents.",
      "Je suis interesse par l'IA, mais je ne veux pas d'une boite noire.",
      "La confidentialite est absolument non negociable.",
    ],
    hiddenSignals: [
      "Deux collaborateurs ont deja alerte sur la charge documentaire.",
      "L'associe craint une baisse de qualite si la pression continue.",
      "Il accepterait un pilote si le cadre de confidentialite est clair.",
    ],
    objection: standardPriceObjection,
    expectedClosingReaction: standardPriceClosingReaction,
    relevantSolutions: [
      "Septeo Brain pour resumer, comparer et extraire l'essentiel des documents.",
      "Integration aux outils du quotidien pour eviter une rupture d'usage.",
      "Argumentaire centre sur productivite documentaire et environnement controle.",
    ],
    responseBank: [
      {
        commercialQuestion:
          "Qu'est-ce qui vous fait perdre le plus de temps aujourd'hui ?",
        clientAnswer:
          "Clairement, la lecture et la synthese des pieces. Ce n'est pas rare que l'equipe y passe des blocs entiers de journee.",
      },
      {
        commercialQuestion:
          "Quelles consequences cela a-t-il sur votre organisation ?",
        clientAnswer:
          "Les dossiers avancent, mais sous tension. Et je sens que les collaborateurs sortent fatigues des phases d'analyse.",
      },
      {
        commercialQuestion:
          "A quelles conditions l'IA serait acceptable pour vous ?",
        clientAnswer:
          "Il me faut un cadre clair : confidentialite, controle par l'avocat, et pas un outil qui decide a notre place.",
      },
      {
        commercialQuestion: "Qu'est-ce qui vous ferait dire que ca vaut le coup ?",
        clientAnswer:
          "Si on gagne vraiment du temps sur l'extraction et la synthese sans perdre en rigueur, alors oui, ca devient interessant.",
      },
    ],
  },
  {
    id: "martin-legal",
    title: "Relation client et secretariat satures",
    cabinet: "Cabinet Martin Legal",
    size: "3 avocats, 2 personnes administratives",
    interlocutor: "Avocate fondatrice",
    dominantIssue:
      "Trop d'appels, trop de mails et trop de coordination manuelle avec les clients.",
    openingMood:
      "Sympathique, consciente du sujet, mais attentive a l'investissement.",
    context: [
      "Le cabinet fonctionne correctement juridiquement, mais l'organisation client est lourde.",
      "Les clients appellent souvent pour demander l'etat d'avancement des dossiers.",
      "La prise de rendez-vous, les relances et les partages de documents prennent trop de place.",
    ],
    visibleIrritants: [
      "Appels entrants de suivi trop frequents.",
      "Secretaire interrompue en permanence.",
      "Rendez-vous organises avec beaucoup d'allers-retours.",
      "Documents et informations disperses entre mails, dossiers et appels.",
    ],
    consequences: [
      "Sensation de desorganisation quotidienne.",
      "Secretariat sous tension.",
      "Clients parfois impatients.",
      "Image du cabinet moins moderne que souhaite.",
    ],
    spontaneousLines: [
      "Ce n'est pas une crise, mais c'est lourd au quotidien.",
      "Nos clients veulent etre rassures et ils appellent souvent.",
      "Je sais qu'on pourrait etre plus fluides, mais je dois arbitrer les investissements.",
    ],
    hiddenSignals: [
      "Elle a deja eu plusieurs remarques clients sur le manque de fluidite.",
      "Elle gere elle-meme certaines coordinations faute de temps au secretariat.",
      "Elle aimerait que le cabinet paraisse plus moderne et plus reactif.",
    ],
    objection: standardPriceObjection,
    expectedClosingReaction: standardPriceClosingReaction,
    relevantSolutions: [
      "Secib Online pour donner de la visibilite client et partager documents, factures, echeances.",
      "Meet Law pour fluidifier la prise de rendez-vous et alleger le secretariat.",
      "Paiement en ligne pour limiter les frictions de reglement.",
    ],
    responseBank: [
      {
        commercialQuestion:
          "Vos clients ont-ils facilement acces aux informations dont ils ont besoin ?",
        clientAnswer:
          "Pas toujours. Ils appellent souvent pour savoir ou en est leur dossier, meme quand l'information existe quelque part.",
      },
      {
        commercialQuestion:
          "Quel impact cela a-t-il sur votre secretariat ?",
        clientAnswer:
          "Ca coupe la concentration. On passe notre temps a reprendre les dossiers pour repondre a des demandes de suivi.",
      },
      {
        commercialQuestion:
          "Qu'est-ce que cela changerait si les clients etaient plus autonomes ?",
        clientAnswer:
          "On gagnerait beaucoup de calme. Et je pense que l'image du cabinet serait meilleure.",
      },
      {
        commercialQuestion:
          "Qu'est-ce qui vous ferait regarder le sujet maintenant ?",
        clientAnswer:
          "Si on voit clairement le temps gagne pour le secretariat et l'impact sur l'experience client, ca devient plus simple a arbitrer.",
      },
    ],
  },
  {
    id: "benali-roche",
    title: "Pilotage et tresorerie sans visibilite",
    cabinet: "Cabinet Benali-Roche",
    size: "9 avocats, 6 fonctions support",
    interlocutor: "Co-gerante responsable operations",
    dominantIssue:
      "Le cabinet manque de visibilite sur la rentabilite, les encaissements et les dossiers chronophages.",
    openingMood:
      "Exigeante, orientee chiffres, sensible au retour sur investissement.",
    context: [
      "Le cabinet a grandi vite et fonctionne encore avec des tableaux disperses.",
      "La direction voit les tensions de tresorerie trop tard.",
      "Certains dossiers consomment beaucoup de temps sans que la rentabilite soit claire.",
    ],
    visibleIrritants: [
      "Facturation suivie de maniere heterogene.",
      "Retards d'encaissement difficiles a anticiper.",
      "Peu de vision consolidee par activite ou par dossier.",
      "Decisions prises avec des donnees partielles.",
    ],
    consequences: [
      "Stress de pilotage pour les associes.",
      "Temps perdu a consolider les chiffres.",
      "Difficultes a prioriser les actions rentables.",
      "Impression que la croissance rend le cabinet moins lisible.",
    ],
    spontaneousLines: [
      "Notre sujet, c'est la visibilite. Je veux savoir ou nous gagnons et ou nous perdons du temps.",
      "Je ne veux pas acheter un outil de plus si le ROI n'est pas clair.",
      "La tresorerie n'est pas catastrophique, mais elle manque de predictibilite.",
    ],
    hiddenSignals: [
      "Un associe pousse pour mieux piloter les dossiers peu rentables.",
      "Le cabinet a deja eu deux alertes sur des encaissements plus tardifs que prevu.",
      "La co-gerante veut professionnaliser le pilotage avant une nouvelle phase de croissance.",
    ],
    objection: standardPriceObjection,
    expectedClosingReaction: standardPriceClosingReaction,
    relevantSolutions: [
      "Pilotage Septeo pour visualiser volumes, rentabilite, temps et activite.",
      "Facturation et encaissement pour reduire les retards et consolider la tresorerie.",
      "Tableaux de bord pour decider plus vite avec une vision fiable.",
    ],
    responseBank: [
      {
        commercialQuestion:
          "Avez-vous une vision claire de la performance du cabinet ?",
        clientAnswer:
          "Pas assez. Nous avons des chiffres, mais ils arrivent tard et ils ne racontent pas toujours la meme chose.",
      },
      {
        commercialQuestion:
          "Qu'est-ce que ce manque de visibilite provoque ?",
        clientAnswer:
          "On perd du temps a consolider, et surtout on decide avec une part d'intuition trop importante.",
      },
      {
        commercialQuestion:
          "Comment suivez-vous les encaissements aujourd'hui ?",
        clientAnswer:
          "Avec des extractions et des relances manuelles. Ca fonctionne, mais c'est artisanal pour notre taille.",
      },
      {
        commercialQuestion:
          "Si le pilotage etait plus clair, qu'est-ce que cela changerait ?",
        clientAnswer:
          "On saurait mieux ou agir, quels dossiers surveiller, et comment eviter les tensions de tresorerie.",
      },
    ],
  },
];

export const appPromise =
  "Structurer l'entretien pour rendre le closing naturel, propre et assume.";
