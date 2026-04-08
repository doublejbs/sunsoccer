-- profiles: anyone can read, owners can update their own
CREATE POLICY "profiles_select_all" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- articles: anyone can read, only service_role can insert/update (Edge Functions)
CREATE POLICY "articles_select_all" ON articles
  FOR SELECT USING (true);

-- comments: anyone can read, authenticated users can insert their own
CREATE POLICY "comments_select_all" ON comments
  FOR SELECT USING (true);

CREATE POLICY "comments_insert_auth" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_delete_own" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- comment_votes: anyone can read, authenticated users can manage their own
CREATE POLICY "comment_votes_select_all" ON comment_votes
  FOR SELECT USING (true);

CREATE POLICY "comment_votes_insert_auth" ON comment_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comment_votes_delete_own" ON comment_votes
  FOR DELETE USING (auth.uid() = user_id);
