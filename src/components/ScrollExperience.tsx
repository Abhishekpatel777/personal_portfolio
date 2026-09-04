const sections = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export function ScrollExperience() {
  return <nav className="scroll-chapters" aria-label="Portfolio sections">
    {sections.map(section => <a key={section.id} href={`#${section.id}`} aria-label={`Jump to ${section.label}`}><span>{section.label}</span><i /></a>)}
  </nav>;
}
