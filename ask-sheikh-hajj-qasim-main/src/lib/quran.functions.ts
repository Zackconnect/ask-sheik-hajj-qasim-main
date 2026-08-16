import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const listSurahs = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchSurahList } = await import("./quran.server");
  return await fetchSurahList();
});

export const getSurah = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ number: z.number().int().min(1).max(114) }).parse(input))
  .handler(async ({ data }) => {
    const { fetchSurah } = await import("./quran.server");
    return await fetchSurah(data.number);
  });
