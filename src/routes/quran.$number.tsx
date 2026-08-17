import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bookmark, Languages, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useAudio } from "@/components/audio-player";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getSurah } from "@/lib/quran.functions";

function surahQuery(number: number) {
  return queryOptions({
    queryKey: ["surah", number],
    queryFn: () => getSurah({ data: { number } }),
    staleTime: 1000 * 60 * 60,
  });
}

export const Route = createFileRoute("/quran/$number")({
  loader: ({ context, params }) => {
    const number = Number(params.number);
    if (!Number.isInteger(number) || number < 1 || number > 114) throw notFound();
    return context.queryClient.ensureQueryData(surahQuery(number));
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Surah unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const title = `Surah ${loaderData.englishName} (${loaderData.englishNameTranslation}) — Read & Listen`;
    const description = `Read Surah ${loaderData.englishName} in Arabic with English translation across ${loaderData.numberOfAyahs} verses, and stream the recitation.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SurahPage,
});

function SurahPage() {
  const { number } = Route.useParams();
  const surahNumber = Number(number);
  const { data: surah } = useSuspenseQuery(surahQuery(surahNumber));
  const { playSurah } = useAudio();
  const { user } = useAuth();
  const [showTranslation, setShowTranslation] = useState(true);

  async function bookmark(ayahNumber: number | null, label: string) {
    if (!user) {
      toast.error("Sign in to save bookmarks");
      return;
    }
    const { error } = await supabase.from("bookmarks").upsert(
      { user_id: user.id, surah_number: surahNumber, ayah_number: ayahNumber, label },
      { onConflict: "user_id,surah_number,ayah_number" },
    );
    if (error) toast.error("Could not save the bookmark");
    else toast.success(`Bookmarked ${label}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 pb-40">
      <Link to="/quran" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> All surahs
      </Link>

      <header className="card-elevated mt-4 overflow-hidden">
        <div className="ornament-bg px-6 py-8 text-center text-primary-foreground">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold">
            Surah {surah.number} · {surah.revelationType} · {surah.numberOfAyahs} verses
          </p>
          <p className="arabic mt-3 text-4xl">{surah.name}</p>
          <h1 className="mt-2 font-display text-2xl">
            {surah.englishName} — {surah.englishNameTranslation}
          </h1>
        </div>
        <div className="flex flex-wrap justify-center gap-2 p-4">
          <Button
            onClick={() =>
              playSurah({
                surahNumber: surah.number,
                title: `Surah ${surah.englishName}`,
                subtitle: `${surah.numberOfAyahs} verses`,
              })
            }
          >
            <Play className="size-4" /> Play recitation
          </Button>
          <Button variant="outline" onClick={() => setShowTranslation((prev) => !prev)}>
            <Languages className="size-4" /> {showTranslation ? "Hide" : "Show"} translation
          </Button>
          <Button variant="outline" onClick={() => void bookmark(null, `Surah ${surah.englishName}`)}>
            <Bookmark className="size-4" /> Bookmark surah
          </Button>
        </div>
      </header>

      <ol className="mt-8 space-y-4">
        {surah.ayahs.map((ayah) => (
          <li key={ayah.numberInSurah} className="card-elevated p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-gold/60 bg-accent/50 text-xs text-primary">
                {ayah.numberInSurah}
              </span>
              <div className="flex gap-1">
                {ayah.audio ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Play verse ${ayah.numberInSurah}`}
                    onClick={() => {
                      const audio = new Audio(ayah.audio);
                      void audio.play();
                    }}
                  >
                    <Play className="size-4" />
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Bookmark verse ${ayah.numberInSurah}`}
                  onClick={() => void bookmark(ayah.numberInSurah, `${surah.englishName} ${surah.number}:${ayah.numberInSurah}`)}
                >
                  <Bookmark className="size-4" />
                </Button>
              </div>
            </div>
            <p className="arabic mt-4 text-2xl leading-[2.4] text-primary sm:text-[28px]">{ayah.arabic}</p>
            {showTranslation ? (
              <p className="mt-4 border-t border-border pt-4 text-[15px] leading-relaxed text-foreground/85">
                {ayah.translation}
              </p>
            ) : null}
          </li>
        ))}
      </ol>

      <nav className="mt-10 flex items-center justify-between gap-4">
        {surahNumber > 1 ? (
          <Button asChild variant="outline">
            <Link to="/quran/$number" params={{ number: String(surahNumber - 1) }}>
              <ArrowLeft className="size-4" /> Previous surah
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {surahNumber < 114 ? (
          <Button asChild variant="outline">
            <Link to="/quran/$number" params={{ number: String(surahNumber + 1) }}>
              Next surah <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
