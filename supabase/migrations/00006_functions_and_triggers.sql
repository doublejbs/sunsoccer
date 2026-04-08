-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, nickname, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'user_' || substr(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Increment comment_count on articles when a top-level comment is added
CREATE OR REPLACE FUNCTION increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NULL THEN
    UPDATE articles SET comment_count = comment_count + 1 WHERE id = NEW.article_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_created
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION increment_comment_count();

-- Decrement comment_count on articles when a top-level comment is deleted
CREATE OR REPLACE FUNCTION decrement_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.parent_id IS NULL THEN
    UPDATE articles SET comment_count = comment_count - 1 WHERE id = OLD.article_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_deleted
  AFTER DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION decrement_comment_count();

-- Handle vote: insert or update vote, then update comment like/dislike counts
CREATE OR REPLACE FUNCTION handle_vote(
  p_comment_id UUID,
  p_user_id UUID,
  p_vote_type TEXT
)
RETURNS void AS $$
DECLARE
  existing_vote TEXT;
BEGIN
  -- Check for existing vote
  SELECT vote_type INTO existing_vote
  FROM comment_votes
  WHERE comment_id = p_comment_id AND user_id = p_user_id;

  IF existing_vote IS NOT NULL THEN
    -- Remove old vote counts
    IF existing_vote = 'like' THEN
      UPDATE comments SET likes = likes - 1 WHERE id = p_comment_id;
    ELSE
      UPDATE comments SET dislikes = dislikes - 1 WHERE id = p_comment_id;
    END IF;

    IF existing_vote = p_vote_type THEN
      -- Same vote type: toggle off (remove vote)
      DELETE FROM comment_votes WHERE comment_id = p_comment_id AND user_id = p_user_id;
      RETURN;
    ELSE
      -- Different vote type: update
      UPDATE comment_votes SET vote_type = p_vote_type WHERE comment_id = p_comment_id AND user_id = p_user_id;
    END IF;
  ELSE
    -- New vote
    INSERT INTO comment_votes (comment_id, user_id, vote_type) VALUES (p_comment_id, p_user_id, p_vote_type);
  END IF;

  -- Add new vote counts
  IF p_vote_type = 'like' THEN
    UPDATE comments SET likes = likes + 1 WHERE id = p_comment_id;
  ELSE
    UPDATE comments SET dislikes = dislikes + 1 WHERE id = p_comment_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
