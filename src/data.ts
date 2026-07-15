export type Project = {
  name: string
  tag: string
  problem: string
  solution: string
  link?: string
  linkLabel?: string
  status?: string
  shot?: string
  tint: string
}

export const PROJECTS: Project[] = [
  {
    name: 'DormView',
    tag: '3D dorm planner',
    problem: "You can't tell if your fridge, futon, and desk setup will actually fit in your dorm until move-in day.",
    solution: 'DormView loads a to-scale 3D model of your exact room so you can arrange, recolor, and save a layout before you buy a thing.',
    link: 'https://dormview.vercel.app',
    shot: '/shots/dormview.jpg',
    tint: '#324444',
  },
  {
    name: 'Forkcast',
    tag: 'dietary restaurant finder',
    problem: 'Finding a restaurant that fits your diet in an unfamiliar city is a scavenger hunt.',
    solution: 'Forkcast filters any city on Earth by vegetarian, vegan, gluten-free, halal, kosher, and more, with real photos, hours, and ratings.',
    link: 'https://eatforkcast.vercel.app',
    shot: '/shots/forkcast.jpg',
    tint: '#3a3244',
  },
  {
    name: 'Overhead',
    tag: 'live satellite tracker',
    problem: "Around twelve thousand satellites are overhead right now and you can't see a single one.",
    solution: 'Overhead maps them live from CelesTrak data, colored by owner, and shows exactly which ones are above your horizon.',
    link: 'https://overhead-satellites.vercel.app',
    shot: '/shots/overhead.jpg',
    tint: '#2b3a4d',
  },
  {
    name: 'FountainCraft',
    tag: '3D fountain builder',
    problem: 'Sketching a fountain on paper tells you nothing about how the water will actually move and look.',
    solution: 'FountainCraft is a drag-and-drop 3D builder with jets, lights, and realistic water physics, all in the browser.',
    status: 'still tweaking',
    tint: '#324444',
  },
  {
    name: 'Read to Me',
    tag: 'Safari extension',
    problem: 'Long articles pile up because reading them means sitting still and staring at a screen.',
    solution: 'Read to Me is a Safari extension that reads any article aloud with natural on-device AI voices. No cloud, no subscription.',
    status: 'still tweaking',
    tint: '#44342e',
  },
  {
    name: 'Drude Model',
    tag: 'physics explainer',
    problem: 'Interactive demos of the key mishaps: how metal interconnects degrade, lose signal, and fail as frequencies push toward 100 GHz.',
    solution: 'A first-principles walkthrough from the Drude model of copper, silver, and gold to real transmission-line loss.',
    link: 'https://kimiyashar.github.io/drudemodel/',
    linkLabel: 'View on GitHub Pages',
    shot: '/shots/drude.jpg',
    tint: '#3d3030',
  },
  {
    name: 'Restraints of 100 GHz',
    tag: 'interactive report',
    problem: 'Moving a 100 GHz signal across a chip is even harder than generating it, and few explanations say why.',
    solution: 'An interactive single-page explainer with live math, charts, and simulations, and how optical interconnects change the game.',
    link: 'https://kimiyashar.github.io/restraints-of-100ghz/',
    linkLabel: 'View on GitHub Pages',
    shot: '/shots/ghz100.jpg',
    tint: '#31404a',
  },
]

export type CommunityItem = {
  name: string
  role: string
  blurb: string
  link?: string
  shot?: string
  tint: string
}

export const COMMUNITY: CommunityItem[] = [
  {
    name: 'Discovery Day',
    role: 'Founder + volunteer',
    blurb:
      'Free, hands-on science labs for Bay Area classrooms that have lost their science funding, so curiosity, not circumstance, decides who falls in love with science.',
    link: 'https://bay-area-discovery-day.vercel.app',
    shot: '/shots/discovery-day.jpg',
    tint: '#2e4436',
  },
  {
    name: 'Community Tables',
    role: 'Founder',
    blurb:
      'Monthly hands-on cooking classes at Sunday Friends, a food distribution and family services center in East San Jose serving 1,000+ members. 300+ families taught so far, in both Spanish and English.',
    link: 'https://community-tables.vercel.app/#mission',
    shot: '/shots/community-tables.jpg',
    tint: '#443a2e',
  },
]

export const NOW = [
  { label: 'Read to Me', detail: 'final tweaks before the App Store' },
  { label: 'DormView', detail: 'expanding to every CMU dorm' },
  { label: 'This site', detail: "you're looking at it right now" },
]

export const CONTACT = {
  email: 'kimi@yasharfamily.com',
  github: 'https://github.com/kimiyashar',
  githubHandle: 'kimiyashar',
  linkedin: 'https://www.linkedin.com/in/kimiyashar/',
}
