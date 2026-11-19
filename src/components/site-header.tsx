import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

const sectionLinks = [
  ["The studio", "#studio"], ["Walkthrough", "#walkthrough"], ["Expertise", "#expertise"], ["Selected work", "#projects"], ["Material language", "#materials"], ["The process", "#process"], ["Studio philosophy", "#philosophy"], ["Contact", "#contact"], ["Consultation", "#consultation"], ["Interactive process", "#interactive-process"], ["Where we work", "#locations"], ["Detail hotspots", "#details"],
] as const;

const links = [
  { label: "Home", to: "/" as const },
  { label: "Projects", to: "/projects" as const },
  { label: "Blueprint Lab", to: "/blueprint" as const },
  { label: "About", to: "/about" as const },
  { label: "Services", to: "/services" as const },
  { label: "Contact", to: "/contact" as const },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(0);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const overHero = pathname === "/" || pathname.startsWith("/projects/");

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 48);
      if (current < 100 || current < lastScroll.current - 4) setVisible(true);
      else if (current > lastScroll.current + 6) setVisible(false);
      lastScroll.current = current;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const darkText = scrolled || !overHero;

  return (
    <header className={`site-header nav-in fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${visible || open ? "translate-y-0" : "-translate-y-full"} ${scrolled ? "border-border bg-warm-white/95 shadow-sm backdrop-blur-md" : "border-transparent bg-transparent"}`}>
      <div className={`content-shell flex h-24 items-center justify-between ${darkText ? "text-foreground" : "text-warm-white"}`}>
        <Link to="/" aria-label="UnI Design Group home" className="relative z-50 leading-none no-motion">
          <span className="font-display text-4xl">Un<span className="text-gold">I</span></span>
          <span className="mt-1 block text-[9px] font-semibold tracking-[0.22em]">DESIGN GROUP</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="editorial-label border-b border-transparent py-2 transition-colors hover:border-gold hover:text-gold" activeProps={{ className: "text-gold border-gold" }}>
              {link.label}
            </Link>
          ))}
          <Button asChild variant={darkText ? "editorial" : "inverse"} data-magnetic>
            <Link to="/contact">Start a project <span aria-hidden>→</span></Link>
          </Button>
        </nav>

        <Button variant="ghost" className={`relative z-50 hidden lg:inline-flex ${darkText ? "text-foreground" : "text-warm-white"}`} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="site-navigation-overlay">
          {open ? "Close" : "Menu"} {open ? <X className="ml-2 h-4 w-4" /> : <Menu className="ml-2 h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className={`relative z-50 lg:hidden ${open ? "text-warm-white hover:bg-warm-white/10" : ""}`} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="site-navigation-overlay" aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      <div id="site-navigation-overlay" aria-hidden={!open} className={`fixed inset-0 z-40 overflow-y-auto bg-foreground text-warm-white transition-[opacity,visibility] duration-500 ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
        <nav className="content-shell flex min-h-full flex-col justify-center py-28" aria-label="Homepage sections">
          <p className="editorial-label mb-8 text-gold">Explore UnI Design Group</p>
          <div className="grid gap-x-12 gap-y-1 md:grid-cols-2">
            {sectionLinks.map(([label, href], index) => (
              <a key={href} href={href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="border-b border-warm-white/15 py-3 font-display text-2xl opacity-0 transition-[opacity,transform,color] duration-500 hover:translate-x-2 hover:text-gold md:text-3xl" style={{ transform: open ? "translateX(0)" : "translateX(-20px)", opacity: open ? 1 : 0, transitionDelay: open ? `${index * 45 + 100}ms` : "0ms" }}>
                <span className="mr-5 font-sans text-[10px] text-gold">0{index + 1}</span>{label}
              </a>
            ))}
          </div>
          <Link to="/contact" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="mt-10 editorial-label text-gold">Start a project →</Link>
        </nav>
      </div>
    </header>
  );
}
