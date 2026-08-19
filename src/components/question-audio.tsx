import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export function QuestionAudio({ path, label }: { path: string | null; label: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!path) {
      setUrl(null);
      return;
    }
    void supabase.storage.from("question-audio").createSignedUrl(path, 3600).then(({ data }) => {
      if (active) setUrl(data?.signedUrl ?? null);
    });
    return () => {
      active = false;
    };
  }, [path]);

  if (!path || !url) return null;

  return (
    <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      <audio controls preload="metadata" src={url} className="h-9 w-full" />
    </div>
  );
}
