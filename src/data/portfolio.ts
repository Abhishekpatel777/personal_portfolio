export type Profile = { name: string; role: string; location: string; resumeUrl: string; email: string; linkedin: string; github: string; photoUrl: string };
export type SkillGroup = { id: string; title: string; description: string; skills: string[] };
export type ExperienceItem = { id: string; role: string; company: string; location: string; duration: string; responsibilities: string[] };
export type Project = { id: string; title: string; description: string; tech: string[]; features: string[]; liveDemo: string; github: string; imageUrl: string; featured: boolean };
export type EducationItem = { id: string; year: string; degree: string; field: string; institution: string; location: string; score: string; documentUrl: string };
export type PortfolioContent = { profile: Profile; about: string[]; skillGroups: SkillGroup[]; experiences: ExperienceItem[]; projects: Project[]; education: EducationItem[] };

export const defaultPortfolio: PortfolioContent = {
  profile: { name: "Abhishek Patel", role: "Jr. MERN Stack Developer", location: "Indore, Madhya Pradesh, India", resumeUrl: "/Abhishek_Patel_MERN_Resume.pdf", email: "abhishekpatel3800@gmail.com", linkedin: "https://www.linkedin.com/in/abhishekpatel3800/", github: "https://github.com/Abhishekpatel777", photoUrl: "" },
  about: ["I'm a Jr. MERN Stack Developer with hands-on experience building modern, responsive and scalable web applications.", "I work across frontend and backend development, with a strong focus on React, TypeScript, Node.js, Express.js, REST APIs and databases.", "I also work with Python and FastAPI and am continuously expanding my knowledge toward AI/ML and intelligent software applications."],
  skillGroups: [
    { id: "frontend", title: "Frontend", description: "Responsive interfaces, typed React applications and clear state management.", skills: ["React.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Redux Toolkit"] },
    { id: "backend", title: "Backend", description: "API-driven server logic for practical full-stack products.", skills: ["Node.js", "Express.js", "FastAPI", "REST APIs"] },
    { id: "database", title: "Database", description: "Schema-aware persistence, queries and application data workflows.", skills: ["MongoDB", "SQL", "Supabase"] },
    { id: "python", title: "Python & Data", description: "Python foundations with data tooling and growing AI/ML direction.", skills: ["Python", "NumPy", "Pandas", "Matplotlib", "Seaborn"] },
    { id: "tools", title: "Tools", description: "Version control, API testing and collaboration habits for shipping cleanly.", skills: ["Git", "GitHub", "Postman"] },
  ],
  experiences: [{ id: "vsple", role: "Jr. MERN Stack Developer", company: "vsple Technologies pvt. ltd.", location: "Indore, Madhya Pradesh, India", duration: "8 May 2026 - Present", responsibilities: ["Developed responsive frontend interfaces using React.js and TypeScript.", "Built and integrated backend APIs using Node.js and Express.js.", "Implemented state management using Redux Toolkit.", "Worked with Supabase for database operations and backend data management.", "Integrated and tested REST APIs using Postman."] }],
  projects: [{ id: "hospital", title: "Online Hospital Reservation System", description: "Full-stack hospital reservation platform built using React, TypeScript, Redux, Node.js, Express.js and Supabase.", tech: ["React", "TypeScript", "Redux Toolkit", "Node.js", "Express.js", "Supabase"], features: ["Patient reservation workflow", "API integration across frontend and backend", "Application state management", "Database operations with Supabase", "Responsive booking flows"], liveDemo: "", github: "", imageUrl: "", featured: true }],
  education: [{ id: "btech", year: "2024", degree: "Bachelor of Technology (B.Tech)", field: "Information Technology", institution: "Acropolis Institute of Technology and Research", location: "Indore", score: "", documentUrl: "" }],
};

export const navItems = [{ label: "About", href: "#about" }, { label: "Skills", href: "#skills" }, { label: "Experience", href: "#experience" }, { label: "Projects", href: "#projects" }, { label: "Education", href: "#education" }, { label: "Contact", href: "#contact" }];
