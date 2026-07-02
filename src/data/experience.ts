export type EducationItem = {
  institute: string;
  degree: string;
  period: string;
  location: string;
  status: string;
  logo: string;
};

export const education: EducationItem[] = [
  {
    institute: "Shri Ramdeobaba College of Engineering & Management (RCOEM)",
    degree: "B.Tech — Computer Science & Engineering (AI & ML)",
    period: "2024 — 2027",
    location: "Nagpur, Maharashtra",
    status: "Currently Pursuing",
    logo: "/assets/rcoem.jpeg",
  },
  {
    institute: "Shreeram Vidyalaya, Sonegaon",
    degree: "Class XII — Maharashtra State Board",
    period: "2023",
    location: "Kalmeshwar, Maharashtra",
    status: "Completed",
    logo: "/assets/shreeram.jpg",
  },
  {
    institute: "Carmel Academy, Waroda",
    degree: "Class X — CBSE",
    period: "2021",
    location: "Kalmeshwar, Maharashtra",
    status: "Completed",
    logo: "/assets/carmel.png",
  },
];

export const certifications = [
  { name: "Machine Learning — Coursera", note: "Proof updating soon" },
  { name: "Deep Learning Specialization", note: "Proof updating soon" },
  { name: "Full-Stack Web Development Bootcamp", note: "Proof updating soon" },
  { name: "Data Science Fundamentals", note: "Proof updating soon" },
];

export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  type: string;
  summary: string;
};

export const experience: ExperienceItem[] = [
  {
    role: "AI Security Analyst",
    org: "Quinine Cybersecurity Ltd.",
    period: "Apr 2026 — Present",
    type: "Internship",
    summary:
      "Working on AI security research, LLM security awareness and evaluation flows — applying cybersecurity thinking to modern AI systems.",
  },
];
