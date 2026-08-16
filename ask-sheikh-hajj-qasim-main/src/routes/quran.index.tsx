import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { listSurahs } from "@/lib/quran.functions";

const surahListQuery = queryOptions({
  queryKey: ["surahs"],
  queryFn: () => listSurahs(),
  staleTime: 1000 * 60 * 60,
});

export const Route = createFileRoute("/quran/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(surahListQuery),
  head: () => ({
    meta: [
      { title: "Quran Reader — All 114 Surahs" },
      {
        name: "description",
        content:
          "Browse all 114 Surahs of the Qur'an with Arabic names and English meanings, then read verse by verse with translation and recitation.",
      },
      { property: "og:title", content: "Quran Reader — All 114 Surahs" },
      {
        property: "og:description",
        content: "Read the Qur'an in Arabic with English translation and stream trusted recitations.",
      },
    ],
  }),
  component: QuranIndex,
});

function QuranIndex() {
  const { data: surahs } = useSuspenseQuery(surahListQuery);
  const [term, setTerm] = useState("");

  const query = term.trim().toLowerCase();
  const filtered = surahs.filter(
    (surah) =>
      !query ||
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.name.includes(term.trim()) ||
      String(surah.number) === query,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">The Noble Qur&apos;an</p>
      <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">Read &amp; Listen</h1>
      <div className="gold-rule mt-4 w-24" />

      <div className="relative mt-8 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search surah by name, meaning or number"
          className="bg-card pl-9"
          aria-label="Search surahs"
        />
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((surah) => (
          <li key={surah.number}>
            <Link
              to="/quran/$number"
              params={{ number: String(surah.number) }}
              className="card-elevated flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:border-gold"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/60 bg-accent/50 font-display text-sm text-primary">
                {surah.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-base text-primary">{surah.englishName}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {surah.englishNameTranslation} · {surah.numberOfAyahs} verses · {surah.revelationType}
                </span>
              </span>
              <span className="arabic shrink-0 text-xl text-primary">{surah.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {!filtered.length ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">No surah matched “{term}”.</p>
      ) : null}
    </div>
  );
}
