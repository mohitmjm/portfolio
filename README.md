<h1 align="center">Mohit Mohatkar — Portfolio</h1>

<p align="center">
  <strong>Personal developer portfolio built with React + Vite, featuring smooth animations, dark/light theming, and an interactive UI.</strong>
</p>

<p align="center">
  <a href="https://mohit-portfolio.netlify.app" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-3b82f6?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/mohitmjm" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-mohitmjm-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/mohit-mohatkar" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Dark / Light Theme** | Persistent theme toggle with smooth CSS transitions |
| 🖱️ **Custom Cursor** | Dual-layer animated cursor with hover scaling |
| 🌌 **Particle Canvas** | Mouse-reactive floating particle network in the hero |
| 🔤 **Typewriter Effect** | Cycling role titles with realistic typing & deleting animation |
| 🧲 **Magnetic Buttons** | Buttons that physically attract to the cursor |
| 📸 **3D Profile Tilt** | Profile photo with perspective tilt on mouse parallax |
| 📊 **Scroll Progress Bar** | Fixed top bar showing reading progress |
| ⚡ **Page Load Overlay** | Branded splash screen on first load |
| 📱 **Fully Responsive** | Optimised for all screen sizes — mobile to 4K |
| 🎞️ **Framer Motion** | Section-level entrance animations throughout |
| 📬 **Contact Form** | Validated form powered by `react-hook-form` |

---

## 🗂️ Sections

- **Hero** — Animated name reveal, typewriter roles, profile photo with spinning gradient ring, and social links
- **About** — Personal introduction and background
- **Skills** — Filterable skill cards (Frontend · Backend · AI/ML · Tools)
- **Education** — Timeline of academic qualifications and certifications
- **Experience** — Professional/internship experience cards
- **Projects** — Featured project cards with GitHub links, live demos, and report PDFs
- **Contact** — Working contact form with validation
- **Footer** — Quick links and social icons

---

## 🛠️ Tech Stack

### Core
- **React 18** — UI library
- **Vite 5** — Lightning-fast build tool & dev server

### Styling & Animation
- **Vanilla CSS** — Custom design system with CSS variables for theming
- **Framer Motion** — Declarative animations and transitions

### Libraries
- **react-icons** — Icon library (Feather icons throughout)
- **react-hook-form** — Lightweight, performant form validation

### Deployment
- **Netlify** — Continuous deployment from GitHub (`main` branch)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mohitmjm/portfolio-main.git
cd portfolio-main

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Build optimised production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## 📁 Project Structure

```
portfolio-main/
├── public/
│   └── assets/              # Static assets (profile photo, logos, resume PDF, project reports)
├── src/
│   ├── components/          # React UI components
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx         # Particle canvas, typewriter, 3D photo tilt
│   │   ├── About.jsx
│   │   ├── Skills.jsx       # Filterable skill cards
│   │   ├── Education.jsx
│   │   ├── Experience.jsx
│   │   ├── Projects.jsx     # Project modal with full details
│   │   ├── Contact.jsx      # react-hook-form contact form
│   │   ├── Footer.jsx
│   │   └── LogoMM.jsx
│   ├── data/                # Content data files (easy to update)
│   │   ├── projects.js
│   │   ├── skills.js
│   │   ├── education.js
│   │   └── experience.js
│   ├── hooks/
│   │   └── useTheme.js      # Dark/light theme logic & persistence
│   ├── styles/
│   │   └── globals.css      # Design tokens, global styles, animations
│   ├── App.jsx              # Root component — cursor, scroll bar, layout
│   └── main.jsx             # React DOM entry point
├── index.html
├── vite.config.js
├── netlify.toml             # Netlify build + SPA redirect config
└── package.json
```

---

## 🎨 Customisation

All site content lives in **`src/data/`** — no need to touch component code to update your information.

| File | What to edit |
|---|---|
| `src/data/projects.js` | Add / remove projects, update links and tags |
| `src/data/skills.js` | Add / remove skills and proficiency levels |
| `src/data/education.js` | Update education entries and certifications |
| `src/data/experience.js` | Add new work / internship experience |
| `public/assets/` | Replace profile photo, resume PDF, logos |

The design system (colours, fonts, spacing) is fully controlled via CSS variables in `src/styles/globals.css`.

---

## 📦 Featured Projects

### 👥 Smart HR Portal with Predictive Analysis *(In Progress)*
> Full-Stack · Next.js 14 · TypeScript · Clerk Auth · Machine Learning

A collaborative HR management system combining core HR workflows with predictive analytics — attrition forecasting, performance trend analysis, and recruitment insights.  
🔗 [GitHub](https://github.com/Team-Innovatrix/Smart-HR-protal)

---

### 📄 Resume AI Analyzer
> Full-Stack · React · Python · Flask · NLP

Parses and evaluates resumes against job roles using TF-IDF cosine similarity, delivering intelligent match scores and improvement feedback.  
🔗 [GitHub](https://github.com/mohitmjm/Resume-AI) · [Live Demo](https://mohit-resume-ai.netlify.app/)

---

### 🩺 Diabetes Prediction App
> AI/ML · Python · Streamlit · Scikit-Learn

Interactive ML dashboard that predicts diabetes risk from health parameters using a trained classification model.  
🔗 [GitHub](https://github.com/mohitmjm/diabetes_streamlit_app) · [Live Demo](https://diabetesappapp-ac8kqdm6bbm77gwikmt2kv.streamlit.app/)

---

### 👁️ Drowsiness Detector
> AI/ML · Python · MediaPipe · OpenCV · Streamlit

Real-time drowsiness detection via Eye Aspect Ratio (EAR) computation using MediaPipe FaceMesh — no heavy dependencies required.  
🔗 [GitHub](https://github.com/mohitmjm/drowsiness_Detector)

---

## 🌐 Deployment

The site is deployed on **Netlify** with automatic CD from the `main` branch.

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to   = "/index.html"
  status = 200
```

The SPA redirect rule ensures React Router (or manual hash-less navigation) works correctly on Netlify.

---

## 📬 Contact

| Channel | Link |
|---|---|
| 📧 Email | [mohitjmohatkar@gmail.com](mailto:mohitjmohatkar@gmail.com) |
| 💼 LinkedIn | [linkedin.com/in/mohit-mohatkar](https://www.linkedin.com/in/mohit-mohatkar) |
| 🐙 GitHub | [github.com/mohitmjm](https://github.com/mohitmjm) |
| 📸 Instagram | [instagram.com/mohitmohatkar](https://www.instagram.com/mohitmohatkar/) |

---

<p align="center">
  Designed & built by <strong>Mohit Mohatkar</strong> · B.Tech CSE (AI & ML) @ RCOEM, Nagpur
</p>
<p align="center">
  <em>Open to opportunities — internships, freelance, and full-time roles.</em>
</p>
