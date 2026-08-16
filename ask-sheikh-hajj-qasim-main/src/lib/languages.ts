export const LANGUAGES = [
  { id: "English", label: "English" },
  { id: "Hausa", label: "Hausa" },
  { id: "Twi", label: "Twi" },
  { id: "Arabic", label: "العربية" },
] as const;

export type AnswerLanguage = (typeof LANGUAGES)[number]["id"];
