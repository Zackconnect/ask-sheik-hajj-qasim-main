export type SurahMeta = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

export type Ayah = {
  numberInSurah: number;
  arabic: string;
  translation: string;
  audio: string;
};

export type SurahDetail = SurahMeta & { ayahs: Ayah[] };

export const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Al-Afasy" },
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit (Murattal)" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
  { id: "ar.minshawi", name: "Mohamed Al-Minshawi" },
  { id: "ar.abdurrahmaansudais", name: "Abdurrahman As-Sudais" },
] as const;

export function surahAudioUrl(reciterId: string, surahNumber: number) {
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciterId}/${surahNumber}.mp3`;
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
