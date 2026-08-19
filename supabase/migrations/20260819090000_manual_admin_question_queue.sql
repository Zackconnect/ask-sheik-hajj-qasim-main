ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'admin'));

ALTER TABLE public.questions
  ALTER COLUMN answer DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'English',
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'answered', 'closed')),
  ADD COLUMN IF NOT EXISTS answered_by UUID REFERENCES auth.users ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS answered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS audio_question_path TEXT,
  ADD COLUMN IF NOT EXISTS audio_answer_path TEXT;

CREATE INDEX IF NOT EXISTS questions_status_created_at_idx
  ON public.questions (status, created_at DESC);

CREATE POLICY "questions_admin_access" ON public.questions
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "profiles_admin_read" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    auth.uid() = id OR EXISTS (
      SELECT 1 FROM public.profiles AS admin_profile
      WHERE admin_profile.id = auth.uid() AND admin_profile.role = 'admin'
    )
  );

INSERT INTO storage.buckets (id, name, public)
VALUES ('question-audio', 'question-audio', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "question_audio_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'question-audio' AND (
      (storage.foldername(name))[1] = auth.uid()::text OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    )
  );

CREATE POLICY "question_audio_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'question-audio' AND (
      (storage.foldername(name))[1] = auth.uid()::text OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    )
  );

CREATE POLICY "question_audio_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'question-audio' AND (
      (storage.foldername(name))[1] = auth.uid()::text OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    )
  );
