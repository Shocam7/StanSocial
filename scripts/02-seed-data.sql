-- Seed data for the Stan social network

-- Insert sample users
INSERT INTO users (id, name, username, avatar) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Sarah Johnson', 'sarahj_fan', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000002', 'Alex Chen', 'alexbtstan', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000003', 'Maria Rodriguez', 'maria_arianator', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000004', 'David Kim', 'david_swiftie', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000005', 'Emma Wilson', 'emma_btsarmy', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000006', 'Chris Park', 'chris_edits', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000007', 'Lisa Thompson', 'lisa_polls', '/placeholder.svg?height=32&width=32'),
  ('00000000-0000-0000-0000-000000000008', 'Jordan Lee', 'jordan_talks', '/placeholder.svg?height=32&width=32');

-- Insert sample idols
INSERT INTO idols (id, name, image, category, stans) VALUES
  ('00000000-0000-0000-0000-000000000101', 'Taylor Swift', '/placeholder.svg?height=48&width=48&text=TS', 'Music', 1200000),
  ('00000000-0000-0000-0000-000000000102', 'BTS', '/placeholder.svg?height=48&width=48&text=BTS', 'K-Pop', 2500000),
  ('00000000-0000-0000-0000-000000000103', 'Zendaya', '/placeholder.svg?height=48&width=48&text=Z', 'Acting', 980000),
  ('00000000-0000-0000-0000-000000000104', 'Blackpink', '/placeholder.svg?height=48&width=48&text=BP', 'K-Pop', 1800000),
  ('00000000-0000-0000-0000-000000000105', 'Tom Holland', '/placeholder.svg?height=48&width=48&text=TH', 'Acting', 850000),
  ('00000000-0000-0000-0000-000000000106', 'Ariana Grande', '/placeholder.svg?height=48&width=48&text=AG', 'Music', 1500000);

-- Insert user-idol relationships (stanned idols)
INSERT INTO user_stanned_idols (user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000106'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000106'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000103');

-- Insert sample posts
INSERT INTO posts (id, type, content, image, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000201', 'image', 'Just saw Taylor''s new music video and I''m obsessed! The visuals are incredible and the song is stuck in my head. #Swiftie', NULL, 90, 245, 32, 18, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101');

INSERT INTO posts (id, type, content, image, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000202', 'image', 'BTS just announced their world tour! Who''s trying to get tickets? I''m already saving up for the VIP experience! 💜', '/placeholder.svg?height=300&width=500&text=BTS+World+Tour', 95, 1024, 156, 87, '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000102');

INSERT INTO posts (id, type, content, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000203', 'image', 'Ariana''s vocals in her latest album are absolutely insane. The range, the control, the emotion... she''s truly one of the best vocalists of our generation.', 82, 578, 43, 29, '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000106');

INSERT INTO posts (id, type, content, image, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000204', 'image', 'Taylor''s surprise acoustic set at the end of the concert last night was magical. She played ''All Too Well'' (10 minute version) and I was in tears. Best night ever! ❤️', '/placeholder.svg?height=300&width=500&text=Concert+Moment', 88, 892, 76, 41, '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000101');

INSERT INTO posts (id, type, content, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000205', 'image', 'The choreography in BTS''s new music video is mind-blowing. They never disappoint with their performances. I''ve been trying to learn it all day!', 85, 1456, 203, 178, '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000102');

-- Insert video posts
INSERT INTO posts (id, type, content, video, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000206', 'video', 'Taylor''s surprise acoustic performance last night was absolutely magical! 🎵✨', '/placeholder.svg?height=400&width=600&text=Taylor+Concert+Video', 95, 2450, 156, 89, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101');

INSERT INTO posts (id, type, content, video, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000207', 'video', 'BTS dance practice compilation - their synchronization is unreal! 💜', '/placeholder.svg?height=400&width=600&text=BTS+Dance+Practice', 78, 2100, 145, 78, '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000102');

-- Insert discussion posts
INSERT INTO posts (id, type, title, content, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000208', 'discussion', 'Taylor Swift''s songwriting evolution: From country roots to pop mastery', 'Let''s discuss how Taylor''s songwriting has evolved over the years...', 92, 567, 89, 23, '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000101');

INSERT INTO posts (id, type, title, content, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000209', 'discussion', 'Zendaya''s impact on young actors and representation in Hollywood', 'How has Zendaya changed the landscape for young actors...', 70, 445, 123, 34, '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000103');

-- Insert poll posts
INSERT INTO posts (id, type, poll_question, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000210', 'poll', 'Which BTS album is your all-time favorite?', 88, 1890, 234, 67, '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000102');

INSERT INTO poll_options (post_id, text, votes) VALUES
  ('00000000-0000-0000-0000-000000000210', 'Love Yourself: Tear', 1250),
  ('00000000-0000-0000-0000-000000000210', 'Map of the Soul: 7', 980),
  ('00000000-0000-0000-0000-000000000210', 'BE', 756),
  ('00000000-0000-0000-0000-000000000210', 'Wings', 1100);

INSERT INTO posts (id, type, poll_question, trending_score, likes, comments, reposts, user_id, idol_id) VALUES
  ('00000000-0000-0000-0000-000000000211', 'poll', 'What''s your favorite Ariana Grande era?', 75, 890, 67, 23, '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000106');

INSERT INTO poll_options (post_id, text, votes) VALUES
  ('00000000-0000-0000-0000-000000000211', 'Sweetener Era', 450),
  ('00000000-0000-0000-0000-000000000211', 'Thank U, Next Era', 680),
  ('00000000-0000-0000-0000-000000000211', 'Positions Era', 320),
  ('00000000-0000-0000-0000-000000000211', 'Eternal Sunshine Era', 290);
