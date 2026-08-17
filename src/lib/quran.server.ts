import type { SurahDetail, SurahMeta } from "./quran";

const BASE = "https://api.alquran.cloud/v1";

async function getJson(url: string) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Quran service unavailable (${res.status})`);
  const json = (await res.json()) as { data: unknown };
  return json.data;
}

export async function fetchSurahList() {
  return (await getJson(`${BASE}/surah`)) as SurahMeta[];
}

export async function fetchSurah(number: number): Promise<SurahDetail> {
  const editions = (await getJson(
    `${BASE}/surah/${number}/editions/quran-uthmani,en.asad,ar.alafasy`,
  )) as Array<{
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
    ayahs: Array<{ numberInSurah: number; text: string; audio?: string }>;
  }>;

  const [arabic, translation, audio] = editions;
  if (!arabic || !translation) throw new Error("Surah could not be loaded");

  return {
    number: arabic.number,
    name: arabic.name,
    englishName: arabic.englishName,
    englishNameTranslation: arabic.englishNameTranslation,
    numberOfAyahs: arabic.numberOfAyahs,
    revelationType: arabic.revelationType,
    ayahs: arabic.ayahs.map((ayah, index) => ({
      numberInSurah: ayah.numberInSurah,
      arabic: ayah.text,
      translation: translation.ayahs[index]?.text ?? "",
      audio: audio?.ayahs[index]?.audio ?? "",
    })),
  };
}
