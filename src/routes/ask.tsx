import { createFileRoute } from "@tanstack/react-router";

import { AskPanel } from "@/components/ask-panel";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask a Question — Sheikh Hajj Qasim" },
      {
        name: "description",
        content:
          "Ask about fasting, prayer, hadith, tafsir, or daily Islamic guidance and receive a detailed answer with Qur'anic and hadith citations.",
      },
      { property: "og:title", content: "Ask a Question — Sheikh Hajj Qasim" },
      {
        property: "og:description",
        content: "Detailed Islamic answers with authentic Qur'an and hadith citations.",
      },
    ],
  }),
  component: AskPage,
});

function AskPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Islamic Q&amp;A Hub</p>
      <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">Ask Sheikh Hajj Qasim</h1>
      <div className="gold-rule mt-4 w-24" />
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        Write your question in your own words. Choose a category so the answer is framed with the right evidences — from
        the fiqh of fasting and prayer to hadith study and Qur&apos;anic exegesis.
      </p>

      <div className="mt-8">
        <AskPanel />
      </div>
    </div>
  );
}
