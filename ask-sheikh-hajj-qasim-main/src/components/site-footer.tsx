import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg text-primary">Ask Sheikh Hajj Qasim</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            A place of learning: read the Qur&apos;an, listen to trusted reciters, and seek clear answers rooted in
            authentic sources.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/quran" className="hover:text-primary">
                Quran Reader
              </Link>
            </li>
            <li>
              <Link to="/ask" className="hover:text-primary">
                Ask a Question
              </Link>
            </li>
            <li>
              <Link to="/audio" className="hover:text-primary">
                Recitations
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-primary">
                My Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Please note</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Answers are for learning and reflection. For binding rulings on personal, medical, or legal matters, consult
            a qualified scholar in your community.
          </p>
        </div>
      </div>
      <div className="border-t border-border/70 px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ask Sheikh Hajj Qasim · Qur&apos;an text &amp; audio courtesy of AlQuran Cloud
      </div>
    </footer>
  );
}
