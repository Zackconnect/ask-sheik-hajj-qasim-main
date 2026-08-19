import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Coins,
  Heart,
  Landmark,
  Moon,
  Scale,
  ShieldCheck,
  Sparkles,
  Utensils,
} from "lucide-react";

import heroImage from "@/assets/hero-mosque.jpg";
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

const TOPICS = [
  { icon: BookOpen, title: "Qur'an", body: "Verses, tafsir, surahs, translation and memorization." },
  { icon: Landmark, title: "Salah", body: "Wudu, prayer times, rak'ahs, Jumu'ah and travel prayer." },
  { icon: Moon, title: "Fasting", body: "Ramadan, suhoor, iftar and missed fasts." },
  { icon: Coins, title: "Zakat", body: "Who pays, calculation, gold, business wealth, recipients." },
  { icon: Landmark, title: "Hajj & Umrah", body: "Ihram, tawaf, sa'i, Arafah, Mina and Muzdalifah." },
  { icon: Heart, title: "Marriage", body: "Nikah, mahr, rights of spouses, divorce and khul'." },
  { icon: Scale, title: "Inheritance & Property", body: "Estate distribution, wills, shares of heirs, debts." },
  { icon: Utensils, title: "Halal & Haram", body: "Food, finance, clothing, entertainment, daily life." },
  { icon: Landmark, title: "Islamic History", body: "Prophets, Sahabah, civilizations and key events." },
  { icon: Heart, title: "Duas & Dhikr", body: "Morning and evening adhkar, protection and forgiveness." },
] as const;

function Index() {
  return (
    <>
      <section className="relative flex min-h-[calc(100vh-74px)] items-center overflow-hidden border-b border-primary-deep">
        <img
          src={heroImage}
          alt="An open Qur'an resting on a carved wooden stand in a sunlit mosque"
          width={1600}
          height={1008}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-primary/55" />
        <div className="relative mx-auto w-full max-w-5xl px-4 py-24 text-center sm:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-3 py-1 text-xs text-primary-foreground/90">
              <Sparkles className="size-3.5" />
              Ask. Learn. Understand Islam.
            </div>
            <h1 className="mt-7 font-display text-5xl leading-[1.08] text-primary-foreground sm:text-6xl lg:text-7xl">
              Have an Islamic Question?
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-primary-foreground/85 sm:text-xl">
              Sheikh Hajj Qasim helps you explore Islamic knowledge from the Qur&apos;an, authentic Sunnah, and trusted
              scholarly sources.
            </p>
            <form className="mx-auto mt-9 flex max-w-3xl flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
              <input
                aria-label="Ask anything about Islam"
                placeholder="Ask anything about Islam..."
                className="h-14 min-w-0 flex-1 rounded-2xl border border-background/50 bg-background px-5 text-left text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-gold"
              />
              <Button asChild size="lg" className="h-14 rounded-2xl bg-gold px-8 text-foreground shadow-none hover:bg-gold-soft">
                <Link to="/ask">
                  Ask Sheikh Hajj Qasim <ArrowRight className="size-4" />
                </Link>
              </Button>
            </form>
            <div className="mt-9">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground/70">Popular questions</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {[
                  "What are the five pillars of Islam?",
                  "How do I perform Salah?",
                  "What does Islam say about marriage?",
                  "How is inheritance divided?",
                ].map((question) => (
                  <Link
                    key={question}
                    to="/ask"
                    className="rounded-full border border-primary-foreground/25 px-4 py-2 text-xs text-primary-foreground/90 transition-colors hover:border-gold hover:bg-primary-foreground/10"
                  >
                    {question}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">Explore Islamic Topics</h2>
            <p className="mt-2 text-sm text-muted-foreground">Browse the areas people ask about most.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {TOPICS.map((topic) => (
              <Link
                key={topic.title}
                to="/ask"
                className="card-elevated group flex min-h-40 flex-col p-5 transition-transform hover:-translate-y-1 hover:border-primary/30"
              >
                <topic.icon className="size-7 text-primary" strokeWidth={1.8} />
                <h3 className="mt-5 font-display text-lg text-foreground">{topic.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{topic.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30 px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <article className="card-elevated min-h-72 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Ayah of the Day</p>
            <p className="arabic mt-6 text-center text-2xl text-foreground">
              إِنَّ اللَّهَ مَعَ الصَّابِرِينَ
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.
            </p>
            <p className="mt-5 text-xs font-medium text-primary">Qur&apos;an 2:153 — Al-Baqarah</p>
          </article>
          <article className="card-elevated min-h-72 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Hadith of the Day</p>
            <p className="arabic mt-6 text-center text-2xl text-foreground">إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ</p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Actions are judged by intentions, and every person will get the reward according to what he intended.
            </p>
            <p className="mt-5 text-xs font-medium text-primary">Sahih al-Bukhari · Sahih Muslim</p>
          </article>
          <article className="card-elevated min-h-72 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Question of the Day</p>
            <h3 className="mt-7 font-display text-2xl text-foreground">What are the five pillars of Islam?</h3>
            <Button asChild className="mt-6 rounded-xl">
              <Link to="/ask">Learn More <ArrowRight className="size-4" /></Link>
            </Button>
          </article>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {[
            { icon: BookOpen, title: "Trusted Sources", body: "Answers reference recognised books of Qur'an and Sunnah." },
            { icon: ShieldCheck, title: "Ask a Scholar", body: "Some questions need a human. Submit your question for review by a qualified scholar." },
            { icon: Sparkles, title: "How Ask Sheikh Hajj Qasim Works", body: "Your digital companion for authentic Islamic knowledge." },
          ].map((feature) => (
            <article key={feature.title} className="card-elevated min-h-44 p-6">
              <feature.icon className="size-7 text-primary" strokeWidth={1.8} />
              <h2 className="mt-5 font-display text-xl text-foreground">{feature.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

    </>
  );
}
