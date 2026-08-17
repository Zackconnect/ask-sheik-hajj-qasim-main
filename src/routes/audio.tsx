import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpen, Play } from "lucide-react";
import { useState } from "react";

import { useAudio } from "@/components/audio-player";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RECITERS } from "@/lib/quran";
import { listSurahs } from "@/lib/quran.functions";

const surahListQuery = queryOptions({
  queryKey: ["surahs"],
  queryFn: () => listSurahs(),
  staleTime: 1000 * 60 * 60,
});

export const Route = createFileRoute("/audio")({
  loader: ({ context }) => context.queryClient.ensureQueryData(surahListQuery),
  head: () => ({
    meta: [
      { title: "Quran Recitations — Listen by Surah" },
      {
        name: "description",
        content:
          "Stream full-surah Qur'an recitations from renowned reciters including Al-Afasy, Abdul Basit, Al-Husary and As-Sudais.",
      },
      { property: "og:title", content: "Quran Recitations — Listen by Surah" },
      {
        property: "og:description",
        content: "Full-surah recitations from renowned reciters with a touch-friendly player.",
      },
    ],
  }),
  component: AudioPage,
});

function AudioPage() {
  const { data: surahs } = useSuspenseQuery(surahListQuery);
  const { playSurah, reciter, setReciter, track } = useAudio();
  const [term, setTerm] = useState("");

  const query = term.trim().toLowerCase();
  const filtered = surahs.filter(
    (surah) => !query || surah.englishName.toLowerCase().includes(query) || String(surah.number) === query,
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 pb-40">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recitation Library</p>
      <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">Listen to the Qur&apos;an</h1>
      <div className="gold-rule mt-4 w-24" />

      <div className="card-elevated mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm">
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Reciter</span>
          <select
            value={reciter}
            onChange={(event) => setReciter(event.target.value)}
            className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {RECITERS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex-1 text-sm">
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Find a surah</span>
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Al-Fatihah, 36, Yasin…"
            className="mt-2 bg-background"
          />
        </label>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {filtered.map((surah) => (
          <li key={surah.number} className="card-elevated flex items-center gap-4 p-4">
            <Button
              size="icon"
              aria-label={`Play Surah ${surah.englishName}`}
              onClick={() =>
                playSurah({
                  surahNumber: surah.number,
                  title: `Surah ${surah.englishName}`,
                  subtitle: `${surah.numberOfAyahs} verses`,
                })
              }
              className={track?.surahNumber === surah.number ? "bg-gold text-primary-deep hover:bg-gold" : ""}
            >
              <Play className="size-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base text-primary">
                {surah.number}. {surah.englishName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {surah.englishNameTranslation} · {surah.numberOfAyahs} verses
              </p>
            </div>
            <Button asChild variant="ghost" size="icon" aria-label={`Read Surah ${surah.englishName}`}>
              <Link to="/quran/$number" params={{ number: String(surah.number) }}>
                <BookOpen className="size-4" />
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
