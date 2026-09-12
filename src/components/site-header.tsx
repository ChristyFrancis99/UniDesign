import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const links = [
  { label: "Projects", to: "/projects" as const },
  { label: "About", to: "/about" as const },
  { label: "Services", to: "/services" as const },
  { label: "3D Experience", to: "/3d-experience" as const },
  { label: "Contact", to: "/contact" as const },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const overHero = pathname === "/" || pathname.startsWith("/projects/") || pathname === "/3d-experience";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const darkText = scrolled || !overHero;
  return (
    <header className={`nav-in fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${scrolled ? "border-border bg-warm-white/95 backdrop-blur-md" : "border-transparent bg-transparent"}`}>
      <div className={`content-shell flex h-24 items-center justify-between ${darkText ? "text-foreground" : "text-warm-white"}`}>
        <Link to="/" aria-label="UnI Design Group home" className="relative z-50 leading-none">
          <span className="font-display text-4xl">Un<span className="text-gold">I</span></span>
          <span className="mt-1 block text-[9px] font-semibold tracking-[0.22em]">DESIGN GROUP</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-8 lg:flex">
          {links.map((link) => <Link key={link.to} to={link.to} className="editorial-label border-b border-transparent py-2 transition-colors hover:border-gold hover:text-gold" activeProps={{ className: "text-gold border-gold" }}>{link.label}</Link>)}
          <Button asChild variant={darkText ? "editorial" : "inverse"}><Link to="/contact">Start a project <span aria-hidden>→</span></Link></Button>
        </nav>
        <Button variant="ghost" size="icon" className={`relative z-50 lg:hidden ${open ? "text-warm-white hover:bg-warm-white/10" : ""}`} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</Button>
      </div>
      <div className={`fixed inset-0 z-40 bg-foreground text-warm-white transition-all duration-500 lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
        <nav className="flex h-full flex-col justify-center px-8" aria-label="Mobile navigation">
          {links.map((link, index) => <Link key={link.to} to={link.to} className="border-b border-warm-white/15 py-4 font-display text-4xl"><span className="mr-5 font-sans text-xs text-gold">0{index + 1}</span>{link.label}</Link>)}
          <Link to="/contact" className="mt-8 editorial-label text-gold">Start a project →</Link>
        </nav>
      </div>
    </header>
  );
}