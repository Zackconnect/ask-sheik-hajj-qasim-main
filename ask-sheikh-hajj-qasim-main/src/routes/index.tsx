import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Headphones, MessageCircleQuestion, ShieldCheck } from "lucide-react";

import heroImage from "@/assets/hero-mosque.jpg";
import { AskPanel } from "@/components/ask-panel";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ask Sheikh Hajj Qasim — Islamic Q&A, Quran Reader & Recitations" },
      {
        name: "description",
        content:
          "Ask questions on fasting, prayer, hadith and tafsir and receive detailed answers with authentic citations. Read all 114 Surahs with translation and stream recitations.",
      },
      { property: "og:title", content: "Ask Sheikh Hajj Qasim — Islamic Q&A, Quran Reader & Recitations" },
      {
        property: "og:description",
        content:
          "Detailed Islamic answers with Qur'an and hadith citations, a full Qur'an reader, and a built-in recitation player.",
      },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    icon: MessageCircleQuestion,
    title: "Islamic Q&A Hub",
    body: "Fasting, prayer, hadith study, tafsir and everyday guidance — answered step by step with the evidences laid out.",
    to: "/ask" as const,
    cta: "Ask a question",
  },
  {
    icon: BookOpen,
    title: "Quran Reader",
    body: "All 114 Surahs in clear Uthmani script with an English translation you can toggle verse by verse.",
    to: "/quran" as const,
    cta: "Open the reader",
  },
  {
    icon: Headphones,
    title: "Recitation Library",
    body: "Stream full surahs from Al-Afasy, Abdul Basit, Al-Husary, Al-Minshawi and As-Sudais in a persistent player.",
    to: "/audio" as const,
    cta: "Start listening",
  },
];

function Index() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={heroImage}
          alt="An open Qur'an resting on a carved wooden stand in a sunlit mosque"
          width={1600}
          height={1008}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/40" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Bismillāh ar-Raḥmān ar-Raḥīm
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-primary sm:text-5xl">
              Ask Sheikh Hajj Qasim
            </h1>
            <div className="gold-rule mt-5 w-32" />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">
              Clear, vivid answers on fasting, prayer, hadith and tafsir — always with the Qur&apos;anic verse or
              authentic narration behind them. Read the Qur&apos;an, listen to trusted reciters, and keep your learning
              in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/ask">
                  Ask a question <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/quran">Read the Qur&apos;an</Link>
              </Button>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              Answers cite the Qur&apos;an and the six authentic hadith collections
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="card-elevated flex flex-col p-6">
              <span className="grid size-11 place-items-center rounded-full border border-gold/60 bg-accent/50 text-primary">
                <feature.icon className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-xl text-primary">{feature.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
              <Link
                to={feature.to}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3"
              >
                {feature.cta} <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Begin here</p>
            <h2 className="mt-2 font-display text-3xl text-primary">Put your question to the Sheikh</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Choose a category and write in your own words. You&apos;ll receive a summary, a detailed breakdown,
              citations, and practical steps.
            </p>
          </div>
          <div className="mt-9">
            <AskPanel />
          </div>
        </div>
      </section>
    </>
  );
}
