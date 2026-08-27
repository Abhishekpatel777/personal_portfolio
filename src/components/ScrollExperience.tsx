import { useEffect, useState } from "react";

const sections = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const revealSelector = [
  "#about .mx-auto > :first-child",
  "#about .max-w-3xl > p",
  "#skills .section-heading",
  "#skills article",
  "#experience .section-heading",
  "#experience article",
  "#projects .section-heading",
  "#projects article",
  "#projects .border-dashed",
  "#education .lg\\:grid-cols-\\[0\\.8fr_1\\.2fr\\] > :first-child",
  "#education article",
  "#contact > div > *",
  "footer > div > *",
].join(",");

export function ScrollExperience() {
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    const sectionElements = sections.map(({ id }) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
    const registeredElements = new Set<HTMLElement>();
    let animationFrame = 0;
    let currentSection = "top";
    let visibilityFallback = 0;

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-scroll-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -11%", threshold: .08 });

    const registerRevealElements = () => {
      document.querySelectorAll<HTMLElement>(revealSelector).forEach((element, index) => {
        if (!element.dataset.scrollReveal) {
          element.dataset.scrollReveal = "true";
          element.classList.add("scroll-reveal");
          element.style.setProperty("--scroll-reveal-delay", `${Math.min(index % 6, 5) * 72}ms`);
        }
        registeredElements.add(element);
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * .92 && rect.bottom > 0) element.classList.add("is-scroll-visible");
        else if (!element.classList.contains("is-scroll-visible")) revealObserver.observe(element);
      });
    };

    const updateScrollEffects = () => {
      animationFrame = 0;
      const viewportHeight = window.innerHeight;
      const maximumScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      const scrollProgress = Math.min(Math.max(window.scrollY / maximumScroll, 0), 1);
      document.documentElement.style.setProperty("--page-scroll", scrollProgress.toFixed(4));

      let closestId = currentSection;
      let closestDistance = Number.POSITIVE_INFINITY;
      sectionElements.forEach(section => {
        const rect = section.getBoundingClientRect();
        const travel = Math.min(Math.max(-rect.top / Math.max(rect.height - viewportHeight * .42, 1), 0), 1);
        const visibility = Math.min(Math.max((viewportHeight - rect.top) / Math.max(viewportHeight + rect.height, 1), 0), 1);
        section.style.setProperty("--section-travel", travel.toFixed(4));
        section.style.setProperty("--section-visibility", visibility.toFixed(4));
        section.classList.add("scroll-section");
        const distance = Math.abs(rect.top - viewportHeight * .32);
        if (rect.bottom > viewportHeight * .18 && distance < closestDistance) {
          closestDistance = distance;
          closestId = section.id;
        }
      });

      if (closestId !== currentSection) {
        currentSection = closestId;
        setActiveSection(closestId);
      }
      sectionElements.forEach(section => section.classList.toggle("is-scroll-active", section.id === closestId));
      document.documentElement.dataset.activeSection = closestId;
    };

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateScrollEffects);
    };

    registerRevealElements();
    updateScrollEffects();
    visibilityFallback = window.setTimeout(() => {
      registeredElements.forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight * 1.15) element.classList.add("is-scroll-visible");
      });
    }, 900);
    const mutationObserver = new MutationObserver(registerRevealElements);
    mutationObserver.observe(document.querySelector("main") ?? document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      revealObserver.disconnect();
      mutationObserver.disconnect();
      window.clearTimeout(visibilityFallback);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.cancelAnimationFrame(animationFrame);
      document.documentElement.style.removeProperty("--page-scroll");
      delete document.documentElement.dataset.activeSection;
      sectionElements.forEach(section => {
        section.style.removeProperty("--section-travel");
        section.style.removeProperty("--section-visibility");
        section.classList.remove("scroll-section", "is-scroll-active");
      });
      registeredElements.forEach(element => {
        delete element.dataset.scrollReveal;
        element.classList.remove("scroll-reveal", "is-scroll-visible");
        element.style.removeProperty("--scroll-reveal-delay");
      });
    };
  }, []);

  return <>
    <div className="scroll-progress-track" aria-hidden="true"><span /></div>
    <div className="scroll-aurora" aria-hidden="true"><i /><i /></div>
    <nav className="scroll-chapters" aria-label="Portfolio sections">
      {sections.map(section => <a key={section.id} href={`#${section.id}`} className={activeSection === section.id ? "is-active" : ""} aria-label={`Jump to ${section.label}`} aria-current={activeSection === section.id ? "location" : undefined}><span>{section.label}</span><i /></a>)}
    </nav>
  </>;
}
