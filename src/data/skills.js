export const skills = [
  // Frontend
  { id: 1, name: 'React', icon: '⚛️', category: 'Frontend', proficiency: 'Advanced', note: 'Building SPAs & component systems' },
  { id: 2, name: 'Next.js', icon: '▲', category: 'Frontend', proficiency: 'Intermediate', note: 'SSR, App Router, API routes' },
  { id: 3, name: 'JavaScript', icon: '🟨', category: 'Frontend', proficiency: 'Advanced', note: 'ES6+, async/await, DOM manipulation' },
  { id: 4, name: 'HTML & CSS', icon: '🎨', category: 'Frontend', proficiency: 'Advanced', note: 'Semantic HTML, Flexbox, Grid, animations' },

  // Backend
  { id: 5, name: 'Python', icon: '🐍', category: 'Backend', proficiency: 'Advanced', note: 'My primary language — AI, scripting, APIs' },
  { id: 6, name: 'Node.js', icon: '🟢', category: 'Backend', proficiency: 'Intermediate', note: 'REST APIs, Express, middleware' },
  { id: 7, name: 'MongoDB', icon: '🍃', category: 'Backend', proficiency: 'Intermediate', note: 'Atlas, aggregation pipelines, Mongoose' },

  // AI/ML
  { id: 8, name: 'Machine Learning', icon: '🤖', category: 'AI/ML', proficiency: 'Intermediate', note: 'Sklearn, feature engineering, model eval' },
  { id: 9, name: 'TensorFlow', icon: '🔷', category: 'AI/ML', proficiency: 'Beginner', note: 'Deep learning, computer vision basics' },
  { id: 10, name: 'OpenCV', icon: '👁️', category: 'AI/ML', proficiency: 'Intermediate', note: 'Real-time video, image processing' },
  { id: 11, name: 'MediaPipe', icon: '💡', category: 'AI/ML', proficiency: 'Intermediate', note: 'FaceMesh, pose, hands tracking' },

  // Tools
  { id: 12, name: 'Git & GitHub', icon: '🐙', category: 'Tools', proficiency: 'Advanced', note: 'Version control, collaboration, CI/CD' },
  { id: 13, name: 'Vercel', icon: '▲', category: 'Tools', proficiency: 'Intermediate', note: 'Deployment, serverless, edge functions' },
  { id: 14, name: 'Streamlit', icon: '🎈', category: 'Tools', proficiency: 'Intermediate', note: 'Rapid ML app prototyping & demos' },
];

export const skillCategories = ['All', 'Frontend', 'Backend', 'AI/ML', 'Tools'];
