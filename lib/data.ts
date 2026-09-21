/**
 * Single source of truth for every piece of copy on the site.
 * Edit here — no JSX changes needed.
 */

export const siteConfig = {
  name: "Adam Price",
  tagline: "Forward Deployed Engineer & Full-Stack Developer",
  bio: "I build AI-driven data platforms — shipping large-scale ingestion, graph modeling, and vector search straight into production alongside the people who use them.",
  email: "acprice@uwaterloo.ca",
  location: "Toronto, ON",
  github: "https://github.com/AdamCraigPrice",
  linkedin: "https://www.linkedin.com/in/AdamCraigPrice",
  // Set NEXT_PUBLIC_SITE_URL in Vercel once the domain is live.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://adamprice.vercel.app",
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "resume", label: "Resume" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

export type NavId = (typeof navItems)[number]["id"];

export const about = {
  heading: "About",
  paragraphs: [
    "I'm a Computer Science student at the University of Waterloo specializing in Artificial Intelligence, with a minor in Entrepreneurship. Most of my work sits where machine learning meets real production systems: pipelines that move millions of records, graphs that model messy real-world catalogs, and agents that do something useful on the other end.",
    "As a forward deployed engineer I spend as much time with clients as with code — running discovery workshops, scoping delivery, and then building the thing myself. I like the gap between what a customer says they need and what actually ships, and I like closing it quickly.",
  ],
  education: {
    school: "University of Waterloo",
    degree: "Bachelor of Computer Science — AI Specialization, Entrepreneurship Minor",
    dates: "Sep 2023 – Present",
    location: "Waterloo, ON",
  },
} as const;

export type Resume = {
  label: string;
  description: string;
  file: string;
  primary: boolean;
};

export const resumes: Resume[] = [
  {
    label: "Forward Deployed",
    description: "Client delivery, solutions engineering, and platform work.",
    file: "/resume.pdf",
    primary: true,
  },
  {
    label: "Software Engineering",
    description: "Systems depth, pipelines, and backend engineering.",
    file: "/resume-swe.pdf",
    primary: false,
  },
];

export type Experience = {
  company: string;
  role: string;
  dates: string;
  location: string;
  summary: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    company: "Conscia AI",
    role: "Forward Deployed Solutions Engineer",
    dates: "May 2026 – Present",
    location: "Toronto, ON",
    summary:
      "Sole technical lead delivering Holt Renfrew's product data platform — engineering large-scale ingestion, graph modeling, and vector search over 1M+ SKUs while integrating SAP and Shopify end to end.",
    bullets: [
      "Led end-to-end delivery of Holt Renfrew's product platform (PIM) as the sole technical resource.",
      "Ran discovery workshops across 4 client teams, translating conflicting requirements into a scoped delivery plan.",
      "Authored SoWs, architecture diagrams, and test suites to set scope and expectations with client stakeholders.",
      "Ingested 1M+ SKUs via GraphQL/REST into a directed graph of taxonomies and variants, applying backpressure and checkpointed retries for rate limits, with event-driven transformers propagating updates downstream.",
      "Implemented semantic vector search over 1M+ SKUs, embedding product copy and attributes for merchant lookup.",
      "Integrated SAP and Shopify via webhooks, replacing manual CSV handoffs and cutting 20+ hours per launch cycle.",
      "Cut time-to-publish 90% by automating copywriting, imaging, and AWS Bedrock/SageMaker translation workflows.",
      "Secured a full platform corporate license by pitching the technical solution to Holt Renfrew executives.",
    ],
  },
  {
    company: "Marsh McLennan",
    role: "Software Developer",
    dates: "Sep 2025 – Jan 2026",
    location: "Toronto, ON",
    summary:
      "Built CI-gated database deployment pipelines across 300 databases and a security-focused prompt-injection scanner screening 1,000+ weekly pull requests.",
    bullets: [
      "Architected and shipped a database deployment pipeline across 300 databases with Git-versioned migrations, CI-gated releases, automated rollback, and HashiCorp Vault secret injection, saving 100+ hours weekly.",
      "Created a prompt injection scanner with Mastra AI and GitGuardian, catching 40+ vectors across 1,000+ weekly PRs.",
      "Built a TypeScript email classifier on the OpenAI API, embedding cases into a MongoDB vector store at 95% accuracy.",
      "Ran root cause analysis on platform issues for teams organization-wide, cutting average resolution time by ~2 weeks.",
      "Won an org-wide security tournament among 1,000+ developers by remediating hundreds of exposed credentials.",
    ],
  },
  {
    company: "Sun Life",
    role: "Site Reliability Engineer",
    dates: "Jan 2025 – Apr 2025",
    location: "Toronto, ON",
    summary:
      "Automated ticketing workflows and built an agentic LangGraph assistant while supporting Kubernetes infrastructure for 100+ teams.",
    bullets: [
      "Automated ticket workflows with Jenkins, Python, and Groovy, cutting manual effort on critical tickets by 95%.",
      "Developed an agentic Python assistant with LangGraph for daily tasks, saving each user roughly an hour per week.",
      "Supported Kubernetes clusters and ServiceNow queues for 100+ teams org-wide, holding 99% uptime on applications.",
    ],
  },
  {
    company: "CIBC",
    role: "QA Data Analyst",
    dates: "May 2024 – Aug 2024",
    location: "Toronto, ON",
    summary:
      "Managed and remediated test data for a tier-one banking application, automating QA reporting for the team.",
    bullets: [
      "Managed test data for a tier-one critical banking application, remediating 2,000+ accounts.",
      "Automated QA reporting with VBA, Power Automate, and Power BI dashboards.",
      "Selected as student co-op leader for the cohort.",
    ],
  },
];

export type SkillGroup = {
  category: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    items: [
      "Python",
      "TypeScript/JavaScript",
      "Java",
      "C++",
      "Go",
      "SQL",
      "Groovy",
      "YAML",
      "HTML/CSS",
    ],
  },
  {
    category: "AI & Agents",
    items: [
      "LLM Orchestration",
      "RAG",
      "MCP",
      "Vector Search",
      "PyTorch",
      "LangGraph",
      "Mastra AI",
      "Bedrock",
      "SageMaker",
    ],
  },
  {
    category: "Full Stack",
    items: [
      "React",
      "Next.js",
      "Angular",
      "Node.js",
      "Express",
      "FastAPI",
      "Prisma",
      "REST",
      "GraphQL",
      "Webhooks",
    ],
  },
  {
    category: "Data & Platforms",
    items: [
      "PostgreSQL",
      "Oracle DB",
      "MongoDB",
      "Conscia DX Engine",
      "SAP",
      "Shopify",
      "Power BI",
    ],
  },
  {
    category: "Infra & Cloud",
    items: ["AWS", "Docker", "Kubernetes", "Jenkins", "Git/GitHub", "Vault"],
  },
];

export type ProjectLink = {
  label: "GitHub" | "DevPost";
  href: string;
};

export type Project = {
  name: string;
  blurb: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    name: "RepRight",
    blurb: "AI lifting-form coach",
    description:
      "Scores lifting technique from live video using a MediaPipe and OpenCV biomechanics pipeline at 90%+ precision on joint-angle detection, with LLM-generated coaching served over FastAPI from extracted pose JSON rather than raw video.",
    tags: ["React", "FastAPI", "MongoDB", "OpenCV", "MediaPipe"],
    links: [
      { label: "DevPost", href: "https://devpost.com/software/exersize-form-analyzer" },
    ],
  },
  {
    name: "Cadence",
    blurb: "Shared health tracking PWA",
    description:
      "A private multi-app platform where paired users track health data, shared calendars, and wishlists from one mobile-first PWA, built as a pnpm monorepo with role-scoped auth isolating each user's data.",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Auth.js"],
    links: [{ label: "GitHub", href: "https://github.com/AdamCraigPrice/Cadence" }],
  },
];
