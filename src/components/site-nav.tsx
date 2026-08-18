import { Link } from "@tanstack/react-router";
import { BookOpen, Flower2, Headphones, LayoutDashboard, Menu, MessageCircleQuestion, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const LINKS = [
  { to: "/", label: "Home", icon: Flower2 },
  { to: "/ask", label: "Ask a Question", icon: MessageCircleQuestion },
  { to: "/quran", label: "Qur'an", icon: BookOpen },
  { to: "/audio", label: "Hadith", icon: Headphones },
  { to: "/quran", label: "Duas", icon: Flower2 },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-3 sm:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid size-10 place-items-center rounded-full border border-gold bg-primary text-gold shadow-sm">
            <Flower2 className="size-6" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base text-foreground sm:text-lg">Ask Sheikh Hajj Qasim</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-primary"
              activeProps={{ className: "rounded-full bg-secondary px-3.5 py-2 text-primary" }}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-3 flex items-center gap-4 text-xs font-medium">
            <button type="button" className="rounded-full bg-primary px-3 py-1.5 text-primary-foreground">English</button>
            <button type="button" className="text-foreground/60 hover:text-primary">العربية</button>
            <button type="button" className="text-foreground/60 hover:text-primary">Hausa</button>
            <button type="button" className="text-foreground/60 hover:text-primary">Twi</button>
          </div>
          {user ? (
            <>
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => void signOut()}>
                Sign out
              </Button>
            </>
          ) : (
            <Link to="/auth" className="ml-2 text-sm font-medium text-foreground/70 hover:text-primary">Sign in</Link>
          )}
          <Button asChild size="sm" className="ml-2 rounded-xl px-4">
            <Link to="/ask">Ask a Question</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="ml-auto grid size-10 place-items-center rounded-md border border-border lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-border bg-card px-4 py-3 lg:hidden">
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
