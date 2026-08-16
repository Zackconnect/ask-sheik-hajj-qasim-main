import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookMarked, Check, Copy, Loader2, Share2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { answerToPlainText, type SheikhAnswer } from "@/lib/answer";
import { askSheikh } from "@/lib/ask.functions";
import { LANGUAGES, type AnswerLanguage } from "@/lib/languages";

const CATEGORIES = ["Fasting", "Prayer", "Hadith", "Quran", "General Islamic Guidance"] as const;
type Category = (typeof CATEGORIES)[number];

export function AskPanel() {
  const ask = useServerFn(askSheikh);
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState<AnswerLanguage>("English");
  const [category, setCategory] = useState<Category>("General Islamic Guidance");
  const [answer, setAnswer] = useState<SheikhAnswer | null>(null);
  const [asked, setAsked] = useState("");
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: async (input: { question: string; category: Category; language: AnswerLanguage }) =>
      (await ask({ data: input })) as SheikhAnswer,
    onSuccess: async (result, input) => {
      setAnswer(result);
      setAsked(input.question);
      if (user) {
        const { error } = await supabase.from("questions").insert({
          user_id: user.id,
          category: input.category,
          question: input.question,
          answer: JSON.stringify(result),
        });
        if (!error) toast.success("Saved to your dashboard");
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const plain = answer ? answerToPlainText(answer, asked) : "";

  return (
    <div className="space-y-8">
      <form
        className="card-elevated space-y-4 p-5 sm:p-7"
        onSubmit={(event) => {
          event.preventDefault();
          if (question.trim().length < 8) {
            toast.error("Please write a little more detail in your question.");
            return;
          }
          mutation.mutate({ question: question.trim(), category, language });
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Answer language</span>
          {LANGUAGES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLanguage(item.id)}
              className={
                language === item.id
                  ? "rounded-full border border-gold bg-accent px-3 py-1 text-xs text-primary"
                  : "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-gold hover:text-primary"
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={
                category === item
                  ? "rounded-full border border-gold bg-primary px-4 py-1.5 text-sm text-primary-foreground"
                  : "rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-gold hover:text-primary"
              }
            >
              {item}
            </button>
          ))}
        </div>

        <Textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={5}
          maxLength={1200}
          placeholder="e.g. If I travel during Ramadan, when may I break my fast and how do I make up the days?"
          className="resize-none bg-background text-base"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {user ? "Your questions are saved to your dashboard." : "Sign in to save your questions and answers."}
          </p>
          <Button type="submit" disabled={mutation.isPending} className="min-w-40">
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Consulting sources…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Ask the Sheikh
              </>
            )}
          </Button>
        </div>
      </form>

      {mutation.isPending ? (
        <div className="card-elevated space-y-3 p-6">
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      ) : null}

      {answer ? (
        <article className="card-elevated overflow-hidden">
          <div className="ornament-bg px-6 py-5 text-primary-foreground">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold">{category}</p>
            <h2 className="mt-1 font-display text-xl">In summary</h2>
            <p className="mt-2 text-sm leading-relaxed text-primary-foreground/90">{answer.summary}</p>
          </div>

          <div className="space-y-7 p-6 sm:p-8">
            {answer.detail.map((section) => (
              <section key={section.heading}>
                <h3 className="font-display text-lg text-primary">{section.heading}</h3>
                <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-foreground/85">
                  {section.body}
                </p>
              </section>
            ))}

            {answer.references.length ? (
              <section>
                <h3 className="font-display text-lg text-primary">Evidences &amp; citations</h3>
                <ul className="mt-3 space-y-4">
                  {answer.references.map((ref) => (
                    <li key={ref.source + ref.translation} className="rounded-lg border-l-4 border-gold bg-accent/40 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {ref.kind === "quran" ? "Qur'an" : "Hadith"} · {ref.source}
                      </p>
                      {ref.arabic ? <p className="arabic mt-2 text-xl text-primary">{ref.arabic}</p> : null}
                      <p className="mt-2 text-sm italic leading-relaxed text-foreground/85">{ref.translation}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {answer.practical.length ? (
              <section>
                <h3 className="font-display text-lg text-primary">Practical steps</h3>
                <ol className="mt-3 space-y-2">
                  {answer.practical.map((step, index) => (
                    <li key={step} className="flex gap-3 text-[15px] leading-relaxed text-foreground/85">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {answer.closing ? (
              <p className="border-t border-border pt-5 text-[15px] italic leading-relaxed text-muted-foreground">
                {answer.closing}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2 border-t border-border pt-5">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(plain);
                  setCopied(true);
                  toast.success("Answer copied");
                  window.setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />} Copy answer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const shareData = { title: "Ask Sheikh Hajj Qasim", text: plain };
                  if (typeof navigator.share === "function") {
                    try {
                      await navigator.share(shareData);
                      return;
                    } catch {
                      /* user dismissed */
                    }
                  }
                  await navigator.clipboard.writeText(plain);
                  toast.success("Answer copied — ready to share");
                }}
              >
                <Share2 className="size-4" /> Share
              </Button>
              {!user ? (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookMarked className="size-3.5" /> Sign in to keep a history of your questions
                </span>
              ) : null}
            </div>
          </div>
        </article>
      ) : null}
    </div>
  );
}
