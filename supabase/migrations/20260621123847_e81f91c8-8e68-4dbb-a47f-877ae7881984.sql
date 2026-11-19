
ALTER TABLE public.carbon_entries ADD COLUMN IF NOT EXISTS is_sample boolean NOT NULL DEFAULT false;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS is_sample boolean NOT NULL DEFAULT false;
ALTER TABLE public.user_challenges ADD COLUMN IF NOT EXISTS is_sample boolean NOT NULL DEFAULT false;

UPDATE public.carbon_entries SET is_sample = true;
UPDATE public.goals SET is_sample = true;
UPDATE public.user_challenges SET is_sample = true;

CREATE INDEX IF NOT EXISTS carbon_entries_user_sample_idx ON public.carbon_entries (user_id, is_sample);
CREATE INDEX IF NOT EXISTS goals_user_sample_idx ON public.goals (user_id, is_sample);
CREATE INDEX IF NOT EXISTS user_challenges_user_sample_idx ON public.user_challenges (user_id, is_sample);
