import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-foreground pb-28 pt-20 text-warm-white md:pb-12 md:pt-28">
      <div className="content-shell grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5"><div className="font-display text-8xl leading-none">Un<span className="text-gold">I</span></div><div className="mt-3 editorial-label">Design Group</div></div>
        <div className="md:col-span-3"><p className="editorial-label mb-6 text-gold">Services</p>{["Architecture", "Interior Design", "3D Visualisation", "Liaisoning & Sanctioning"].map((item) => <p key={item} className="mb-3 text-sm text-warm-white/70">{item}</p>)}</div>
        <nav className="md:col-span-2" aria-label="Footer navigation"><p className="editorial-label mb-6 text-gold">Navigate</p>{[["Projects","/projects"],["About","/about"],["Services","/services"],["3D Experience","/3d-experience"],["Contact","/contact"]].map(([label,to]) => <Link key={to} to={to} className="mb-3 block text-sm text-warm-white/70 hover:text-gold">{label}</Link>)}</nav>
        <div className="md:col-span-2"><p className="editorial-label mb-6 text-gold">Connect</p><p className="mb-3 text-sm text-warm-white/40">Instagram</p><p className="mb-3 text-sm text-warm-white/40">WhatsApp</p><p className="text-sm text-warm-white/40">Email</p></div>
      </div>
      <div className="content-shell mt-20 flex flex-wrap justify-between gap-4 border-t border-warm-white/15 pt-6 text-[10px] uppercase tracking-[0.14em] text-warm-white/45"><span>© UnI Design Group</span><span>The space is the interface.</span></div>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-border bg-warm-white p-2 md:hidden"><span className="flex h-12 items-center justify-center text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">WhatsApp</span><Link to="/contact" className="flex h-12 items-center justify-center bg-foreground text-xs font-semibold uppercase tracking-[0.1em] text-warm-white">Book consultation</Link></div>
    </footer>
  );
}