<div align="center">

# ✦ Mohit Mohatkar

### B.Tech CSE (AI & ML) · Full Stack Developer · ML Enthusiast

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Portfolio-Visit_Now-3b82f6?style=for-the-badge&labelColor=0d1117)](https://mohit-portfolio.netlify.app)
&nbsp;
[![GitHub](https://img.shields.io/badge/GitHub-mohitmjm-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mohitmjm)
&nbsp;
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mohit-mohatkar)
&nbsp;
[![Email](https://img.shields.io/badge/Email-Say_Hello-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:mohitjmohatkar@gmail.com)

<br/>

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat-square&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?style=flat-square&logo=framer&logoColor=white)
![Netlify](https://img.shields.io/badge/Deployed_on-Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

<br/>

> *A high-performance, interactive personal portfolio — crafted with pixel-perfect precision, smooth animations, and a fully responsive dark/light design system.*

</div>

<br/>

---

## 🖥️ Preview

<div align="center">

| Dark Mode | Light Mode |
|:---------:|:----------:|
| [![Dark Mode](https://img.shields.io/badge/Dark_Mode-Preview-1e293b?style=for-the-badge&logo=moon&logoColor=white)](#) | [![Light Mode](https://img.shields.io/badge/Light_Mode-Preview-f8fafc?style=for-the-badge&logo=sun&logoColor=black)](#) |

🔗 **[→ View Live Portfolio](https://mohit-portfolio.netlify.app)**

</div>

<br/>

---

## ⚡ Features at a Glance

<table>
  <tr>
    <td>🌗 <b>Dark / Light Theme</b></td>
    <td>Persistent system-aware theme toggle with silky CSS transitions</td>
  </tr>
  <tr>
    <td>🖱️ <b>Custom Cursor</b></td>
    <td>Dual-layer magnetic cursor — dot + trailing ring with hover expansion</td>
  </tr>
  <tr>
    <td>🌌 <b>Interactive Particle Canvas</b></td>
    <td>Mouse-reactive floating particle network rendered on HTML Canvas</td>
  </tr>
  <tr>
    <td>🔤 <b>Typewriter Effect</b></td>
    <td>Cycling role titles with realistic character-by-character typing & deletion</td>
  </tr>
  <tr>
    <td>🧲 <b>Magnetic Buttons</b></td>
    <td>CTA buttons that physically pull toward the cursor position</td>
  </tr>
  <tr>
    <td>🃏 <b>3D Photo Tilt</b></td>
    <td>Profile image with real-time perspective tilt driven by mouse parallax</td>
  </tr>
  <tr>
    <td>📊 <b>Scroll Progress Bar</b></td>
    <td>Fixed glowing progress bar tracking reading depth</td>
  </tr>
  <tr>
    <td>🎬 <b>Page Load Splash</b></td>
    <td>Branded loading overlay with animated progress bar on first paint</td>
  </tr>
  <tr>
    <td>🎞️ <b>Framer Motion</b></td>
    <td>Staggered entrance animations on every section scroll into view</td>
  </tr>
  <tr>
    <td>📬 <b>Contact Form</b></td>
    <td>Fully validated form powered by <code>react-hook-form</code></td>
  </tr>
  <tr>
    <td>📱 <b>Fully Responsive</b></td>
    <td>Pixel-perfect on every screen — mobile, tablet, desktop, 4K</td>
  </tr>
</table>

<br/>

---

## 🗂️ Page Sections

```
Hero          →  Animated name, typewriter roles, 3D photo, particle bg, social links
About         →  Personal intro & background summary
Skills        →  Filterable skill cards  [All | Frontend | Backend | AI/ML | Tools]
Education     →  Academic timeline + certifications
Experience    →  Internship & work experience cards
Projects      →  Featured project cards with modals, GitHub, demos & reports
Contact       →  Validated contact form
Footer        →  Quick links & social icons
```

<br/>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **UI Framework** | React 18 |
| **Build Tool** | Vite 5 |
| **Animations** | Framer Motion 11 |
| **Styling** | Vanilla CSS · CSS Custom Properties |
| **Icons** | react-icons (Feather set) |
| **Forms** | react-hook-form |
| **Deployment** | Netlify (auto-deploy from `main`) |

</div>

<br/>

---

## 📁 Project Structure

```
portfolio/
│
├── public/
│   └── assets/                  ← Resume PDF, project reports, logos, profile photo
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           ← Responsive nav with active section tracking
│   │   ├── Hero.jsx             ← Particle canvas · typewriter · 3D tilt · magnetic buttons
│   │   ├── About.jsx
│   │   ├── Skills.jsx           ← Category-filter tab system
│   │   ├── Education.jsx        ← Timeline layout
│   │   ├── Experience.jsx
│   │   ├── Projects.jsx         ← Cards + detail modal
│   │   ├── Contact.jsx          ← react-hook-form
│   │   ├── Footer.jsx
│   │   └── LogoMM.jsx
│   │
│   ├── data/                    ← ✏️ Edit your content here
│   │   ├── projects.js
│   │   ├── skills.js
│   │   ├── education.js
│   │   └── experience.js
│   │
│   ├── hooks/
│   │   └── useTheme.js          ← Theme toggle & localStorage persistence
│   │
│   ├── styles/
│   │   └── globals.css          ← Design tokens · animations · global styles
│   │
│   ├── App.jsx                  ← Root: custom cursor · scroll bar · layout shell
│   └── main.jsx
│
├── index.html
├── vite.config.js
└── netlify.toml
```

<br/>

---

## 🎨 Personalising the Portfolio

> All **content** lives in `src/data/` — just edit the JS files, no component code needed.

| File | Purpose |
|------|---------|
| `src/data/projects.js` | Add / edit projects, links, tags, and descriptions |
| `src/data/skills.js` | Manage skills, categories, and proficiency levels |
| `src/data/education.js` | Update academic history and certifications |
| `src/data/experience.js` | Add internships or work experience |
| `public/assets/` | Swap profile photo, resume PDF, and institution logos |
| `src/styles/globals.css` | Tweak the full design system — colours, fonts, spacing |

<br/>

---

## 📦 Projects

<details>
<summary><b>👥 Smart HR Portal with Predictive Analysis</b> &nbsp;—&nbsp; <code>Full-Stack</code> &nbsp;<i>(In Progress)</i></summary>
<br/>

A collaborative HR management platform integrating predictive ML models for attrition forecasting, performance trend analysis, and data-driven workforce planning.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Clerk Auth · Framer Motion · Machine Learning

[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?style=flat-square&logo=github)](https://github.com/Team-Innovatrix/Smart-HR-protal)

</details>

<details>
<summary><b>📄 Resume AI Analyzer</b> &nbsp;—&nbsp; <code>Full-Stack</code></summary>
<br/>

Parses uploaded resumes and scores them against specific job roles using TF-IDF cosine similarity, delivering intelligent match feedback and actionable improvements.

**Stack:** React · Python · Flask · NLP · Scikit-Learn

[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?style=flat-square&logo=github)](https://github.com/mohitmjm/Resume-AI)
&nbsp;
[![Live Demo](https://img.shields.io/badge/Live-Demo-3b82f6?style=flat-square&logo=netlify&logoColor=white)](https://mohit-resume-ai.netlify.app/)

</details>

<details>
<summary><b>🩺 Diabetes Prediction App</b> &nbsp;—&nbsp; <code>AI/ML</code></summary>
<br/>

Interactive Streamlit dashboard for real-time diabetes risk prediction. Users adjust health parameters (glucose, BMI, age, etc.) and get instant diagnostic insights from a trained classification model.

**Stack:** Python · Streamlit · Scikit-Learn · Machine Learning

[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?style=flat-square&logo=github)](https://github.com/mohitmjm/diabetes_streamlit_app)
&nbsp;
[![Live Demo](https://img.shields.io/badge/Live-Demo-3b82f6?style=flat-square&logo=streamlit&logoColor=white)](https://diabetesappapp-ac8kqdm6bbm77gwikmt2kv.streamlit.app/)

</details>

<details>
<summary><b>👁️ Drowsiness Detector</b> &nbsp;—&nbsp; <code>Computer Vision</code></summary>
<br/>

Real-time drowsiness detection via Eye Aspect Ratio (EAR) using MediaPipe FaceMesh. No heavy dependencies like dlib — runs lightweight in a Streamlit interface.

**Stack:** Python · MediaPipe · OpenCV · Streamlit

[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?style=flat-square&logo=github)](https://github.com/mohitmjm/drowsiness_Detector)

</details>

<br/>

---

## 🌐 Deployment

Deployed on **Netlify** with continuous delivery from the `main` branch. The SPA redirect rule below ensures client-side routing works correctly without 404s:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from   = "/*"
  to     = "/index.html"
  status = 200
```

<br/>

---

## 📬 Get In Touch

<div align="center">

| | |
|--|--|
| 📧 **Email** | [mohitjmohatkar@gmail.com](mailto:mohitjmohatkar@gmail.com) |
| 💼 **LinkedIn** | [linkedin.com/in/mohit-mohatkar](https://www.linkedin.com/in/mohit-mohatkar) |
| 🐙 **GitHub** | [github.com/mohitmjm](https://github.com/mohitmjm) |
| 📸 **Instagram** | [instagram.com/mohitmohatkar](https://www.instagram.com/mohitmohatkar/) |

<br/>

**Open to opportunities** — internships, freelance projects, and full-time roles.

</div>

<br/>

---

<div align="center">

Designed & built with ❤️ by **Mohit Mohatkar**

*B.Tech CSE (AI & ML) · RCOEM, Nagpur*

</div>
