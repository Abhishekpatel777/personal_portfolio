import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-semibold text-text-primary">Abhishek Patel</p>
          <p className="mt-1 text-sm text-text-secondary">Jr. MERN Stack Developer</p>
        </div>
        <SocialLinks compact />
        <p className="text-sm text-text-secondary">Copyright 2026</p>
      </div>
    </footer>
  );
}
