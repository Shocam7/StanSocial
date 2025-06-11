-- Verify the database setup and data

-- Check table counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'idols' as table_name, COUNT(*) as count FROM idols
UNION ALL
SELECT 'user_stanned_idols' as table_name, COUNT(*) as count FROM user_stanned_idols
UNION ALL
SELECT 'posts' as table_name, COUNT(*) as count FROM posts
UNION ALL
SELECT 'poll_options' as table_name, COUNT(*) as count FROM poll_options
UNION ALL
SELECT 'comments' as table_name, COUNT(*) as count FROM comments;

-- Check trending scores distribution
SELECT 
  CASE 
    WHEN trending_score >= 90 THEN '90-100 (High)'
    WHEN trending_score >= 80 THEN '80-89 (Medium-High)'
    WHEN trending_score >= 70 THEN '70-79 (Medium)'
    WHEN trending_score >= 60 THEN '60-69 (Lower)'
    ELSE 'Below 60'
  END as trending_range,
  COUNT(*) as post_count
FROM posts 
GROUP BY 
  CASE 
    WHEN trending_score >= 90 THEN '90-100 (High)'
    WHEN trending_score >= 80 THEN '80-89 (Medium-High)'
    WHEN trending_score >= 70 THEN '70-79 (Medium)'
    WHEN trending_score >= 60 THEN '60-69 (Lower)'
    ELSE 'Below 60'
  END
ORDER BY MIN(trending_score) DESC;

-- Check post types distribution
SELECT type, COUNT(*) as count FROM posts GROUP BY type ORDER BY count DESC;

-- Check idol categories
SELECT category, COUNT(*) as idol_count FROM idols GROUP BY category ORDER BY idol_count DESC;

-- Check stanned relationships
SELECT 
  i.name as idol_name,
  COUNT(usi.user_id) as stan_count
FROM idols i
LEFT JOIN user_stanned_idols usi ON i.id = usi.idol_id
GROUP BY i.id, i.name
ORDER BY stan_count DESC;

-- Sample of posts with trending scores
SELECT 
  p.type,
  p.trending_score,
  LEFT(COALESCE(p.content, p.title, p.poll_question), 50) || '...' as preview,
  i.name as idol_name,
  u.name as user_name
FROM posts p
JOIN idols i ON p.idol_id = i.id
JOIN users u ON p.user_id = u.id
ORDER BY p.trending_score DESC
LIMIT 10;

SELECT 'Database verification completed' as status;
