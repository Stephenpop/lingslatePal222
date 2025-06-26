-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own translations" ON public.translations;
DROP POLICY IF EXISTS "Users can insert own translations" ON public.translations;
DROP POLICY IF EXISTS "Anonymous users can insert translations" ON public.translations;
DROP POLICY IF EXISTS "Anyone can view published lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_lesson_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_lesson_progress;
DROP POLICY IF EXISTS "Anyone can view quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Users can view own attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can insert own attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.achievements;
DROP POLICY IF EXISTS "Admins can manage achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can view own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "System can award achievements" ON public.user_achievements;

-- RLS Policies
-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles 
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

-- Translations
CREATE POLICY "Users can view own translations" ON public.translations 
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own translations" ON public.translations 
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Lessons (public read, admin write)
CREATE POLICY "Anyone can view published lessons" ON public.lessons 
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage lessons" ON public.lessons 
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

-- User lesson progress
CREATE POLICY "Users can view own progress" ON public.user_lesson_progress 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" ON public.user_lesson_progress 
    FOR ALL USING (auth.uid() = user_id);

-- Quizzes (public read)
CREATE POLICY "Anyone can view quizzes" ON public.quizzes 
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage quizzes" ON public.quizzes 
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

-- Quiz attempts
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON public.quiz_attempts 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements (public read)
CREATE POLICY "Anyone can view achievements" ON public.achievements 
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage achievements" ON public.achievements 
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

-- User achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON public.user_achievements 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can award achievements" ON public.user_achievements 
    FOR INSERT WITH CHECK (true);
