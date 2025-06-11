-- Create fresh database schema for Stan social network

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create helper functions for incrementing/decrementing
CREATE OR REPLACE FUNCTION increment(x integer)
RETURNS integer AS $$
BEGIN
    RETURN x + 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement(x integer)
RETURNS integer AS $$
BEGIN
    RETURN GREATEST(x - 1, 0);
END;
$$ LANGUAGE plpgsql;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  avatar VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Idols table
CREATE TABLE idols (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  followers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-Idol relationship (stanned idols)
CREATE TABLE user_stanned_idols (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  idol_id UUID REFERENCES idols(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, idol_id)
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('image', 'video', 'discussion', 'poll')),
  content TEXT,
  image VARCHAR(255),
  video VARCHAR(255),
  title VARCHAR(255),
  poll_question VARCHAR(255),
  trending_score INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  reposts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  idol_id UUID NOT NULL REFERENCES idols(id) ON DELETE CASCADE
);

-- Poll options table
CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  text VARCHAR(255) NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_posts_trending_score ON posts(trending_score DESC);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_idol_id ON posts(idol_id);
CREATE INDEX idx_user_stanned_idols_user_id ON user_stanned_idols(user_id);
CREATE INDEX idx_user_stanned_idols_idol_id ON user_stanned_idols(idol_id);
CREATE INDEX idx_poll_options_post_id ON poll_options(post_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE idols ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stanned_idols ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read access on idols" ON idols FOR SELECT USING (true);
CREATE POLICY "Allow public read access on user_stanned_idols" ON user_stanned_idols FOR SELECT USING (true);
CREATE POLICY "Allow public read access on posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access on poll_options" ON poll_options FOR SELECT USING (true);
CREATE POLICY "Allow public read access on comments" ON comments FOR SELECT USING (true);

-- Create policies for public write access (for demo purposes)
CREATE POLICY "Allow public insert on users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on users" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on idols" ON idols FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on idols" ON idols FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on user_stanned_idols" ON user_stanned_idols FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on user_stanned_idols" ON user_stanned_idols FOR DELETE USING (true);
CREATE POLICY "Allow public insert on posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on posts" ON posts FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on poll_options" ON poll_options FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on poll_options" ON poll_options FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on comments" ON comments FOR INSERT WITH CHECK (true);

SELECT 'Tables created successfully' as status;
