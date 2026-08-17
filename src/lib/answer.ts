export type SheikhAnswer = {
  summary: string;
  detail: Array<{ heading: string; body: string }>;
  references: Array<{ kind: "quran" | "hadith"; source: string; arabic: string; translation: string }>;
  practical: string[];
  closing: string;
};

export function answerToPlainText(answer: SheikhAnswer, question: string) {
  const lines: string[] = [`Question: ${question}`, "", `Summary: ${answer.summary}`, ""];
  answer.detail.forEach((section) => {
    lines.push(section.heading, section.body, "");
  });
  if (answer.references.length) {
    lines.push("References:");
    answer.references.forEach((ref) => lines.push(`- ${ref.source}: ${ref.translation}`));
    lines.push("");
  }
  if (answer.practical.length) {
    lines.push("Practical steps:");
    answer.practical.forEach((step) => lines.push(`- ${step}`));
    lines.push("");
  }
  if (answer.closing) lines.push(answer.closing);
  lines.push("", "— Ask Sheikh Hajj Qasim");
  return lines.join("\n");
}
