import { openDB, IDBPDatabase } from "idb";
import {
  MasterProfile,
  JobDescription,
  CoverLetter,
  AppSettings,
  AtsMatchMetric,
} from "../types";

const DB_NAME = "privacy_resume_builder_db";
const DB_VERSION = 1;

export const DEFAULT_PROFILE: MasterProfile = {
  id: "master-profile-default",
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: "Alex Morgan",
    headline: "Principal Software Engineer & Cloud Systems Architect",
    email: "alex.morgan.dev@proton.me",
    phone: "+1 (415) 890-2419",
    location: "San Francisco, CA (Open to Remote)",
    website: "https://alexmorgan.engineering",
    linkedin: "linkedin.com/in/alex-morgan-tech",
    github: "github.com/alexm-arch",
    summary:
      "Distinguished Systems Architect with 11+ years leading high-throughput distributed architectures, zero-trust cloud migrations, and low-latency streaming infrastructure. Proven history driving engineering org efficiency, mentoring 35+ engineers, and delivering $4.2M in annual cloud infrastructure cost reductions.",
  },
  experiences: [
    {
      id: "exp-1",
      company: "OmniCloud Technologies",
      position: "Principal Staff Engineer",
      location: "San Francisco, CA",
      startDate: "2022-04",
      endDate: "Present",
      current: true,
      highlights: [
        "Architected real-time event streaming pipeline processing 4.8B events/day with 99.999% availability using Go, Kafka, and Kubernetes.",
        "Spearheaded multi-region active-active database failover strategy, reducing p99 API latency by 42% and preventing estimated $1.8M outage liabilities.",
        "Championed engineering standards across 8 cross-functional squads, driving automated static analysis and zero-regression CI/CD release cadence.",
      ],
    },
    {
      id: "exp-2",
      company: "Vanguard Data Systems",
      position: "Staff Infrastructure Architect",
      location: "New York, NY",
      startDate: "2018-08",
      endDate: "2022-03",
      current: false,
      highlights: [
        "Designed secure client-side cryptographic key store and data sovereignty engine compliant with HIPAA and SOC 2 Type II controls.",
        "Migrated 240 microservices from legacy virtual machines to containerized Kubernetes clusters, cutting compute costs by 37% ($2.4M annually).",
        "Implemented distributed telemetry mesh utilizing OpenTelemetry, Prometheus, and Grafana, reducing MTTR from 58 minutes to under 6 minutes.",
      ],
    },
    {
      id: "exp-3",
      company: "Aura Software Labs",
      position: "Senior Full Stack Systems Engineer",
      location: "Seattle, WA",
      startDate: "2015-06",
      endDate: "2018-07",
      current: false,
      highlights: [
        "Led redesign of core customer billing portal using React, TypeScript, and Node.js, boosting checkout conversion by 18.5%.",
        "Built automated rate-limiting and DDoS mitigation proxy handling 85,000 requests/sec with Redis cluster backend.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Washington",
      degree: "Master of Science (M.S.)",
      fieldOfStudy: "Computer Science & Distributed Systems",
      startDate: "2013-09",
      endDate: "2015-05",
      gpaOrHonors: "Summa Cum Laude (3.94 GPA)",
      highlights: [
        "Thesis on Consensus Protocols in Partition-Tolerant Distributed Networks",
      ],
    },
    {
      id: "edu-2",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science (B.S.)",
      fieldOfStudy: "Electrical Engineering & Computer Sciences (EECS)",
      startDate: "2009-09",
      endDate: "2013-05",
      gpaOrHonors: "Dean's Honors List",
    },
  ],
  skillCategories: [
    {
      id: "cat-1",
      categoryName: "Core Languages & Runtimes",
      skills: ["TypeScript", "Go", "Rust", "Python", "Node.js", "SQL"],
    },
    {
      id: "cat-2",
      categoryName: "Distributed Systems & Cloud",
      skills: [
        "Kubernetes",
        "Docker",
        "AWS",
        "GCP",
        "Kafka",
        "Terraform",
        "Redis",
        "PostgreSQL",
      ],
    },
    {
      id: "cat-3",
      categoryName: "Frontend & Web Technologies",
      skills: [
        "React 19",
        "Next.js",
        "Tailwind CSS",
        "Vite",
        "WebMCP",
        "IndexedDB",
        "HTML5/CSS3",
      ],
    },
    {
      id: "cat-4",
      categoryName: "Architecture & Leadership",
      skills: [
        "System Design",
        "Microservices",
        "Zero-Trust Security",
        "CI/CD Pipelines",
        "Engineering Management",
        "Mentorship",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "KubeMesh Gateway",
      role: "Creator & Maintainer",
      technologies: ["Go", "eBPF", "Envoy", "gRPC"],
      link: "https://github.com/alexm-arch/kubemesh",
      summary:
        "High-performance lightweight ingress controller with dynamic canary traffic steering.",
      bullets: [
        "Adopted by 140+ enterprise staging clusters; achieved 35% lower memory footprint than standard ingress solutions.",
      ],
    },
    {
      id: "proj-2",
      title: "LocalVault Security Engine",
      role: "Core Contributor",
      technologies: ["TypeScript", "WebCrypto", "IndexedDB"],
      link: "https://github.com/alexm-arch/localvault",
      summary:
        "Zero-knowledge browser key management library leveraging hardware WebAuthn and WebCrypto.",
      bullets: [
        "Starred by 2,800+ developers; audited with zero critical vulnerabilities.",
      ],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect - Professional",
      issuer: "Amazon Web Services",
      date: "2023 - 2026",
      credentialUrl: "aws.amazon.com/verify",
    },
    {
      id: "cert-2",
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation (CNCF)",
      date: "2022 - 2025",
    },
  ],
};

export const DEFAULT_SETTINGS: AppSettings = {
  selectedTemplate: "modern",
  paperSize: "a4",
  fontSize: "base",
  pageMargin: "normal",
  themeMode: "light",
  showPageNumbers: false,
  requireCoverLetter: false,
  aiConfig: {
    provider: "local_heuristic",
    model: "built-in-nlp",
  },
};

export const DEFAULT_JOB_DESCRIPTION: JobDescription = {
  id: "jd-sample",
  title: "Staff / Principal Distributed Systems Engineer",
  company: "CloudScale Infrastructure",
  rawText: `About the Role:
CloudScale Infrastructure is seeking a Principal Distributed Systems Engineer to lead our Core Networking and Edge Platform. You will architect global multi-region streaming pipelines, mentor senior staff, and partner with product executives to scale services handling millions of concurrent connections.

Key Responsibilities:
- Design fault-tolerant distributed services using Go, Kubernetes, Kafka, and PostgreSQL.
- Drive zero-trust cloud migration and edge caching strategy.
- Improve system observability, reducing p99 latency and incident MTTR.
- Establish automated CI/CD deployment pipelines with locked dependencies and zero-downtime rollouts.

Required Qualifications:
- 8+ years experience in distributed systems, high-concurrency systems, and cloud infrastructure (AWS or GCP).
- Deep mastery of Go or Rust, Kubernetes orchestration, Kafka, and containerized architectures.
- Demonstrated track record of system design, performance profiling, and reducing cloud operational costs.
- Excellent communication and cross-functional leadership skills.`,
  parsedKeywords: [
    "Distributed Systems",
    "Go",
    "Kubernetes",
    "Kafka",
    "PostgreSQL",
    "Zero-Trust",
    "CI/CD",
    "AWS",
    "GCP",
    "High-concurrency",
    "Observability",
    "System Design",
  ],
  createdAt: new Date().toISOString(),
};

export const DEFAULT_COVER_LETTER: CoverLetter = {
  id: "cl-default",
  jobTitle: "Principal Distributed Systems Engineer",
  company: "CloudScale Infrastructure",
  recipientName: "Hiring Committee",
  recipientTitle: "CloudScale Engineering Leadership",
  salutation: "Dear Hiring Committee,",
  bodyParagraphs: [
    "I am writing to express my enthusiasm for the Principal Distributed Systems Engineer role at CloudScale Infrastructure. With over 11 years architecting high-throughput distributed pipelines, zero-trust cloud migrations, and fault-tolerant infrastructure handling billions of daily events, I am confident in my ability to significantly accelerate your Core Platform objectives.",
    "Throughout my tenure as Principal Staff Engineer at OmniCloud Technologies, I spearheaded an event streaming infrastructure utilizing Go, Kafka, and Kubernetes that processed 4.8B events daily with 99.999% availability. Additionally, my multi-region database failover architecture lowered p99 API latencies by 42% while systematically reducing annual cloud compute expenditures by $2.4M.",
    "CloudScale Infrastructure's commitment to high-concurrency edge computing resonates strongly with my experience. I welcome the opportunity to discuss how my hands-on architectural depth, mentoring philosophy, and focus on operational rigor will contribute to CloudScale's continued technical excellence.",
  ],
  signOff: "Sincerely,\nAlex Morgan",
  updatedAt: new Date().toISOString(),
};

// Database Initialization
let dbPromise: Promise<IDBPDatabase> | null = null;

async function getDb(): Promise<IDBPDatabase | null> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return null;
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("profiles")) {
          db.createObjectStore("profiles", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("job_descriptions")) {
          db.createObjectStore("job_descriptions", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("cover_letters")) {
          db.createObjectStore("cover_letters", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings");
        }
      },
    }).catch((err) => {
      console.warn(
        "IndexedDB initialization failed, falling back to localStorage:",
        err,
      );
      return null as any;
    });
  }
  return dbPromise;
}

// Storage API with localStorage Fallbacks
export const LocalStorageService = {
  async getProfile(): Promise<MasterProfile> {
    try {
      const db = await getDb();
      if (db) {
        const stored = await db.get("profiles", "master-profile-default");
        if (stored) return stored;
      }
      const local = localStorage.getItem("resume_master_profile");
      if (local) return JSON.parse(local);
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    return DEFAULT_PROFILE;
  },

  async saveProfile(profile: MasterProfile): Promise<void> {
    try {
      const updated = { ...profile, updatedAt: new Date().toISOString() };
      localStorage.setItem("resume_master_profile", JSON.stringify(updated));
      const db = await getDb();
      if (db) {
        await db.put("profiles", updated);
      }
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  },

  async getJobDescription(): Promise<JobDescription> {
    try {
      const db = await getDb();
      if (db) {
        const stored = await db.get("job_descriptions", "jd-sample");
        if (stored) return stored;
      }
      const local = localStorage.getItem("resume_job_description");
      if (local) return JSON.parse(local);
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    return DEFAULT_JOB_DESCRIPTION;
  },

  async saveJobDescription(jd: JobDescription): Promise<void> {
    try {
      localStorage.setItem("resume_job_description", JSON.stringify(jd));
      const db = await getDb();
      if (db) {
        await db.put("job_descriptions", jd);
      }
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  },

  async getCoverLetter(): Promise<CoverLetter> {
    try {
      const db = await getDb();
      if (db) {
        const stored = await db.get("cover_letters", "cl-default");
        if (stored) return stored;
      }
      const local = localStorage.getItem("resume_cover_letter");
      if (local) return JSON.parse(local);
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    return DEFAULT_COVER_LETTER;
  },

  async saveCoverLetter(cl: CoverLetter): Promise<void> {
    try {
      const updated = { ...cl, updatedAt: new Date().toISOString() };
      localStorage.setItem("resume_cover_letter", JSON.stringify(updated));
      const db = await getDb();
      if (db) {
        await db.put("cover_letters", updated);
      }
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const db = await getDb();
      if (db) {
        const stored = await db.get("settings", "app_settings");
        if (stored) return stored;
      }
      const local = localStorage.getItem("resume_app_settings");
      if (local) return JSON.parse(local);
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    return DEFAULT_SETTINGS;
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      localStorage.setItem("resume_app_settings", JSON.stringify(settings));
      const db = await getDb();
      if (db) {
        await db.put("settings", settings, "app_settings");
      }
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  },
};
