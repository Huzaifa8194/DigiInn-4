// ONYX PLUS GROUP: every visible string lives here, in French (default) and English.
//
// Assumptions to confirm with the client (listed in the hand-off too):
//  - domain onyxplusgroup.com and email contact@onyxplusgroup.com are placeholders
//  - phone number and street address are not known: shown as "communiqués sur demande"
//  - the Zuénoula plant is a PROJECT in development: no capacity, date or investment figure is published
//  - photos supplied by the client are shown as the group's team and field work
//  - SIAT 2026 (16th edition, forum on 29 October) appears on the supplied photo banner
//  - travel destination codes on the board (ABJ, CDG, IST, DXB, CMN) illustrate international ticketing

export type Lang = 'fr' | 'en';
export type PageKey = 'home' | 'group' | 'agro' | 'energy' | 'travel' | 'projects' | 'contact';

export const routes: Record<PageKey, Record<Lang, string>> = {
  home: { fr: '/', en: '/en/' },
  group: { fr: '/groupe/', en: '/en/group/' },
  agro: { fr: '/agro-industrie/', en: '/en/agro-industry/' },
  energy: { fr: '/energie/', en: '/en/energy/' },
  travel: { fr: '/voyages/', en: '/en/travel/' },
  projects: { fr: '/projets/', en: '/en/projects/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
};

export const site = {
  name: 'ONYX PLUS GROUP',
  url: 'https://onyxplusgroup.com', // placeholder: production URL (canonical, OG, sitemap)
  email: 'contact@onyxplusgroup.com', // placeholder
  country: "Côte d'Ivoire",
};

type T = Record<Lang, string>;
const t = (fr: string, en: string): T => ({ fr, en });

export const ui = {
  skip: t('Aller au contenu', 'Skip to content'),
  menu: t('Menu', 'Menu'),
  close: t('Fermer', 'Close'),
  langName: t('Français', 'English'),
  otherLang: t('EN', 'FR'),
  otherLangLabel: t('Read this page in English', 'Lire cette page en français'),
  contactCta: t('Nous écrire', 'Write to us'),
  pause: t('Mettre le tableau en pause', 'Pause the board'),
  play: t('Relancer le tableau', 'Resume the board'),
  photo: t('Photo', 'Photo'),
  illustration: t('Image d’illustration', 'Illustrative image'),
  backHome: t('Retour à l’accueil', 'Back to home'),
  next: t('Métier suivant', 'Next division'),
  role: t('Groupe ivoirien diversifié', 'Diversified Ivorian group'),
  tagline: t('Bâtir des opportunités. Créer de la valeur.', 'Building opportunities. Creating value.'),
  mission: t('Notre mission : vous offrir des produits et services de qualité.', 'Our mission: to offer you quality products and services.'),
  legal: t('Mentions légales communiquées sur demande', 'Legal notice available on request'),
  rights: t('Tous droits réservés', 'All rights reserved'),
  credits: t('Photos de cajou : Bernd Dittrich, Anton Shuvalov, Vasanth Kedige, Maja Vujic (Unsplash). Autres photos : ONYX PLUS GROUP.', 'Cashew photos: Bernd Dittrich, Anton Shuvalov, Vasanth Kedige, Maja Vujic (Unsplash). Other photos: ONYX PLUS GROUP.'),
};

export const nav: { key: PageKey; label: T }[] = [
  { key: 'group', label: t('Le Groupe', 'The Group') },
  { key: 'agro', label: t('Agro-industrie', 'Agro-industry') },
  { key: 'energy', label: t('Énergie', 'Energy') },
  { key: 'travel', label: t('Voyages', 'Travel') },
  { key: 'projects', label: t('Projets', 'Projects') },
  { key: 'contact', label: t('Partenariats', 'Partnerships') },
];

// ---------- Divisions ----------
export type Division = {
  key: 'agro' | 'energy' | 'travel';
  no: string;
  name: T; // "ONYX AGRO-INDUSTRY"
  short: T;
  line: T; // one-line positioning
  intro: T;
  codes: string[]; // flap codes, cycled on the board
  codeLabel: T;
  offers: { title: T; text: T }[];
  audiences: T[];
  field: string; // CSS var
};

export const divisions: Division[] = [
  {
    key: 'agro',
    no: '01',
    name: t('ONYX AGRO-INDUSTRY', 'ONYX AGRO-INDUSTRY'),
    short: t('Agro-industrie', 'Agro-industry'),
    line: t('Transformation de la noix de cajou et création de valeur agro-industrielle.', 'Cashew nut processing and agro-industrial value creation.'),
    intro: t(
      'La Côte d’Ivoire est le premier producteur mondial de noix de cajou brute, et la plus grande part de sa récolte quitte encore le pays sans être transformée. ONYX AGRO-INDUSTRY développe à Zuénoula une unité qui transforme la noix brute en amandes calibrées, pour vendre une valeur ajoutée ivoirienne aux acheteurs du monde entier.',
      'Côte d’Ivoire is the world’s largest producer of raw cashew nuts, and most of its harvest still leaves the country unprocessed. ONYX AGRO-INDUSTRY is developing a unit in Zuénoula that turns raw nuts into graded kernels, so international buyers can source Ivorian added value.'
    ),
    codes: ['W180', 'W210', 'W240', 'W320', 'W450'],
    codeLabel: t('Calibres d’amandes', 'Kernel grades'),
    offers: [
      { title: t('Usine de Zuénoula', 'Zuénoula plant'), text: t('Projet d’unité de transformation de noix de cajou brute en amandes, au cœur d’une zone de production.', 'A plant project turning raw cashew nuts into kernels, at the heart of a growing region.') },
      { title: t('Amandes calibrées', 'Graded kernels'), text: t('Amandes entières blanches W180, W210, W240, W320 et W450, du plus gros calibre au plus petit.', 'White whole kernels W180, W210, W240, W320 and W450, from the largest grade to the smallest.') },
      { title: t('Qualité et traçabilité', 'Quality and traceability'), text: t('Contrôle à chaque étape, de la réception des lots de noix brute au conditionnement, avec un suivi par lot.', 'Checks at every step, from raw nut intake to packing, with lot-by-lot tracking.') },
      { title: t('Capacités et expansion', 'Capacity and expansion'), text: t('Une montée en capacité par étapes, ouverte aux partenaires industriels et financiers.', 'Capacity built in stages, open to industrial and financial partners.') },
    ],
    audiences: [t('Importateurs', 'Importers'), t('Grossistes', 'Wholesalers'), t('Distributeurs', 'Distributors'), t('Industriels de l’agroalimentaire', 'Food manufacturers'), t('Investisseurs', 'Investors'), t('Acheteurs internationaux', 'International buyers')],
    field: 'var(--c-agro)',
  },
  {
    key: 'energy',
    no: '02',
    name: t('ONYX ENERGY & INFRASTRUCTURE', 'ONYX ENERGY & INFRASTRUCTURE'),
    short: t('Énergie', 'Energy'),
    line: t('Solutions électriques, équipements et infrastructures énergétiques.', 'Electrical solutions, equipment and energy infrastructure.'),
    intro: t(
      'Du poste de transformation au tableau de distribution, ONYX ENERGY & INFRASTRUCTURE fournit les équipements qui amènent l’électricité jusqu’aux sites industriels, aux bâtiments et aux réseaux, en travaillant directement avec les fabricants.',
      'From the substation to the distribution board, ONYX ENERGY & INFRASTRUCTURE supplies the equipment that carries power to industrial sites, buildings and networks, working directly with manufacturers.'
    ),
    codes: ['HTA', 'BT', 'TRAFO', 'CABLE'],
    codeLabel: t('Familles d’équipements', 'Equipment families'),
    offers: [
      { title: t('Équipements HTA et BT', 'MV and LV equipment'), text: t('Matériel moyenne et basse tension pour réseaux, sites industriels et bâtiments.', 'Medium and low voltage equipment for networks, industrial sites and buildings.') },
      { title: t('Transformateurs', 'Transformers'), text: t('Transformateurs de puissance et de distribution.', 'Power and distribution transformers.') },
      { title: t('Cellules et protection', 'Switchgear and protection'), text: t('Cellules moyenne tension, appareillage de coupure et équipements de protection.', 'Medium voltage switchgear, breaking devices and protection equipment.') },
      { title: t('Câbles HTA et BT', 'MV and LV cables'), text: t('Câbles électriques moyenne et basse tension.', 'Medium and low voltage power cables.') },
      { title: t('Distribution électrique', 'Electrical distribution'), text: t('Tableaux et équipements de distribution.', 'Distribution boards and equipment.') },
      { title: t('Fournisseurs et projets', 'Supply and projects'), text: t('Approvisionnement auprès des fabricants, partenariats industriels et solutions pour projets d’infrastructure électrique.', 'Supply from manufacturers, industrial partnerships and solutions for electrical infrastructure projects.') },
    ],
    audiences: [t('Compagnies d’électricité', 'Electricity companies'), t('Opérateurs industriels', 'Industrial operators'), t('Bureaux d’études', 'Engineering firms'), t('Entreprises de BTP', 'Construction companies'), t('Distributeurs de matériel électrique', 'Electrical equipment distributors'), t('Institutions publiques', 'Public institutions')],
    field: 'var(--c-energy)',
  },
  {
    key: 'travel',
    no: '03',
    name: t('ONYX TRAVEL & TOURISM', 'ONYX TRAVEL & TOURISM'),
    short: t('Voyages', 'Travel'),
    line: t('Voyages, tourisme et assistance aux déplacements internationaux.', 'Travel, tourism and international travel assistance.'),
    intro: t(
      'Billets, hôtels, missions d’affaires et salons professionnels : ONYX TRAVEL & TOURISM organise les déplacements de ceux qui font des affaires entre l’Afrique et le monde, et accompagne chaque voyageur du départ au retour.',
      'Tickets, hotels, business missions and trade fairs: ONYX TRAVEL & TOURISM arranges travel for people doing business between Africa and the world, and supports every traveller from departure to return.'
    ),
    codes: ['ABJ', 'CDG', 'IST', 'DXB', 'CMN'],
    codeLabel: t('Codes aéroports', 'Airport codes'),
    offers: [
      { title: t('Billetterie aérienne', 'Airline ticketing'), text: t('Émission de billets et réservation de vols internationaux.', 'Ticket issuing and international flight reservations.') },
      { title: t('Réservations hôtelières', 'Hotel reservations'), text: t('Hébergement adapté au séjour, au budget et au programme.', 'Accommodation matched to the stay, the budget and the schedule.') },
      { title: t('Voyages d’affaires', 'Business travel'), text: t('Organisation complète des missions professionnelles.', 'Full organisation of professional missions.') },
      { title: t('Tourisme et loisirs', 'Tourism and leisure'), text: t('Séjours et forfaits touristiques.', 'Tourism and leisure packages.') },
      { title: t('Assistance voyageurs', 'Passenger support'), text: t('Accompagnement et assistance avant, pendant et après le voyage.', 'Support and assistance before, during and after the trip.') },
      { title: t('Salons et événements', 'Fairs and events'), text: t('Déplacements pour les salons internationaux, expositions professionnelles et rencontres d’affaires.', 'Travel to international trade fairs, professional exhibitions and business events.') },
    ],
    audiences: [t('Particuliers', 'Individuals'), t('Entreprises', 'Companies'), t('Professionnels', 'Business professionals'), t('Investisseurs', 'Investors'), t('Voyageurs internationaux', 'International travellers')],
    field: 'var(--c-travel)',
  },
];

// ---------- The chain (home signature) ----------
export const chain = {
  eyebrow: t('La chaîne de valeur', 'The value chain'),
  title: t('Une noix, six étapes, une valeur ajoutée', 'One nut, six steps, added value'),
  steps: [
    { code: 'ANACARDE', label: t('Sur l’arbre', 'On the tree'), title: t('La noix pousse sous la pomme', 'The nut grows under the apple'), text: t('Le fruit charnu de l’anacardier est la pomme de cajou. La vraie richesse pend en dessous : la noix, qui porte l’amande.', 'The fleshy fruit of the cashew tree is the cashew apple. The real value hangs beneath it: the nut, which holds the kernel.') },
    { code: 'RCN', label: t('Noix brute', 'Raw nut'), title: t('La noix brute, matière première ivoirienne', 'Raw nuts, an Ivorian raw material'), text: t('Récoltée, séchée et stockée en sacs de jute, la noix brute de cajou est l’une des grandes productions agricoles de la Côte d’Ivoire.', 'Harvested, dried and stored in jute bags, the raw cashew nut is one of Côte d’Ivoire’s major crops.') },
    { code: '+ COQUE', label: t('Décorticage', 'Shelling'), title: t('La coque s’ouvre', 'The shell opens'), text: t('Après une cuisson à la vapeur, la coque est ouverte pour libérer l’amande entière, sans la briser.', 'After steam cooking, the shell is opened to free the whole kernel without breaking it.') },
    { code: '+ PEAU', label: t('Dépelliculage', 'Peeling'), title: t('L’amande révèle sa couleur', 'The kernel shows its colour'), text: t('Séchée, l’amande perd sa fine peau brune. Elle apparaît alors ivoire, prête à être triée.', 'Once dried, the kernel loses its thin brown skin and turns ivory, ready to be sorted.') },
    { code: 'W240', label: t('Calibrage', 'Grading'), title: t('Chaque amande trouve son calibre', 'Each kernel finds its grade'), text: t('W pour « white wholes », le nombre pour les amandes par livre : W180 pour les plus grosses, W450 pour les plus petites.', 'W stands for white wholes, the number for kernels per pound: W180 for the largest, W450 for the smallest.') },
    { code: 'EXPORT', label: t('Conditionnement', 'Packing'), title: t('Prête pour l’export', 'Ready for export'), text: t('Mises en sacs sous vide, puis en cartons, les amandes partent vers les importateurs et les industriels du monde entier.', 'Vacuum packed in bags, then boxed in cartons, the kernels leave for importers and food manufacturers worldwide.') },
  ],
  close: t('Chaque étape ajoute de la valeur. C’est le + d’ONYX+.', 'Every step adds value. That is the + in ONYX+.'),
  // Annotations placed around the cashew, like a specimen sheet (x, y in % of the stage).
  notes: [
    { step: 1, side: 'r', x: 60, y: 30, text: t('Pomme de cajou, le faux fruit', 'Cashew apple, the false fruit') },
    { step: 1, side: 'r', x: 60, y: 62, text: t('La noix, le vrai fruit', 'The nut, the true fruit') },
    { step: 2, side: 'l', x: 40, y: 34, text: t('Coque dure, en deux valves', 'Hard shell, in two halves') },
    { step: 2, side: 'l', x: 40, y: 64, text: t('Récolte ivoirienne, de février à juin', 'Ivorian harvest, February to June') },
    { step: 3, side: 'r', x: 62, y: 32, text: t('Valve supérieure', 'Upper half') },
    { step: 3, side: 'r', x: 62, y: 62, text: t('L’amande, encore dans sa peau', 'The kernel, still in its skin') },
    { step: 4, side: 'l', x: 40, y: 36, text: t('Pellicule brune, retirée', 'Brown testa, removed') },
    { step: 4, side: 'l', x: 40, y: 64, text: t('Amande blanche entière', 'White whole kernel') },
    { step: 5, side: 'r', x: 61, y: 34, text: t('W240 : 240 amandes par livre', 'W240: 240 kernels per pound') },
    { step: 5, side: 'r', x: 61, y: 64, text: t('Environ 1,9 g par amande', 'About 1.9 g per kernel') },
    { step: 6, side: 'l', x: 38, y: 30, text: t('Sac sous vide, scellé', 'Vacuum bag, sealed') },
    { step: 6, side: 'l', x: 38, y: 66, text: t('En carton, étiqueté par lot', 'Boxed, labelled by lot') },
  ],
};

// ---------- Home ----------
export const home = {
  title: t('Agro-industrie, énergie et voyages', 'Agro-industry, energy and travel'),
  description: t(
    'ONYX PLUS GROUP, groupe ivoirien diversifié : transformation de la noix de cajou, équipements électriques HTA et BT, voyages et tourisme d’affaires.',
    'ONYX PLUS GROUP, a diversified Ivorian group: cashew nut processing, MV and LV electrical equipment, business travel and tourism.'
  ),
  lead: t(
    'Un groupe ivoirien diversifié qui développe trois métiers pour l’économie de l’Afrique et des marchés internationaux.',
    'A diversified Ivorian group building three businesses for the economies of Africa and international markets.'
  ),
  ctaPrimary: t('Découvrir nos métiers', 'Explore our divisions'),
  ctaSecondary: t('Devenir partenaire', 'Become a partner'),
  boardTitle: t('Nos trois métiers', 'Our three divisions'),
  statementLabel: t('Le Groupe', 'The Group'),
  statement: t(
    'ONYX PLUS GROUP développe ses activités autour de trois secteurs stratégiques : la transformation agro-industrielle, les solutions et infrastructures électriques, et les services de voyage et de tourisme.',
    'ONYX PLUS GROUP builds its business around three strategic sectors: agro-industrial processing, electrical solutions and infrastructure, and travel and tourism services.'
  ),
  statementMore: t(
    'À travers ses divisions, le Groupe veut contribuer au développement économique, à la valorisation des ressources locales, à la modernisation des infrastructures et aux échanges d’affaires entre la Côte d’Ivoire et le monde.',
    'Through its divisions, the Group aims to contribute to economic development, to the value of local resources, to modern infrastructure and to business exchange between Côte d’Ivoire and the world.'
  ),
  statementLink: t('Découvrir le Groupe', 'About the Group'),
  divisionsTitle: t('Trois métiers, une même exigence', 'Three divisions, one standard'),
  divisionLink: t('Voir le métier', 'See the division'),
  forWhom: t('Pour', 'For'),
  projectLabel: t('Projet phare', 'Flagship project'),
  projectTitle: t('L’usine de cajou de Zuénoula', 'The Zuénoula cashew plant'),
  projectText: t(
    'Au centre-ouest de la Côte d’Ivoire, ONYX AGRO-INDUSTRY développe une unité de transformation de la noix de cajou brute en amandes calibrées, pensée pour la qualité, la traçabilité et l’export.',
    'In central-western Côte d’Ivoire, ONYX AGRO-INDUSTRY is developing a unit that turns raw cashew nuts into graded kernels, designed for quality, traceability and export.'
  ),
  projectFacts: [
    { k: t('Lieu', 'Location'), v: t('Zuénoula, Côte d’Ivoire', 'Zuénoula, Côte d’Ivoire') },
    { k: t('Statut', 'Status'), v: t('Projet en développement', 'Project in development') },
    { k: t('Produits', 'Products'), v: t('Amandes W180 à W450', 'W180 to W450 kernels') },
  ],
  projectLink: t('Voir le projet', 'See the project'),
  fieldLabel: t('Sur le terrain', 'In the field'),
  fieldTitle: t('Des équipes au contact du produit et des marchés', 'Teams close to the product and to the markets'),
  partnersLabel: t('Partenariats', 'Partnerships'),
  partnersTitle: t('Construisons ensemble', 'Let’s build together'),
};

export const field = [
  { img: 'team-6', caption: t('Notre équipe dans un magasin d’amandes conditionnées.', 'Our team in a packed-kernel store.') },
  { img: 'sorting-line', caption: t('Sur une ligne de tri d’amandes de cajou.', 'On a cashew kernel sorting line.') },
  { img: 'warehouse-inspection', caption: t('Inspection d’un stock de noix brutes en sacs de jute.', 'Inspecting a stock of raw nuts in jute bags.') },
  { img: 'siat-forum', caption: t('Au forum du SIAT 2026, 16e édition, le 29 octobre.', 'At the SIAT 2026 forum, 16th edition, on 29 October.') },
  { img: 'trade-fair', caption: t('Rencontres professionnelles sur un salon international.', 'Business meetings at an international trade fair.') },
];

export const partners = [
  { who: t('Investisseurs', 'Investors'), what: t('Participer au développement de l’usine de Zuénoula et des métiers du Groupe.', 'Take part in the Zuénoula plant and the Group’s divisions.') },
  { who: t('Acheteurs d’amandes', 'Kernel buyers'), what: t('Préparer vos approvisionnements en amandes de cajou calibrées.', 'Plan your supply of graded cashew kernels.') },
  { who: t('Fabricants et fournisseurs', 'Manufacturers and suppliers'), what: t('Distribuer vos équipements électriques et participer à nos projets.', 'Distribute your electrical equipment and join our projects.') },
  { who: t('Entreprises et voyageurs', 'Companies and travellers'), what: t('Confier vos déplacements, vos missions et vos salons.', 'Hand us your trips, missions and trade fairs.') },
];

// ---------- Group page ----------
export const group = {
  title: t('Le Groupe', 'The Group'),
  description: t('ONYX PLUS GROUP, groupe ivoirien diversifié : sa mission, ses trois métiers et son ambition en Afrique et à l’international.', 'ONYX PLUS GROUP, a diversified Ivorian group: its mission, its three divisions and its ambition across Africa and beyond.'),
  h1: t('Un groupe ivoirien, trois métiers, une ambition internationale', 'An Ivorian group, three divisions, an international ambition'),
  intro: t(
    'ONYX PLUS GROUP est un groupe ivoirien diversifié qui développe ses activités autour de trois secteurs stratégiques : la transformation agro-industrielle, les solutions et infrastructures électriques, et les services de voyage et de tourisme.',
    'ONYX PLUS GROUP is a diversified Ivorian group building its business around three strategic sectors: agro-industrial processing, electrical solutions and infrastructure, and travel and tourism services.'
  ),
  plusTitle: t('Pourquoi le +', 'Why the +'),
  plusText: t(
    'Le + du nom dit notre façon de travailler : ajouter de la valeur à ce qui existe déjà. Transformer sur place une noix récoltée ici. Fournir l’équipement qui manque à un réseau. Organiser le voyage qui rend possible un contrat.',
    'The + in our name is how we work: adding value to what already exists. Processing here a nut harvested here. Supplying the equipment a network is missing. Arranging the trip that makes a contract possible.'
  ),
  pillarsTitle: t('Ce que le Groupe veut apporter', 'What the Group sets out to deliver'),
  pillars: [
    { title: t('Développement économique', 'Economic development'), text: t('Créer de l’activité et des emplois là où la matière première est produite.', 'Create business and jobs where raw materials are produced.') },
    { title: t('Ressources locales', 'Local resources'), text: t('Valoriser en Côte d’Ivoire des productions qui partent aujourd’hui brutes.', 'Add value in Côte d’Ivoire to crops that leave unprocessed today.') },
    { title: t('Infrastructures modernes', 'Modern infrastructure'), text: t('Équiper les réseaux, les industries et les bâtiments en matériel électrique fiable.', 'Equip networks, industries and buildings with reliable electrical equipment.') },
    { title: t('Échanges internationaux', 'International exchange'), text: t('Faciliter les voyages d’affaires et les échanges commerciaux.', 'Make business travel and trade easier.') },
  ],
  presenceTitle: t('Présents là où les affaires se décident', 'Present where business is decided'),
  presenceText: t(
    'Salons agricoles, forums d’investissement, rencontres professionnelles : le Groupe va à la rencontre de ses partenaires, en Afrique et au-delà.',
    'Agricultural fairs, investment forums, business meetings: the Group goes out to meet its partners, in Africa and beyond.'
  ),
};

// ---------- Division pages ----------
export const divisionPage = {
  agro: {
    title: t('Transformation de la noix de cajou', 'Cashew nut processing'),
    description: t('Transformation de la noix de cajou brute en amandes calibrées W180, W210, W240, W320 et W450 : le projet d’usine de Zuénoula, la qualité et la traçabilité.', 'Raw cashew nuts processed into W180, W210, W240, W320 and W450 graded kernels: the Zuénoula plant project, quality and traceability.'),
    gradesTitle: t('Cinq calibres, à l’échelle', 'Five grades, to scale'),
    gradesText: t('Le chiffre du calibre compte les amandes entières dans une livre (453,6 g). Plus il est petit, plus l’amande est grosse. Les dessins ci-dessous respectent ces proportions.', 'The grade number counts whole kernels in one pound (453.6 g). The smaller the number, the larger the kernel. The drawings below keep those proportions.'),
    perLb: t('amandes par livre', 'kernels per pound'),
    perKg: t('par kilo', 'per kilo'),
    each: t('par amande', 'per kernel'),
    processTitle: t('De la noix brute à l’amande', 'From raw nut to kernel'),
    process: [
      { t: t('Réception et contrôle', 'Intake and testing'), d: t('Chaque lot de noix brute est pesé, échantillonné et contrôlé avant stockage.', 'Every raw nut lot is weighed, sampled and tested before storage.') },
      { t: t('Séchage et stockage', 'Drying and storage'), d: t('Les noix sont séchées puis stockées en sacs, au sec et ventilées.', 'Nuts are dried, then stored in bags in a dry, ventilated store.') },
      { t: t('Calibrage des noix', 'Nut sizing'), d: t('Les noix brutes sont séparées par taille avant la cuisson.', 'Raw nuts are separated by size before cooking.') },
      { t: t('Cuisson à la vapeur', 'Steam cooking'), d: t('La vapeur assouplit la coque et facilite son ouverture.', 'Steam softens the shell so it opens cleanly.') },
      { t: t('Décorticage', 'Shelling'), d: t('La coque est ouverte et l’amande entière en est extraite.', 'The shell is opened and the whole kernel taken out.') },
      { t: t('Séchage des amandes', 'Kernel drying'), d: t('Les amandes sont séchées pour décoller la peau et stabiliser l’humidité.', 'Kernels are dried to loosen the skin and stabilise moisture.') },
      { t: t('Dépelliculage', 'Peeling'), d: t('La fine peau brune est retirée.', 'The thin brown skin is removed.') },
      { t: t('Tri et classement', 'Sorting and grading'), d: t('Les amandes sont triées par couleur, intégrité et calibre.', 'Kernels are sorted by colour, wholeness and grade.') },
      { t: t('Conditionnement', 'Packing'), d: t('Mise en sacs sous vide, en cartons, avec étiquetage par lot.', 'Vacuum bagged, boxed in cartons, labelled by lot.') },
    ],
    qualityTitle: t('Qualité et traçabilité', 'Quality and traceability'),
    quality: [
      t('Un numéro de lot suit la noix de la réception au sac scellé.', 'A lot number follows the nut from intake to the sealed bag.'),
      t('Contrôles d’humidité, de couleur et d’intégrité à chaque étape clé.', 'Moisture, colour and wholeness checks at every key step.'),
      t('Des calibres conformes aux usages du commerce international de l’amande.', 'Grades in line with international kernel trade practice.'),
    ],
    capacityTitle: t('Capacités et perspectives', 'Capacity and outlook'),
    capacityText: t('Les capacités de transformation de l’usine et le calendrier de mise en service seront communiqués avec l’avancement du projet. Le Groupe prévoit une montée en capacité par étapes, ouverte aux partenariats industriels.', 'The plant’s processing capacity and start-up schedule will be published as the project moves forward. The Group plans to build capacity in stages, open to industrial partnerships.'),
  },
  energy: {
    title: t('Équipements électriques HTA et BT', 'MV and LV electrical equipment'),
    description: t('Équipements électriques HTA et BT, transformateurs, cellules, câbles et distribution, en partenariat avec les fabricants, pour réseaux et sites industriels.', 'MV and LV electrical equipment, transformers, switchgear, cables and distribution, with manufacturers, for networks and industrial sites.'),
    diagramTitle: t('Du réseau au tableau', 'From the grid to the board'),
    diagramText: t('Un schéma unifilaire simplifié : chaque famille d’équipements que nous fournissons y trouve sa place.', 'A simplified single-line diagram: each equipment family we supply has its place on it.'),
    diagramLabels: {
      grid: t('Réseau HTA', 'MV grid'),
      cell: t('Cellule HTA', 'MV switchgear'),
      trafo: t('Transformateur', 'Transformer'),
      cable: t('Câbles', 'Cables'),
      board: t('Tableau BT', 'LV board'),
      out: t('Départs', 'Feeders'),
    },
    modelTitle: t('Notre modèle', 'How we work'),
    model: [
      t('Nous sélectionnons les fabricants et les gammes adaptés à chaque besoin.', 'We select the manufacturers and ranges that fit each need.'),
      t('Nous assurons l’approvisionnement, de la commande à la livraison.', 'We handle supply, from order to delivery.'),
      t('Nous accompagnons les projets d’infrastructure électrique avec nos partenaires techniques.', 'We support electrical infrastructure projects with our technical partners.'),
    ],
  },
  travel: {
    title: t('Voyages d’affaires et tourisme', 'Business travel and tourism'),
    description: t('Billetterie aérienne, réservations d’hôtels, voyages d’affaires, tourisme et assistance, déplacements pour salons et événements professionnels.', 'Airline ticketing, hotel bookings, business travel, tourism and assistance, travel to trade fairs and business events.'),
    boardTitle: t('Le tableau des départs', 'The departures board'),
    boardText: t('Quelques destinations parmi celles que nous organisons. Chaque ligne est un service que nous prenons en charge.', 'A few of the destinations we arrange. Each line is a service we handle.'),
    boardRows: [
      { code: 'CDG', city: t('Paris', 'Paris'), service: t('Billet + hôtel', 'Ticket + hotel') },
      { code: 'IST', city: t('Istanbul', 'Istanbul'), service: t('Mission d’affaires', 'Business mission') },
      { code: 'DXB', city: t('Dubaï', 'Dubai'), service: t('Salon professionnel', 'Trade fair') },
      { code: 'CMN', city: t('Casablanca', 'Casablanca'), service: t('Forum d’investissement', 'Investment forum') },
      { code: 'TUN', city: t('Tunis', 'Tunis'), service: t('Salon agricole', 'Agricultural fair') },
    ],
    from: t('Départ Abidjan', 'From Abidjan'),
    stepsTitle: t('Du départ au retour', 'From departure to return'),
    steps: [
      { t: t('Votre demande', 'Your request'), d: t('Dates, destination, objectif du voyage, budget.', 'Dates, destination, purpose, budget.') },
      { t: t('Notre proposition', 'Our proposal'), d: t('Vols, hôtel et programme, en une seule offre.', 'Flights, hotel and schedule in one offer.') },
      { t: t('Réservation', 'Booking'), d: t('Émission des billets et confirmation des séjours.', 'Tickets issued and stays confirmed.') },
      { t: t('Assistance', 'Assistance'), d: t('Un contact joignable pendant tout le voyage.', 'A contact you can reach throughout the trip.') },
    ],
  },
  common: {
    offersTitle: t('Ce que nous proposons', 'What we offer'),
    audiencesTitle: t('Pour qui', 'Who it is for'),
    cta: t('Parlons de votre projet', 'Tell us about your project'),
  },
};

// ---------- Projects ----------
export const projects = {
  title: t('Projets', 'Projects'),
  description: t('Le projet d’usine de transformation de cajou de Zuénoula et les opportunités ouvertes dans l’énergie et le voyage d’affaires.', 'The Zuénoula cashew processing plant project and open opportunities in energy and business travel.'),
  h1: t('Nos projets', 'Our projects'),
  intro: t('Le Groupe concentre d’abord ses moyens sur un projet industriel : transformer la noix de cajou en Côte d’Ivoire.', 'The Group first focuses its resources on one industrial project: processing cashew nuts in Côte d’Ivoire.'),
  status: t('En développement', 'In development'),
  zTitle: t('Usine de transformation de cajou, Zuénoula', 'Cashew processing plant, Zuénoula'),
  zText: t('Zuénoula se trouve dans la région de la Marahoué, au centre-ouest du pays, dans une zone de production de noix de cajou. L’usine y transformera la noix brute en amandes calibrées destinées à l’export.', 'Zuénoula lies in the Marahoué region, in central-western Côte d’Ivoire, in a cashew-growing area. The plant will turn raw nuts into graded kernels for export.'),
  zScope: [
    t('Réception et stockage de la noix brute', 'Raw nut intake and storage'),
    t('Lignes de cuisson, décorticage et dépelliculage', 'Cooking, shelling and peeling lines'),
    t('Tri, calibrage W180 à W450 et contrôle qualité', 'Sorting, W180 to W450 grading and quality control'),
    t('Conditionnement export et traçabilité par lot', 'Export packing and lot traceability'),
  ],
  zOpen: t('Le projet est ouvert aux investisseurs, partenaires industriels, fournisseurs d’équipements et futurs acheteurs.', 'The project is open to investors, industrial partners, equipment suppliers and future buyers.'),
  nextTitle: t('Opportunités ouvertes', 'Open opportunities'),
  next: [
    { key: 'energy' as const, text: t('Fourniture d’équipements HTA et BT pour des projets de réseaux et de sites industriels.', 'MV and LV equipment supply for network and industrial site projects.') },
    { key: 'travel' as const, text: t('Organisation de délégations vers les salons et forums internationaux.', 'Delegations to international trade fairs and forums.') },
  ],
};

// ---------- Contact ----------
export const contact = {
  title: t('Partenariats et contact', 'Partnerships and contact'),
  description: t('Investisseurs, acheteurs, fabricants, voyageurs : écrivez à ONYX PLUS GROUP pour un partenariat, une demande d’amandes, d’équipements ou de voyage.', 'Investors, buyers, manufacturers, travellers: write to ONYX PLUS GROUP about a partnership, kernels, equipment or travel.'),
  h1: t('Parlons de votre projet', 'Tell us about your project'),
  intro: t('Dites-nous qui vous êtes et ce que vous cherchez. La bonne division vous répond.', 'Tell us who you are and what you are looking for. The right division will reply.'),
  form: {
    name: t('Nom et prénom', 'Full name'),
    company: t('Société', 'Company'),
    email: t('E-mail', 'Email'),
    subject: t('Votre demande concerne', 'Your request is about'),
    subjects: [t('Agro-industrie (amandes de cajou)', 'Agro-industry (cashew kernels)'), t('Énergie et infrastructures', 'Energy and infrastructure'), t('Voyages et tourisme', 'Travel and tourism'), t('Investissement et partenariat', 'Investment and partnership'), t('Autre', 'Other')],
    message: t('Message', 'Message'),
    send: t('Préparer l’e-mail', 'Prepare the email'),
    note: t('Le bouton ouvre votre messagerie avec votre message prêt à envoyer.', 'The button opens your email app with your message ready to send.'),
    required: t('Champ requis', 'Required field'),
    invalidEmail: t('Adresse e-mail invalide', 'Invalid email address'),
    ok: t('Votre messagerie s’ouvre. Si rien ne se passe, écrivez-nous à', 'Your email app is opening. If nothing happens, write to us at'),
  },
  details: {
    title: t('Coordonnées', 'Details'),
    email: t('E-mail', 'Email'),
    phone: t('Téléphone', 'Phone'),
    phoneValue: t('Communiqué sur demande', 'Available on request'),
    address: t('Siège', 'Head office'),
    addressValue: t('Côte d’Ivoire', 'Côte d’Ivoire'),
  },
};

export const notFound = {
  title: t('Page introuvable', 'Page not found'),
  h1: t('Coque vide', 'Empty shell'),
  text: t('Cette page n’existe pas, ou plus. L’amande est ailleurs :', 'This page does not exist, or no longer does. The kernel is elsewhere:'),
};
