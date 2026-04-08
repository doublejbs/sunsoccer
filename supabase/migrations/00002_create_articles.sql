CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  link TEXT UNIQUE NOT NULL,
  league TEXT NOT NULL DEFAULT 'all',
  pub_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  comment_count INT DEFAULT 0 NOT NULL
);

CREATE INDEX idx_articles_league ON articles(league);
CREATE INDEX idx_articles_pub_date ON articles(pub_date DESC);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
