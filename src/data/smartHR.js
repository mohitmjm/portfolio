export const smartHRData = [
  {
    "title": "Employee Portal — Navigation Sidebar",
    "description": "Shows all tabs available to employees in the Smart HR Portal. Employees can navigate to Dashboard, Attendance, Leave, Profile, Chat, HR Documents, and the AI Chatbot from this sidebar.",
    "features": [
      "Collapsible sidebar with icon + label navigation",
      "Active tab highlighted for easy orientation",
      "Role-based: only employee-relevant tabs are shown",
      "Responsive — collapses to icon-only on smaller screens"
    ],
    "technology": "Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide React (icons), Framer Motion (collapse animation), Clerk (role-based rendering)",
    "image": "/assets/smart-hr/tab_1.png"
  },
  {
    "title": "Admin Portal — Navigation Sidebar",
    "description": "Shows all tabs available to HR Admins. The admin sidebar provides access to the full suite of management tools — employee management, attendance, leave approvals, vacancy, AI analytics, holiday trends, mood intelligence, priority messages, and more.",
    "features": [
      "Separate sidebar with expanded admin-only tabs",
      "Visual divider separating employee vs. admin sections",
      "Admin badge/indicator on the user avatar",
      "Quick-access shortcuts to frequently used admin tools"
    ],
    "technology": "Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide React, Framer Motion, Clerk (admin role check)",
    "image": "/assets/smart-hr/tab_2.png"
  },
  {
    "title": "Tab 1 — Login Page",
    "description": "The entry point of the Smart HR Portal. Employees and admins authenticate here before gaining access to the system. The login page supports email/password login and social OAuth providers via Clerk.",
    "features": [
      "Email + password authentication with validation",
      "Google / GitHub OAuth social login support",
      "Forgot password / reset password flow",
      "Redirects to role-specific portal (employee or admin) after login",
      "Secure session handling with JWT tokens"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Clerk Authentication (JWT, OAuth, session management), Framer Motion (page transitions)",
    "image": "/assets/smart-hr/tab_3.png"
  },
  {
    "title": "Tab 2 — Main Employee Dashboard",
    "description": "The primary home screen for employees after login. Displays a personalized overview of the employee's current work status with key metrics, upcoming events, and HR announcements — everything important visible at a glance.",
    "features": [
      "Personalized welcome with employee name and today's date",
      "Attendance summary card (present days, absences, late marks)",
      "Leave balance widget showing remaining leaves by type",
      "Upcoming holidays and company events",
      "Recent HR announcements feed",
      "Quick-action shortcuts (Apply Leave, View Payslip, etc.)"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Recharts (bar/donut charts), Framer Motion, Supabase (real-time data), Clerk (user context)",
    "image": "/assets/smart-hr/tab_4.png"
  },
  {
    "title": "Tab 3 — Scrolled View of Employee Dashboard",
    "description": "The lower/scrolled portion of the Employee Dashboard, revealing additional content below the fold — such as team updates, performance highlights, recent activity logs, and motivational HR metrics.",
    "features": [
      "Monthly attendance trend chart (bar graph)",
      "Recent payslip summary with download link",
      "Team announcements and manager messages",
      "Performance rating snapshot (if a review cycle is active)",
      "Pending tasks or action items requiring employee attention"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Recharts, Framer Motion (scroll-triggered animations), Supabase",
    "image": "/assets/smart-hr/tab_5.png"
  },
  {
    "title": "Tab 4 — Quick Actions & Voice Assistant",
    "description": "A dedicated panel providing employees with quick-action buttons for the most common HR tasks, plus an integrated AI voice assistant for hands-free navigation and query resolution.",
    "features": [
      "One-click quick actions: Apply Leave, Download Payslip, Raise Grievance, Update Profile",
      "AI Voice Assistant powered by Gemini AI — employees can speak naturally to ask HR questions",
      "Voice commands: \"What is my leave balance?\", \"Show my last payslip\", \"Mark my attendance\"",
      "Text fallback chat if microphone is unavailable",
      "Command history showing recent voice interactions"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Google Gemini API (voice/text AI), Web Speech API (voice input), Framer Motion",
    "image": "/assets/smart-hr/tab_6.png"
  },
  {
    "title": "Tab 5 — Attendance Tab (Employee Portal)",
    "description": "Allows employees to view their complete attendance record, check-in/check-out times, and submit correction requests for any discrepancies. A monthly calendar view gives a clear visual of attendance patterns.",
    "features": [
      "Monthly attendance calendar with color-coded status (Present, Absent, Late, Half-day, Holiday)",
      "Daily check-in and check-out timestamps",
      "Attendance percentage for the current month",
      "Late arrival and early departure log",
      "Attendance correction request form for missing/incorrect entries",
      "Download attendance report as PDF/Excel"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, date-fns (date calculations), Recharts (trend charts), Supabase, SheetJS (Excel export)",
    "image": "/assets/smart-hr/tab_7.png"
  },
  {
    "title": "Tab 6 — Leave Balance Management",
    "description": "Employees can view their leave balances across all leave types, apply for new leaves, track pending applications, and see the history of all previous leave requests.",
    "features": [
      "Leave balance cards: Casual Leave, Sick Leave, Earned Leave, Maternity/Paternity Leave",
      "Apply for leave form with date picker, reason, and leave type selector",
      "Application status tracker (Pending / Approved / Rejected)",
      "Leave history table with manager comments",
      "Team leave calendar — see who else is on leave on selected dates",
      "Auto-calculation of working days excluding weekends and holidays"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, date-fns, Supabase, Framer Motion, Email notifications (SendGrid/Nodemailer)",
    "image": "/assets/smart-hr/tab_8.png"
  },
  {
    "title": "Tab 7 — Profile View",
    "description": "Employees can view and update their personal and professional profile details. Profile changes go through HR review before being saved.",
    "features": [
      "Personal info: Name, DOB, gender, contact number, address",
      "Professional info: Employee ID, department, designation, reporting manager, date of joining",
      "Profile photo upload and update",
      "Emergency contact details",
      "Uploaded documents section (ID proof, certificates)",
      "Edit request flow — changes submitted for HR approval"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Clerk (user identity), Supabase (profile data), Cloud Storage (photo/doc uploads), Framer Motion",
    "image": "/assets/smart-hr/tab_9.png"
  },
  {
    "title": "Tab 8 — Employee Chat",
    "description": "A real-time internal messaging system where employees can communicate with HR, managers, or teammates directly within the portal without needing external tools.",
    "features": [
      "Direct messaging between employees and HR/managers",
      "Group channels for department-wide communication",
      "Message read receipts and online status indicators",
      "File and document sharing within chat",
      "Pinned messages for important announcements",
      "Search and filter through message history"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Supabase Realtime (WebSocket-based live chat), Framer Motion, Cloud Storage (file attachments)",
    "image": "/assets/smart-hr/tab_10.png"
  },
  {
    "title": "Tab 9 — HR Documents",
    "description": "A centralized document repository where employees can access all their employment-related documents issued by HR — offer letters, salary certificates, experience letters, policy documents, and more.",
    "features": [
      "Categorized document library (Offer Letters, Payslips, Certificates, Policies)",
      "Download documents as PDF with one click",
      "Document request form — request new certificates from HR",
      "E-acknowledgement for company policy documents",
      "Upload personal documents (ID proof, educational certificates)",
      "Document validity indicators and expiry alerts"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Supabase Storage (cloud document storage), PDF viewer (react-pdf), Framer Motion",
    "image": "/assets/smart-hr/tab_11.png"
  },
  {
    "title": "Tab 10 — Admin Dashboard",
    "description": "The HR admin's command center — a high-level operational overview of the entire organization. Provides real-time metrics and interactive charts for informed decision-making.",
    "features": [
      "Total headcount, active vs. inactive employees",
      "Today's attendance rate with real-time check-in counter",
      "Pending leave approvals requiring action",
      "Open grievance tickets count",
      "Recruitment pipeline status (open positions, pending interviews)",
      "Organization-wide mood/sentiment indicator",
      "Quick links to most-used admin actions"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Recharts (KPI cards, bar/line/donut charts), Supabase, Framer Motion, Clerk (admin role)",
    "image": "/assets/smart-hr/tab_12.png"
  },
  {
    "title": "Tab 11 — Employee Management (Add Admin via Clerk)",
    "description": "The master employee directory with full CRUD operations. Admins can onboard new employees, assign roles (including promoting to admin via Clerk), update records, and manage employment status.",
    "features": [
      "Searchable and filterable employee table (by department, role, status)",
      "Add new employee form with all required fields",
      "Promote employee to admin role — managed via Clerk dashboard integration",
      "Edit employee details: department, designation, reporting manager, salary band",
      "Deactivate / offboard employees with exit workflow",
      "Bulk import employees via CSV upload",
      "Employee detail view with full profile, documents, and activity history"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Clerk (role management & user provisioning), Supabase, SheetJS (CSV import), Framer Motion",
    "image": "/assets/smart-hr/tab_13.png"
  },
  {
    "title": "Tab 12 — Leave Management (Admin)",
    "description": "HR admins review and action all leave applications across the organization. Includes approval workflows, policy configuration, and team availability views.",
    "features": [
      "Incoming leave requests list with employee name, type, dates, reason",
      "Approve / Reject with a comment — triggers email notification to employee",
      "Filter requests by department, leave type, date range, or status",
      "Configure leave policies: entitlements per role, carry-forward rules, encashment",
      "Team calendar view showing concurrent leave requests",
      "Bulk approve for recurring or holiday period requests",
      "Export leave summary report to Excel"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Supabase, date-fns, SendGrid/Nodemailer (email alerts), SheetJS (export), Framer Motion",
    "image": "/assets/smart-hr/tab_14.png"
  },
  {
    "title": "Tab 13 — Attendance Management (Admin)",
    "description": "Admins get a full view of attendance across the organization with tools to manage records, configure shifts, review correction requests, and track real-time check-in status.",
    "features": [
      "Live dashboard: who is currently checked in vs. absent today",
      "Employee-wise attendance records with check-in/check-out times",
      "Review and approve attendance correction requests",
      "Configure shift timings and work-from-home policies",
      "Mark bulk attendance for on-site/off-site events",
      "Late arrival and absenteeism alerts for managers"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Supabase Realtime, date-fns, Recharts, SendGrid (alerts), Framer Motion",
    "image": "/assets/smart-hr/tab_15.png"
  },
  {
    "title": "Tab 13b — Attendance Sheet Management",
    "description": "A detailed monthly attendance grid showing every employee's day-by-day status in a spreadsheet-like format. Designed for payroll processing and compliance reporting.",
    "features": [
      "Full-month attendance matrix: rows = employees, columns = dates",
      "Color-coded cells: Present (green), Absent (red), Half-day (yellow), Holiday (blue), Leave (purple)",
      "Summary row: total present, absent, leaves per employee",
      "Click any cell to view or edit that day's attendance detail",
      "Export complete attendance sheet to Excel or PDF",
      "Filter by department to view team-specific sheets"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, SheetJS (Excel export), jsPDF / Puppeteer (PDF export), Supabase, date-fns",
    "image": "/assets/smart-hr/tab_16.png"
  },
  {
    "title": "Tab 14 — Vacancy / Job Posting Tab",
    "description": "HR admins can create and manage job openings directly from the portal. Each vacancy card tracks the hiring pipeline from posting to offer.",
    "features": [
      "Create new job posting: title, department, location, type (full-time/contract), description",
      "Set application deadline and number of openings",
      "View applicants per vacancy with pipeline stages (Applied → Screened → Interview → Offer → Hired)",
      "Collaborate with hiring managers through internal notes",
      "Close or pause vacancies with one click",
      "Link vacancies to onboarding workflow upon hire"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Supabase, Framer Motion, Email notifications (SendGrid), Google Gemini API (AI resume screening)",
    "image": "/assets/smart-hr/tab_17.png"
  },
  {
    "title": "Tab 15 — AI Analysis of Employees",
    "description": "An AI-powered analytics module that analyzes employee data to surface insights about performance, engagement, and potential flight risks. Helps HR make data-driven decisions.",
    "features": [
      "AI-generated employee performance scores based on attendance, leaves, and feedback",
      "Sentiment analysis of employee chat and grievance data to gauge satisfaction",
      "Top performers and at-risk employee lists with explanations",
      "Department-wise productivity and engagement heatmaps",
      "AI recommendations: who needs recognition, who needs support",
      "Trend analysis: month-over-month engagement changes"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Google Gemini API (analysis & recommendations), Recharts (heatmaps, trend charts), Supabase, LangGraph",
    "image": "/assets/smart-hr/tab_18.png"
  },
  {
    "title": "Tab 16 — AI Prediction of Employee Turnover",
    "description": "Uses machine learning and AI to predict which employees are at risk of leaving the organization. Helps HR proactively intervene to retain key talent.",
    "features": [
      "Turnover risk score for each employee (High / Medium / Low)",
      "Risk factors identified: frequent absences, low appraisal scores, pending grievances, salary gap",
      "AI-generated retention recommendations per at-risk employee",
      "Department-level attrition probability forecast",
      "Historical turnover trends vs. predicted future attrition",
      "Export risk report for leadership review"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Google Gemini API (prediction model), Recharts (risk charts), Supabase, LangGraph (multi-step AI reasoning), Python ML model integration",
    "image": "/assets/smart-hr/tab_19.png"
  },
  {
    "title": "Tab 17 — Yearly Holiday Trend (Month-wise)",
    "description": "A data visualization tab showing how employees take holidays across the full year, broken down month by month. Helps HR understand seasonal leave patterns and plan workforce accordingly.",
    "features": [
      "Bar chart: total leaves taken per month across the organization",
      "Compare multiple years side by side for trend identification",
      "Department-wise breakdown of monthly leave consumption",
      "Peak leave months highlighted with HR planning notes",
      "National holidays vs. employee-applied leaves differentiated",
      "Export yearly holiday trend report to PDF"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Recharts (grouped bar chart, line chart), Supabase, date-fns, jsPDF (export)",
    "image": "/assets/smart-hr/tab_20.png"
  },
  {
    "title": "Tab 18 — Monthly Holiday Trend",
    "description": "A granular view of leave patterns within a specific month — showing day-by-day leave counts, identifying weekends and holidays, and helping admins visualize workforce availability throughout the month.",
    "features": [
      "Day-wise leave count chart for a selected month",
      "Identify days with high absence concentration",
      "Toggle between departments to compare monthly patterns",
      "Overlay national holidays on the leave trend chart",
      "Month picker to navigate between months easily",
      "Helps HR schedule meetings and deadlines around low-attendance days"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Recharts (area/line chart), date-fns, Supabase, Framer Motion",
    "image": "/assets/smart-hr/tab_21.png"
  },
  {
    "title": "Tab 18b — Reason Why Employee is Likely to Take Holiday",
    "description": "An AI-driven insight tab that analyzes employee leave patterns and historical data to predict and explain the most likely reasons behind leave-taking behavior.",
    "features": [
      "AI-generated reasons: festivals, burnout signals, recurring medical leaves, personal events",
      "Employee-wise leave reason categorization",
      "Sentiment-based analysis: is leave voluntary or stress-driven?",
      "Seasonal leave reason trends (e.g., festival season, exam periods)",
      "Recommendations for HR: plan events or wellness programs during high-leave periods",
      "Natural language explanation per employee for easy HR understanding"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Google Gemini API (NLP + reason generation), Recharts, Supabase, LangGraph",
    "image": "/assets/smart-hr/tab_22.png"
  },
  {
    "title": "Tab 19 — Risk & Mood Intelligence",
    "description": "An advanced AI intelligence tab combining employee mood tracking with organizational risk assessment. Gives HR a real-time pulse of employee wellbeing and potential risk areas.",
    "features": [
      "Organization-wide mood score (aggregated from surveys, chat sentiment, grievances)",
      "Risk indicators: high absenteeism, low engagement scores, unresolved grievances",
      "Department-level mood heatmap",
      "Individual employee mood trends over time",
      "Early warning alerts for employees showing burnout signals",
      "Recommended HR interventions based on AI analysis"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Google Gemini API (mood & risk analysis), Recharts (heatmaps, gauge charts), Supabase, LangGraph, Framer Motion",
    "image": "/assets/smart-hr/tab_23.png"
  },
  {
    "title": "Tab 19 (Scrolled View) — Risk & Mood Intelligence (Detailed)",
    "description": "The scrolled/expanded portion of the Risk & Mood Intelligence tab, showing detailed breakdowns and deeper analytical layers below the initial view.",
    "features": [
      "Detailed risk factor breakdown per department",
      "Timeline of mood score changes over past 6 months",
      "Correlation analysis: attendance vs. mood score",
      "Individual employee risk cards with full profile context",
      "Action log: HR interventions taken and their outcomes"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Google Gemini API, Recharts, Supabase, LangGraph",
    "image": "/assets/smart-hr/tab_24.png"
  },
  {
    "title": "Employee Mood — Mood Tracking View",
    "description": "A dedicated view for tracking and displaying individual employee mood data collected through periodic check-ins and sentiment analysis of workplace interactions.",
    "features": [
      "Employee mood check-in widget (Happy / Neutral / Stressed / Unhappy)",
      "Mood trend line chart over the past 30/90 days per employee",
      "Aggregated team mood distribution (pie chart)",
      "Anonymous mood submissions to encourage honest reporting",
      "Mood alerts: flag employees who report negative mood consistently",
      "Manager view: see team mood without individual identifiers"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Google Gemini API (sentiment classification), Recharts, Supabase, Framer Motion",
    "image": "/assets/smart-hr/tab_25.png"
  },
  {
    "title": "Chatbot — AI Chatbot for Employee Mood Questions",
    "description": "A floating AI-powered chatbot specifically tuned to handle employee mood-related conversations, mental wellness check-ins, and HR support queries. Available 24/7 within the portal.",
    "features": [
      "Conversational mood check-in: \"How are you feeling today?\"",
      "Empathetic responses with follow-up questions for stressed employees",
      "Suggests resources: wellness programs, HR contact, EAP (Employee Assistance Programs)",
      "Logs mood data anonymously for HR analytics",
      "Also handles general HR queries: leave balance, policy info, payslip access",
      "Escalation path: connects employee to HR directly if crisis detected"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Google Gemini API (gemini-2.0-flash), LangGraph (conversation flow), Supabase (conversation logs), Framer Motion (chat animation)",
    "image": "/assets/smart-hr/tab_26.png"
  },
  {
    "title": "Tab 20 — Priority Message Tab",
    "description": "A dedicated messaging tab for high-priority communications between HR, management, and employees. Ensures critical messages are not lost in regular chat noise.",
    "features": [
      "Priority inbox: messages flagged as urgent by HR or management",
      "Read receipts with timestamps — HR can confirm message delivery and viewing",
      "Employee can acknowledge or respond to priority messages",
      "Priority levels: Urgent, Important, For Your Information",
      "Archived priority message history for compliance records",
      "Push notification + email alert triggered on every new priority message"
    ],
    "technology": "Next.js 14, TypeScript, Tailwind CSS, Supabase Realtime (instant delivery), SendGrid/Nodemailer (email alerts), Framer Motion, Web Push Notifications API",
    "image": "/assets/smart-hr/tab_27.png"
  }
];
