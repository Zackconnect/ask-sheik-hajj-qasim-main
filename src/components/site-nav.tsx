import { Link } from "@tanstack/react-router";
import { BookOpen, Headphones, LayoutDashboard, Menu, MessageCircleQuestion, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const LINKS = [
  { to: "/quran", label: "Quran", icon: BookOpen },
  { to: "/ask", label: "Q&A", icon: MessageCircleQuestion },
  { to: "/audio", label: "Audio", icon: Headphones },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid size-10 place-items-center rounded-full border border-gold bg-primary font-display text-lg text-primary-foreground">
            ق
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base text-primary sm:text-lg">Ask Sheikh Hajj Qasim</span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Quran · Q&amp;A · Recitation
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
              activeProps={{ className: "bg-secondary text-primary" }}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                activeProps={{ className: "bg-secondary text-primary" }}
              >
                Dashboard
              </Link>
              <Button variant="outline" size="sm" className="ml-2" onClick={() => void signOut()}>
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="ml-2">
              <Link to="/auth">Login / Signup</Link>
            </Button>
          )}
        </nav>

        <button
          type="button"
          className="ml-auto grid size-10 place-items-center rounded-md border border-border md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-border bg-card px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium text-foreground/85 hover:bg-secondary"
                  activeProps={{ className: "bg-secondary text-primary" }}
                >
                  <link.icon className="size-4 text-primary" />
                  {link.label}
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium text-foreground/85 hover:bg-secondary"
                  >
                    <LayoutDashboard className="size-4 text-primary" />
                    Dashboard
                  </Link>
                </li>
                <li className="pt-2">
                  <Button variant="outline" className="w-full" onClick={() => void signOut()}>
                    Sign out
                  </Button>
                </li>
              </>
            ) : (
              <li className="pt-2">
                <Button asChild className="w-full">
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    Login / Signup
                  </Link>
                </Button>
              </li>
            )}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
