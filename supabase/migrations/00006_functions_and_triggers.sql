-- Generate fun random Korean nickname
CREATE OR REPLACE FUNCTION generate_random_nickname()
RETURNS TEXT AS $$
DECLARE
  adjectives TEXT[] := ARRAY[
    '빠른', '용감한', '행복한', '멋진', '강한',
    '밝은', '신나는', '대단한', '열정의', '전설의',
    '화려한', '날카로운', '거친', '냉정한', '뜨거운',
    '위대한', '무적의', '최강의', '불꽃', '번개'
  ];
  nouns TEXT[] := ARRAY[
    '스트라이커', '골키퍼', '미드필더', '수비수', '감독',
    '팬', '서포터', '캡틴', '에이스', '루키',
    '드리블러', '슈터', '해결사', '사령탑', '철벽',
    '축구왕', '골잡이', '패서', '윙어', '플레이어'
  ];
  nickname TEXT;
  attempts INT := 0;
BEGIN
  LOOP
    nickname := adjectives[1 + floor(random() * array_length(adjectives, 1))::int]
      || nouns[1 + floor(random() * array_length(nouns, 1))::int]
      || floor(random() * 1000)::text;
    -- Check uniqueness
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE public.profiles.nickname = generate_random_nickname.nickname);
    attempts := attempts + 1;
    EXIT WHEN attempts > 10;
  END LOOP;
  RETURN nickname;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_url)
  VALUES (
    NEW.id,
    generate_random_nickname(),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
EXCEPTION WHEN unique_violation THEN
  INSERT INTO public.profiles (id, nickname, avatar_url)
  VALUES (
    NEW.id,
    '축구팬' || floor(random() * 99999)::text,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
    UPDATE articles SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.article_id;
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
  -- Verify the caller is the user they claim to be
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: user ID mismatch';
  END IF;

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
