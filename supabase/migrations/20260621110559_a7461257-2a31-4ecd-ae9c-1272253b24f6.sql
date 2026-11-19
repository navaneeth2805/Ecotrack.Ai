
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  eco_points INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)), NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Carbon entries
CREATE TABLE public.carbon_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  category TEXT NOT NULL,
  subcategory TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  unit TEXT,
  co2_kg NUMERIC NOT NULL DEFAULT 0,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.carbon_entries TO authenticated;
GRANT ALL ON public.carbon_entries TO service_role;
ALTER TABLE public.carbon_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own entries" ON public.carbon_entries FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Goals
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC NOT NULL DEFAULT 100,
  current_value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT DEFAULT '%',
  status TEXT NOT NULL DEFAULT 'active',
  deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT ALL ON public.goals TO service_role;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own goals" ON public.goals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Challenges (public catalog)
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  xp_reward INT NOT NULL DEFAULT 100,
  duration_days INT NOT NULL DEFAULT 7,
  icon TEXT,
  difficulty TEXT DEFAULT 'easy',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.challenges TO anon, authenticated;
GRANT ALL ON public.challenges TO service_role;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Challenges public read" ON public.challenges FOR SELECT USING (true);

-- User challenges
CREATE TABLE public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  progress INT NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, challenge_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_challenges TO authenticated;
GRANT ALL ON public.user_challenges TO service_role;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own challenge progress" ON public.user_challenges FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Community posts
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts viewable by all signed in" ON public.community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- Comments
CREATE TABLE public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO service_role;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments viewable by signed in" ON public.post_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own comments" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own comments" ON public.post_comments FOR DELETE USING (auth.uid() = user_id);

-- Likes
CREATE TABLE public.post_likes (
  post_id UUID NOT NULL REFERENCES public.community_posts ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(post_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.post_likes TO authenticated;
GRANT ALL ON public.post_likes TO service_role;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes viewable" ON public.post_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users like" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unlike" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- Achievements
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  badge_icon TEXT,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own achievements" ON public.achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own achievements" ON public.achievements FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Seed challenges
INSERT INTO public.challenges (title, description, category, xp_reward, duration_days, icon, difficulty) VALUES
('7-Day Plastic-Free Challenge', 'Eliminate single-use plastics for a full week.', 'lifestyle', 500, 7, 'Recycle', 'medium'),
('Walk Instead of Drive', 'Replace 5 car trips with walking this week.', 'transport', 300, 7, 'Footprints', 'easy'),
('Energy Saving Week', 'Reduce home electricity usage by 20%.', 'energy', 400, 7, 'Zap', 'medium'),
('Tree Planting Mission', 'Plant or sponsor 3 trees this month.', 'nature', 800, 30, 'TreePine', 'hard'),
('Meatless Mondays', 'Go vegetarian every Monday for a month.', 'food', 250, 30, 'Salad', 'easy'),
('Public Transport Pro', 'Use public transport 10 times in 2 weeks.', 'transport', 350, 14, 'Bus', 'medium');
