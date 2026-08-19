import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Mic, ShieldAlert, Square, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { QuestionAudio } from "@/components/question-audio";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Sheikh Hajj Qasim" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Question = {
  id: string;
  user_id: string;
  category: string;
  question: string;
  answer: string | null;
  language: string;
  display_name: string | null;
  country: string | null;
  city: string | null;
  status: "pending" | "answered" | "closed";
  created_at: string;
  audio_question_path: string | null;
  audio_answer_path: string | null;
};

function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [audioDrafts, setAudioDrafts] = useState<Record<string, Blob>>({});
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const questions = useQuery({
    queryKey: ["admin-questions"],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("id, user_id, category, question, answer, language, display_name, country, city, status, created_at, audio_question_path, audio_answer_path")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Question[];
    },
  });

  const saveAnswer = async (item: Question) => {
    const answer = drafts[item.id]?.trim();
    const audio = audioDrafts[item.id];
    if (!answer && !audio) {
      toast.error("Write an answer or add a voice reply before saving.");
      return;
    }
    let audioAnswerPath = item.audio_answer_path;
    if (audio) {
      audioAnswerPath = `${item.user_id}/${item.id}-answer.webm`;
      const upload = await supabase.storage.from("question-audio").upload(audioAnswerPath, audio, {
        contentType: audio.type || "audio/webm",
        upsert: true,
      });
      if (upload.error) {
        toast.error(upload.error.message);
        return;
      }
    }
    const { error } = await supabase
      .from("questions")
      .update({ answer: answer || null, audio_answer_path: audioAnswerPath, status: "answered", answered_by: user?.id, answered_at: new Date().toISOString() })
      .eq("id", item.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    toast.success("Answer published to the user dashboard.");
  };

  const startRecording = async (questionId: string) => {
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
        setAudioDrafts((current) => ({ ...current, [questionId]: new Blob(chunksRef.current, { type: recorder.mimeType }) }));
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecordingId(questionId);
    } catch {
      toast.error("Microphone access was not granted.");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecordingId(null);
  };

  if (!user || questions.isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-20 text-center text-muted-foreground">Loading admin dashboard…</div>;
  }

  if (questions.isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShieldAlert className="mx-auto size-10 text-destructive" />
        <h1 className="mt-4 font-display text-2xl text-primary">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your account is not authorised to view this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Restricted workspace</p>
      <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">Admin Dashboard</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Review incoming questions and publish careful answers. AI answering is disabled; every response is written by an authorised admin.
      </p>
      <div className="gold-rule mt-5 w-24" />

      <div className="mt-10 space-y-5">
        {questions.data?.length ? questions.data.map((item) => {
          const draft = drafts[item.id] ?? item.answer ?? "";
          return (
            <article key={item.id} className="card-elevated p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-accent px-3 py-1 uppercase tracking-[0.12em] text-primary">{item.category}</span>
                <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">{item.status}</span>
                <span className="text-muted-foreground">{new Date(item.created_at).toLocaleString()}</span>
              </div>
              <h2 className="mt-5 font-display text-xl text-primary">{item.question}</h2>
              <p className="mt-3 text-xs text-muted-foreground">
                Requested language: {item.language} · {item.display_name || "Anonymous"}
                {item.city || item.country ? ` · ${[item.city, item.country].filter(Boolean).join(", ")}` : ""}
              </p>
              <QuestionAudio path={item.audio_question_path} label="User voice question" />
              <Textarea
                value={draft}
                onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: event.target.value }))}
                rows={6}
                placeholder="Write the answer for this person..."
                className="mt-5 resize-y bg-background"
              />
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-border p-3">
                <Button type="button" variant={recordingId === item.id ? "destructive" : "outline"} size="sm" onClick={recordingId === item.id ? stopRecording : () => void startRecording(item.id)}>
                  {recordingId === item.id ? <Square className="size-4" /> : <Mic className="size-4" />}
                  {recordingId === item.id ? "Stop reply" : "Record voice reply"}
                </Button>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-xs font-medium hover:bg-accent">
                  <Upload className="size-4" /> Upload audio
                  <input type="file" accept="audio/*" className="sr-only" onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) setAudioDrafts((current) => ({ ...current, [item.id]: file }));
                  }} />
                </label>
                {audioDrafts[item.id] ? <span className="text-xs text-muted-foreground">Voice reply ready</span> : null}
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => void saveAnswer(item)} disabled={item.status === "answered" && draft === item.answer}>
                  {item.status === "answered" ? <CheckCircle2 className="size-4" /> : <Loader2 className="size-4" />}
                  {item.status === "answered" ? "Update answer" : "Publish answer"}
                </Button>
              </div>
            </article>
          );
        }) : (
          <div className="card-elevated p-10 text-center text-sm text-muted-foreground">No questions in the queue.</div>
        )}
      </div>
    </div>
  );
}
