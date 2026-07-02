export type Project = {
  slug: string;
  name: string;
  category: "Full-Stack" | "AI/ML" | "Cybersecurity" | "Automation";
  status?: string;
  flagship?: boolean;
  summary: string;
  problem?: string;
  solution?: string;
  tags: string[];
  links: {
    live?: string;
    github?: string;
    report?: string;
    details?: string;
  };
};

export const projects: Project[] = [
  {
    slug: "smart-hr-portal",
    name: "Smart HR Portal with Predictive Analysis",
    category: "Full-Stack",
    status: "In Progress — Almost Complete",
    flagship: true,
    summary:
      "HR management system with predictive analytics for workforce planning and employee retention.",
    problem:
      "HR teams juggle disconnected tools for attendance, leave, hiring and analytics — with no forward-looking signal on attrition or performance risk.",
    solution:
      "A collaborative, data-driven HR platform that combines standard HR workflows with predictive models for attrition, performance trends and recruitment needs.",
    tags: [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "Clerk Auth",
      "Framer Motion",
      "Machine Learning",
      "Predictive Analysis",
      "HRMS",
    ],
    links: {
      live: "https://smart-hr-protal.vercel.app/portal/auth",
      github: "https://github.com/Team-Innovatrix/Smart-HR-protal",
      report: "/assets/Hr_Portal.pdf",
      details: "/smart-hr-portal",
    },
  },
  {
    slug: "resume-ai",
    name: "Resume AI Analyzer",
    category: "Full-Stack",
    summary:
      "Parses, analyzes and grades resumes against job roles using AI/NLP and TF-IDF cosine similarity.",
    problem:
      "Candidates rarely know how well their resume matches a target role or which sections to sharpen.",
    solution:
      "A React + Flask app that extracts resume content, scores it against a job description with TF-IDF cosine similarity and highlights gaps.",
    tags: ["React", "Python", "Flask", "NLP", "TF-IDF"],
    links: {
      live: "https://mohit-resume-ai.netlify.app/",
      github: "https://github.com/mohitmjm/Resume-AI",
      report: "/assets/Resume-AI.pdf",
    },
  },
  {
    slug: "diabetes-prediction",
    name: "Diabetes Prediction App",
    category: "AI/ML",
    summary:
      "Streamlit ML app predicting diabetes risk from health metrics (glucose, BMI, age) with Scikit-Learn.",
    problem:
      "Early risk indicators for diabetes get buried in unstructured health data.",
    solution:
      "A lightweight Scikit-Learn classifier surfaced through a Streamlit UI for instant risk scoring on real health inputs.",
    tags: ["Python", "Scikit-Learn", "Streamlit", "ML"],
    links: {
      live: "https://diabetesappapp-ac8kqdm6bbm77gwikmt2kv.streamlit.app/",
      github: "https://github.com/mohitmjm/diabetes_streamlit_app",
    },
  },
  {
    slug: "drowsiness-detector",
    name: "Drowsiness Detector",
    category: "AI/ML",
    summary:
      "Real-time drowsiness detection using Eye Aspect Ratio with MediaPipe, OpenCV and Streamlit.",
    problem:
      "Drowsy driving and long screen sessions cause micro-sleep incidents that are hard to catch in real time.",
    solution:
      "Computes Eye Aspect Ratio on webcam frames with MediaPipe + OpenCV, triggering warnings when eye closure crosses a threshold.",
    tags: ["Python", "MediaPipe", "OpenCV", "Streamlit", "Computer Vision"],
    links: {
      github: "https://github.com/mohitmjm/drowsiness_Detector",
      report: "/assets/Drowsiness_Detection_Report.pdf",
    },
  },
];
