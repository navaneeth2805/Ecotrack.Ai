
-- 1. Restrict profiles SELECT to authenticated users
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (true);

-- 2. Restrict community_posts INSERT to authenticated role explicitly
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='community_posts' AND cmd='INSERT'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.community_posts', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY "Authenticated users insert own posts"
  ON public.community_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Achievements: remove user write access, keep SELECT for owner only
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='achievements'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.achievements', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY "Users view own achievements"
  ON public.achievements FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
-- No INSERT/UPDATE/DELETE policy: only service_role (server-side) can write.
