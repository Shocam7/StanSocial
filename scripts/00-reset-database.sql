-- Reset database by dropping all tables and extensions
-- This will completely clean the database

-- Drop all tables in the correct order (respecting foreign key constraints)
-- Using IF EXISTS to avoid errors if tables don't exist
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS poll_options CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS user_stanned_idols CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS idols CASCADE;

-- Drop any existing policies (using DO block to handle errors gracefully)
DO $$ 
BEGIN
    -- Drop policies if they exist
    DROP POLICY IF EXISTS "Allow public read access on users" ON users;
    DROP POLICY IF EXISTS "Allow public read access on idols" ON idols;
    DROP POLICY IF EXISTS "Allow public read access on user_stanned_idols" ON user_stanned_idols;
    DROP POLICY IF EXISTS "Allow public read access on posts" ON posts;
    DROP POLICY IF EXISTS "Allow public read access on poll_options" ON poll_options;
    DROP POLICY IF EXISTS "Allow public read access on comments" ON comments;
    
    DROP POLICY IF EXISTS "Allow public insert on users" ON users;
    DROP POLICY IF EXISTS "Allow public update on users" ON users;
    DROP POLICY IF EXISTS "Allow public insert on idols" ON idols;
    DROP POLICY IF EXISTS "Allow public update on idols" ON idols;
    DROP POLICY IF EXISTS "Allow public insert on user_stanned_idols" ON user_stanned_idols;
    DROP POLICY IF EXISTS "Allow public delete on user_stanned_idols" ON user_stanned_idols;
    DROP POLICY IF EXISTS "Allow public insert on posts" ON posts;
    DROP POLICY IF EXISTS "Allow public update on posts" ON posts;
    DROP POLICY IF EXISTS "Allow public insert on poll_options" ON poll_options;
    DROP POLICY IF EXISTS "Allow public update on poll_options" ON poll_options;
    DROP POLICY IF EXISTS "Allow public insert on comments" ON comments;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors if policies don't exist
        NULL;
END $$;

-- Drop any existing functions
DROP FUNCTION IF EXISTS increment(integer);
DROP FUNCTION IF EXISTS decrement(integer);

-- Drop any existing indexes
DROP INDEX IF EXISTS idx_posts_trending_score;
DROP INDEX IF EXISTS idx_posts_created_at;
DROP INDEX IF EXISTS idx_posts_user_id;
DROP INDEX IF EXISTS idx_posts_idol_id;
DROP INDEX IF EXISTS idx_user_stanned_idols_user_id;
DROP INDEX IF EXISTS idx_user_stanned_idols_idol_id;
DROP INDEX IF EXISTS idx_poll_options_post_id;
DROP INDEX IF EXISTS idx_comments_post_id;

-- Clean up any remaining objects
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop any remaining tables that might exist
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%stan%') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Reset is complete
SELECT 'Database reset completed successfully - ready for fresh setup' as status;
