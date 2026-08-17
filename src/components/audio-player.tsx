import { Pause, Play, Volume2, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Slider } from "@/components/ui/slider";
import { RECITERS, formatTime, surahAudioUrl } from "@/lib/quran";

type Track = { surahNumber: number; title: string; subtitle: string };

type AudioState = {
  track: Track | null;
  playing: boolean;
  reciter: string;
  setReciter: (id: string) => void;
  playSurah: (track: Track) => void;
  toggle: () => void;
  stop: () => void;
};

const AudioContext = createContext<AudioState | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [reciter, setReciterState] = useState<string>(RECITERS[0].id);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);

  useEffect(() => {
    const stored = window.localStorage.getItem("reciter");
    if (stored && RECITERS.some((r) => r.id === stored)) setReciterState(stored);
  }, []);

  const load = useCallback(
    (surahNumber: number, reciterId: string, autoplay: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.src = surahAudioUrl(reciterId, surahNumber);
      audio.volume = volume;
      if (autoplay) void audio.play().catch(() => setPlaying(false));
    },
    [volume],
  );

  const playSurah = useCallback(
    (next: Track) => {
      setTrack(next);
      load(next.surahNumber, reciter, true);
    },
    [load, reciter],
  );

  const setReciter = useCallback(
    (id: string) => {
      setReciterState(id);
      window.localStorage.setItem("reciter", id);
      if (track) load(track.surahNumber, id, playing);
    },
    [track, playing, load],
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (audio.paused) void audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [track]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setTrack(null);
    setPlaying(false);
  }, []);

  const value = useMemo<AudioState>(
    () => ({ track, playing, reciter, setReciter, playSurah, toggle, stop }),
    [track, playing, reciter, setReciter, playSurah, toggle, stop],
  );

  const reciterName = RECITERS.find((r) => r.id === reciter)?.name ?? "";

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      />
      {track ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/40 bg-primary text-primary-foreground shadow-raised">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "Pause recitation" : "Play recitation"}
                className="grid size-12 shrink-0 place-items-center rounded-full bg-gold text-primary-deep transition-transform active:scale-95"
              >
                {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
              </button>
              <div className="min-w-0">
                <p className="truncate font-display text-base leading-tight">{track.title}</p>
                <p className="truncate text-xs text-primary-foreground/70">
                  {track.subtitle} · {reciterName}
                </p>
              </div>
              <button
                type="button"
                onClick={stop}
                aria-label="Close player"
                className="ml-auto grid size-9 place-items-center rounded-full bg-primary-foreground/10 sm:hidden"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex flex-1 items-center gap-3">
              <span className="w-10 text-right text-xs tabular-nums text-primary-foreground/70">
                {formatTime(progress)}
              </span>
              <Slider
                value={[duration ? (progress / duration) * 100 : 0]}
                max={100}
                step={0.1}
                aria-label="Track progress"
                onValueChange={([next]) => {
                  const audio = audioRef.current;
                  if (audio && duration) audio.currentTime = ((next ?? 0) / 100) * duration;
                }}
              />
              <span className="w-10 text-xs tabular-nums text-primary-foreground/70">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={reciter}
                onChange={(event) => setReciter(event.target.value)}
                aria-label="Select reciter"
                className="rounded-md border border-primary-foreground/25 bg-primary-deep px-2 py-1.5 text-xs text-primary-foreground"
              >
                {RECITERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <div className="hidden items-center gap-2 sm:flex">
                <Volume2 className="size-4 shrink-0" />
                <div className="w-20">
                  <Slider
                    value={[volume * 100]}
                    max={100}
                    aria-label="Volume"
                    onValueChange={([next]) => {
                      const level = (next ?? 0) / 100;
                      setVolume(level);
                      if (audioRef.current) audioRef.current.volume = level;
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={stop}
                aria-label="Close player"
                className="hidden size-9 place-items-center rounded-full bg-primary-foreground/10 sm:grid"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used inside AudioProvider");
  return ctx;
}
