import { SectionHeading } from "../components/SectionHeading";
import { SkillCard } from "../components/SkillCard";
import { skillGroups } from "../data/portfolio";

export function Skills() {
  return (
    <section id="skills" className="section-pad">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Skills"
          title="A practical stack for building usable full-stack products."
          description="Organized around the technologies Abhishek uses to design interfaces, build APIs, manage data and collaborate on production-minded software."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <SkillCard key={group.title} {...group} />
          ))}
        </div>
      </div>
    </section>
  );
}
