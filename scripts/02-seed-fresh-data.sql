-- Seed fresh data for the Stan social network

-- Insert sample users
INSERT INTO users (id, name, username, avatar) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Sarah Johnson', 'sarahj_fan', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000002', 'Alex Chen', 'alexbtstan', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000003', 'Maria Rodriguez', 'maria_arianator', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000004', 'David Kim', 'david_swiftie', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000005', 'Emma Wilson', 'emma_btsarmy', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000006', 'Chris Park', 'chris_edits', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000007', 'Lisa Thompson', 'lisa_polls', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000008', 'Jordan Lee', 'jordan_talks', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000009', 'Maya Patel', 'maya_stan', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000010', 'Ryan Torres', 'ryan_music', '/placeholder.svg?height=32&width=32');

-- Insert sample idols
INSERT INTO idols (id, name, image, category, stans) VALUES
  ('00000000-0000-0000-0000-000000000101', 'Taylor Swift', '/placeholder.svg?height=48&width=48&text=TS', 'Music', 1200000),
  ('00000000-0000-0000-0000-000000000102', 'BTS', '/placeholder.svg?height=48&width=48&text=BTS', 'K-Pop', 2500000),
  ('00000000-0000-0000-0000-000000000103', 'Zendaya', '/placeholder.svg?height=48&width=48&text=Z', 'Acting', 980000),
  ('00000000-0000-0000-0000-000000000104', 'Blackpink', '/placeholder.svg?height=48&width=48&text=BP', 'K-Pop', 1800000),
  ('00000000-0000-0000-0000-000000000105', 'Tom Holland', '/placeholder.svg?height=48&width=48&text=TH', 'Acting', 850000),
  ('00000000-0000-0000-0000-000000000106', 'Ariana Grande', '/placeholder.svg?height=48&width=48&text=AG', 'Music', 1500000),
  ('00000000-0000-0000-0000-000000000107', 'Billie Eilish', '/placeholder.svg?height=48&width=48&text=BE', 'Music', 1100000),
  ('00000000-0000-0000-0000-000000000108', 'Timothée Chalamet', '/placeholder.svg?height=48&width=48&text=TC', 'Acting', 750000),
  ('00000000-0000-0000-0000-000000000109', 'NewJeans', '/placeholder.svg?height=48&width=48&text=NJ', 'K-Pop', 900000),
  ('00000000-0000-0000-0000-000000000110', 'Dua Lipa', '/placeholder.svg?height=48&width=48&text=DL', 'Music', 1300000);

-- Insert user-idol relationships (stanned idols)
INSERT INTO user_stanned_idols (user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000106'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000104'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000106'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000107'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000106'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000103'),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000109'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000110');

-- Insert diverse sample posts with varied trending scores
-- High trending posts (90-100)
INSERT INTO posts (id, type, content, image, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000201', 'video', 'Taylor''s surprise acoustic performance last night was absolutely magical! 🎵✨', '/placeholder.svg?height=400&width=600&text=Taylor+Concert+Video', 98, 2450, 156, 89, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000202', 'image', 'BTS just announced their world tour! Who''s trying to get tickets? I''m already saving up for the VIP experience! 💜', '/placeholder.svg?height=300&width=500&text=BTS+World+Tour', 95, 3024, 256, 187, '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000203', 'poll', 'Which BTS album is your all-time favorite?', NULL, 92, 1890, 234, 67, '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000102');

-- Medium-high trending posts (80-89)
INSERT INTO posts (id, type, content, image, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000204', 'discussion', 'Taylor Swift''s songwriting evolution: From country roots to pop mastery', 'Let''s discuss how Taylor''s songwriting has evolved over the years and what makes her such a compelling storyteller...', 88, 567, 89, 23, '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000205', 'image', 'Ariana''s vocals in her latest album are absolutely insane. The range, the control, the emotion... she''s truly one of the best vocalists of our generation.', '/placeholder.svg?height=300&width=400&text=Ariana+Album', 85, 1578, 143, 129, '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000106'),
  ('00000000-0000-0000-0000-000000000206', 'image', 'Behind the scenes from Zendaya''s latest photoshoot 📸', '/placeholder.svg?height=500&width=400&text=Zendaya+Photoshoot', 83, 1456, 78, 45, '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000103'),
  ('00000000-0000-0000-0000-000000000207', 'video', 'BTS dance practice compilation - their synchronization is unreal! 💜', '/placeholder.svg?height=400&width=600&text=BTS+Dance+Practice', 81, 2100, 145, 78, '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000102');

-- Medium trending posts (70-79)
INSERT INTO posts (id, type, content, image, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000208', 'poll', 'What''s your favorite Ariana Grande era?', NULL, 78, 890, 67, 23, '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000106'),
  ('00000000-0000-0000-0000-000000000209', 'image', 'Taylor''s surprise acoustic set at the end of the concert last night was magical. She played ''All Too Well'' (10 minute version) and I was in tears. Best night ever! ❤️', '/placeholder.svg?height=300&width=500&text=Concert+Moment', 76, 892, 76, 41, '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000210', 'image', 'The choreography in BTS''s new music video is mind-blowing. They never disappoint with their performances. I''ve been trying to learn it all day!', '/placeholder.svg?height=300&width=500&text=BTS+Choreography', 74, 1456, 203, 178, '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000211', 'discussion', 'Zendaya''s impact on young actors and representation in Hollywood', 'How has Zendaya changed the landscape for young actors and what does her success mean for representation...', 72, 445, 123, 34, '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000103');

-- Lower trending posts (60-69)
INSERT INTO posts (id, type, content, image, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000212', 'image', 'Just saw Taylor''s new music video and I''m obsessed! The visuals are incredible and the song is stuck in my head. #Swiftie', '/placeholder.svg?height=300&width=500&text=Taylor+MV', 68, 245, 32, 18, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000213', 'video', 'Billie''s new song hits different. The production is incredible and her vocals are haunting as always.', '/placeholder.svg?height=400&width=600&text=Billie+Music+Video', 66, 1234, 89, 56, '00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000107'),
  ('00000000-0000-0000-0000-000000000214', 'image', 'Tom Holland''s latest movie premiere look is everything! 🔥', '/placeholder.svg?height=400&width=300&text=Tom+Premiere', 64, 678, 45, 23, '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000105'),
  ('00000000-0000-0000-0000-000000000215', 'poll', 'Which Blackpink member has the best solo work?', NULL, 62, 567, 78, 34, '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000104');

-- Insert poll options for the polls
INSERT INTO poll_options (post_id, text, votes) VALUES
  -- BTS album poll
  ('00000000-0000-0000-0000-000000000203', 'Love Yourself: Tear', 1250),
  ('00000000-0000-0000-0000-000000000203', 'Map of the Soul: 7', 980),
  ('00000000-0000-0000-0000-000000000203', 'BE', 756),
  ('00000000-0000-0000-0000-000000000203', 'Wings', 1100),
  
  -- Ariana Grande era poll
  ('00000000-0000-0000-0000-000000000208', 'Sweetener Era', 450),
  ('00000000-0000-0000-0000-000000000208', 'Thank U, Next Era', 680),
  ('00000000-0000-0000-0000-000000000208', 'Positions Era', 320),
  ('00000000-0000-0000-0000-000000000208', 'Eternal Sunshine Era', 290),
  
  -- Blackpink solo work poll
  ('00000000-0000-0000-0000-000000000215', 'Jennie', 234),
  ('00000000-0000-0000-0000-000000000215', 'Rosé', 189),
  ('00000000-0000-0000-0000-000000000215', 'Lisa', 298),
  ('00000000-0000-0000-0000-000000000215', 'Jisoo', 156);

-- Insert some sample comments
INSERT INTO comments (content, post_id, user_id) VALUES
  ('This is absolutely incredible! Taylor never disappoints 😍', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000004'),
  ('I was there and it was magical! Best concert ever!', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000005'),
  ('OMG YES! Already saving up for tickets 💜', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000005'),
  ('BTS world domination continues! So proud of them', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000006'),
  ('Her songwriting is truly unmatched. A modern poet!', '00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000001'),
  ('Ariana''s voice is a gift to humanity 🎵', '00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000007'),
  ('She looks absolutely stunning! 📸✨', '00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000009'),
  ('Their choreography is always on another level!', '00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000002');

SELECT 'Fresh data seeded successfully' as status;
