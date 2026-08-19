import { Loader2, Mic, Send, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LANGUAGES, type AnswerLanguage } from "@/lib/languages";

const CATEGORIES = ["Fasting", "Prayer", "Hadith", "Quran", "General Islamic Guidance"] as const;
type Category = (typeof CATEGORIES)[number];

export function AskPanel() {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState<AnswerLanguage>("English");
  const [category, setCategory] = useState<Category>("General Islamic Guidance");
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!audioBlob) {
      setAudioUrl(null);
      return;
    }
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audioBlob]);

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      toast.error("Voice recording is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setAudioBlob(new Blob(chunksRef.current, { type: recorder.mimeType }));
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      toast.error("Microphone access was not granted.");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  };

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
          if (!user) {
            toast.error("Please sign in before sending a question.");
            return;
          }
          setSubmitting(true);
          void supabase.from("questions").insert({
            user_id: user.id,
            category,
            question: question.trim(),
            language,
            display_name: displayName.trim() || null,
            country: country.trim() || null,
            city: city.trim() || null,
            status: "pending",
          }).select("id").single().then(async ({ data, error }) => {
            if (!error && data && audioBlob) {
              const path = `${user.id}/${data.id}-question.webm`;
              const upload = await supabase.storage.from("question-audio").upload(path, audioBlob, {
                contentType: audioBlob.type || "audio/webm",
                upsert: true,
              });
              if (upload.error) {
                toast.error("Question saved, but the voice recording could not be uploaded.");
              } else {
                const update = await supabase.from("questions").update({ audio_question_path: path }).eq("id", data.id);
                if (update.error) toast.error("Question saved, but its voice recording could not be linked.");
              }
            }
            setSubmitting(false);
            if (error) {
              toast.error(error.message);
              return;
            }
            setQuestion("");
            setAudioBlob(null);
            toast.success("Question sent. Sheikh Hajj Qasim will review it.");
          });
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

        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-border p-3">
          <Button type="button" variant={recording ? "destructive" : "outline"} size="sm" onClick={recording ? stopRecording : () => void startRecording()}>
            {recording ? <Square className="size-4" /> : <Mic className="size-4" />}
            {recording ? "Stop recording" : "Add voice question"}
          </Button>
          {audioUrl ? <audio controls src={audioUrl} className="h-9 min-w-52 flex-1" /> : <span className="text-xs text-muted-foreground">Optional. Record a voice message for the admin.</span>}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Name (optional)" className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Country (optional)" className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City (optional)" className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {user ? "Your question will be reviewed by an authorised admin." : "Sign in to send a question for review."}
          </p>
          <Button type="submit" disabled={submitting} className="min-w-40">
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Send className="size-4" /> Send question
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
