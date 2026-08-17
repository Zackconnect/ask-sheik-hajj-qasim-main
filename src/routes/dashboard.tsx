import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpen, Bookmark, MessageCircleQuestion, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { SheikhAnswer } from "@/lib/answer";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — Ask Sheikh Hajj Qasim" },
      {
        name: "description",
        content: "Review your saved questions and answers, and jump back into the Surahs and verses you bookmarked.",
      },
      { property: "og:title", content: "My Dashboard — Ask Sheikh Hajj Qasim" },
      { property: "og:description", content: "Your saved questions, answers, and Qur'an bookmarks." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function parseAnswer(raw: string): SheikhAnswer | null {
  try {
    return JSON.parse(raw) as SheikhAnswer;
  } catch {
    return null;
  }
}

function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const questions = useQuery({
    queryKey: ["questions", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("id, category, question, answer, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const bookmarks = useQuery({
    queryKey: ["bookmarks", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("id, surah_number, ayah_number, label, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (!user) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">Loading your account…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your space</p>
      <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">As-salamu alaykum</h1>
      <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
      <div className="gold-rule mt-4 w-24" />

      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-xl text-primary">
          <Bookmark className="size-5" /> Bookmarks
        </h2>
        {bookmarks.data?.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {bookmarks.data.map((item) => (
              <li key={item.id} className="card-elevated flex items-center gap-3 p-4">
                <BookOpen className="size-4 shrink-0 text-primary" />
                <Link
                  to="/quran/$number"
                  params={{ number: String(item.surah_number) }}
                  className="min-w-0 flex-1 truncate text-sm font-medium hover:text-primary"
                >
                  {item.label}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove bookmark"
                  onClick={async () => {
                    await supabase.from("bookmarks").delete().eq("id", item.id);
                    await queryClient.invalidateQueries({ queryKey: ["bookmarks", user.id] });
                    toast.success("Bookmark removed");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No bookmarks yet.{" "}
            <Link to="/quran" className="text-primary underline-offset-4 hover:underline">
              Open the Qur&apos;an reader
            </Link>{" "}
            and save a verse.
          </p>
        )}
      </section>

      <section className="mt-14">
        <h2 className="flex items-center gap-2 font-display text-xl text-primary">
          <MessageCircleQuestion className="size-5" /> Saved questions
        </h2>
        {questions.data?.length ? (
          <ul className="mt-4 space-y-4">
            {questions.data.map((item) => {
              const parsed = parseAnswer(item.answer);
              return (
                <li key={item.id} className="card-elevated p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-accent px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-primary">
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto"
                      aria-label="Delete question"
                      onClick={async () => {
                        await supabase.from("questions").delete().eq("id", item.id);
                        await queryClient.invalidateQueries({ queryKey: ["questions", user.id] });
                        toast.success("Question deleted");
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <p className="mt-3 font-display text-lg text-primary">{item.question}</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {parsed?.summary ?? item.answer.slice(0, 400)}
                  </p>
                  {parsed?.detail?.length ? (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm text-primary">Read the full answer</summary>
                      <div className="mt-3 space-y-4">
                        {parsed.detail.map((section) => (
                          <div key={section.heading}>
                            <p className="font-display text-base text-primary">{section.heading}</p>
                            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                              {section.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            You haven&apos;t saved any questions yet.{" "}
            <Link to="/ask" className="text-primary underline-offset-4 hover:underline">
              Ask your first question
            </Link>
            .
          </p>
        )}
      </section>
    </div>
  );
}
