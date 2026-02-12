-- ============================
-- CATEGORIES
-- ============================
INSERT INTO CATEGORIES (NAME, DESCRIPTION)
VALUES ('Technology', 'Latest trends in technology and innovation'),
       ('Programming', 'Code, best practices, and software craftsmanship'),
       ('Gaming', 'Game reviews, news, and industry insights'),
       ('Lifestyle', 'Habits, routines, and personal growth'),
       ('Productivity', 'Getting more done with less stress'),
       ('Sports', 'Sports news, analysis, and commentary'),
       ('Travel', 'Stories and tips from around the world'),
       ('Food', 'Recipes, restaurants, and culinary experiments'),
       ('Photography', 'Capturing moments and visual storytelling'),
       ('Business', 'Startups, strategy, and entrepreneurship'),
       ('Finance', 'Money, investing, and financial literacy'),
       ('Health', 'Fitness, wellbeing, and mental health'),
       ('Music', 'Albums, artists, and playlists'),
       ('Movies', 'Cinema, reviews, and recommendations'),
       ('Books', 'Reading lists, reviews, and summaries'),
       ('Science', 'Discoveries, research, and curiosity'),
       ('Education', 'Learning, teaching, and skills'),
       ('Design', 'UI, UX, and visual design'),
       ('DevOps', 'Infrastructure, CI/CD, and reliability'),
       ('AI & ML', 'Artificial intelligence and machine learning');

-- ============================
-- PERSONS
-- ============================
INSERT INTO PERSONS (EMAIL, NAME)
VALUES ('admin@blog.com', 'Admin User'),
       ('john.doe@example.com', 'John Doe'),
       ('sarah.connor@example.com', 'Sarah Connor'),
       ('maria.silva@example.com', 'Maria Silva'),
       ('tiago.ferreira@example.com', 'Tiago Ferreira'),
       ('ana.costa@example.com', 'Ana Costa'),
       ('pedro.sousa@example.com', 'Pedro Sousa'),
       ('joana.lopes@example.com', 'Joana Lopes'),
       ('ricardo.mendes@example.com', 'Ricardo Mendes'),
       ('ines.rocha@example.com', 'Ines Rocha'),
       ('miguel.pereira@example.com', 'Miguel Pereira'),
       ('sofia.almeida@example.com', 'Sofia Almeida'),
       ('carlos.ramos@example.com', 'Carlos Ramos'),
       ('beatriz.gomes@example.com', 'Beatriz Gomes'),
       ('rui.monteiro@example.com', 'Rui Monteiro'),
       ('patricia.fonseca@example.com', 'Patricia Fonseca'),
       ('luis.teixeira@example.com', 'Luis Teixeira'),
       ('diana.matos@example.com', 'Diana Matos'),
       ('andre.cardoso@example.com', 'Andre Cardoso'),
       ('vera.neves@example.com', 'Vera Neves'),
       ('joao.pinto@example.com', 'Joao Pinto'),
       ('carla.oliveira@example.com', 'Carla Oliveira'),
       ('bruno.machado@example.com', 'Bruno Machado'),
       ('filipa.santos@example.com', 'Filipa Santos'),
       ('nuno.barbosa@example.com', 'Nuno Barbosa'),
       ('clara.morais@example.com', 'Clara Morais'),
       ('hugo.lima@example.com', 'Hugo Lima'),
       ('raquel.vieira@example.com', 'Raquel Vieira'),
       ('diogo.correia@example.com', 'Diogo Correia'),
       ('lara.freitas@example.com', 'Lara Freitas');

-- ============================
-- USERS (password: "password123" for all, BCrypt)
-- ============================
-- Example hash (you can replace with your own if you prefer)
-- $2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG
INSERT INTO USERS (USER_NAME, PASSWORD, PERSON_ID, ROLE)
VALUES ('admin', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 1, 'ADMIN'),
       ('john',  '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 2, 'USER'),
       ('sarah', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 3, 'USER'),
       ('maria', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 4, 'USER'),
       ('tiago', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 5, 'USER'),
       ('ana',   '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 6, 'USER'),
       ('pedro', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 7, 'USER'),
       ('joana', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 8, 'USER'),
       ('ricardo', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 9, 'USER'),
       ('ines', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 10, 'USER'),
       ('miguel', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 11, 'USER'),
       ('sofia', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 12, 'USER'),
       ('carlos', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 13, 'USER'),
       ('beatriz', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 14, 'USER'),
       ('rui', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 15, 'USER'),
       ('patricia', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 16, 'USER'),
       ('luis', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 17, 'USER'),
       ('diana', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 18, 'USER'),
       ('andre', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 19, 'USER'),
       ('vera', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 20, 'USER'),
       ('joao', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 21, 'USER'),
       ('carla', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 22, 'USER'),
       ('bruno', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 23, 'USER'),
       ('filipa', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 24, 'USER'),
       ('nuno', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 25, 'USER'),
       ('clara', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 26, 'USER'),
       ('hugo', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 27, 'USER'),
       ('raquel', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 28, 'USER'),
       ('diogo', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 29, 'USER'),
       ('lara', '$2a$10$qw6oyXq4pT43fYMZE6QfK.EcRwmRgG41lrsjyELf1Iu8jZfjX9EjG', 30, 'USER');

-- ============================
-- POSTS (40 realistic posts)
-- ============================
INSERT INTO POSTS (CONTENT, CREATED_AT, UPDATED_AT, IMAGE_URL, STATUS, TITLE, AUTHOR_ID)
VALUES
    ('An overview of how AI is changing software development and daily life.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1518770660439-4636190af475', 'PUBLISHED', 'The Future of AI in Everyday Life', 1),

    ('My favorite VSCode extensions that boost productivity as a developer.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1518770660439-4636190af475', 'PUBLISHED', 'Top 10 VSCode Extensions for Developers', 2),

    ('Simple habits that helped me stay productive while working remotely.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'PUBLISHED', 'How to Stay Productive Working From Home', 3),

    ('A deep dive into Elden Ring and why it might be game of the decade.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1511512578047-dfb367046420', 'PUBLISHED', 'Elden Ring: A Masterpiece Review', 2),

    ('Tips and tricks to get started with Spring Boot and REST APIs.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1518770660439-4636190af475', 'PUBLISHED', 'Getting Started with Spring Boot', 5),

    ('How to structure your day to get more done with less stress.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'PUBLISHED', 'Designing a Productive Daily Routine', 4),

    ('A guide to building your first REST API with proper error handling.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1518770660439-4636190af475', 'PUBLISHED', 'Building a Robust REST API', 1),

    ('My experience traveling through Japan and what I learned.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', 'PUBLISHED', 'What Japan Taught Me About Minimalism', 6),

    ('A breakdown of the latest Champions League matches.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1517649763962-0c623066013b', 'PUBLISHED', 'Champions League: This Week''s Highlights', 7),

    ('How to start investing even if you think you have no money.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', 'PUBLISHED', 'Investing for Beginners on a Low Budget', 8),

    ('My favorite coffee spots in Porto and why I love them.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1509042239860-f550ce710b93', 'PUBLISHED', 'Best Coffee Shops in Porto', 5),

    ('How I organize my notes using Notion and tags.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'PUBLISHED', 'Organizing Your Life with Notion', 9),

    ('A simple explanation of machine learning for non-technical people.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1518770660439-4636190af475', 'PUBLISHED', 'Machine Learning Explained Simply', 10),

    ('Why sleep is the most underrated productivity tool.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'PUBLISHED', 'Sleep: The Ultimate Productivity Hack', 11),

    ('My favorite books that changed how I think about work.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1512820790803-83ca734da794', 'PUBLISHED', 'Books That Changed My Career', 12),

    ('How to start running even if you hate running.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1526402461234-4f3c4a8bcd9b', 'PUBLISHED', 'From Couch to 5K: My Running Journey', 13),

    ('A guide to taking better photos with your phone.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1516031190212-da133013de50', 'PUBLISHED', 'Taking Better Photos with Your Phone', 14),

    ('How to design a simple and clean landing page.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', 'PUBLISHED', 'Designing Clean Landing Pages', 15),

    ('Why DevOps is more about culture than tools.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1518770660439-4636190af475', 'PUBLISHED', 'DevOps: Culture Over Tools', 16),

    ('How AI is changing the way we search for information.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1518770660439-4636190af475', 'PUBLISHED', 'AI and the Future of Search', 1),

    ('My favorite productivity apps and how I use them.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'PUBLISHED', 'Productivity Apps I Actually Use', 17),

    ('What I learned from failing my first startup.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', 'PUBLISHED', 'Lessons from a Failed Startup', 18),

    ('How to cook simple meals when you''re always busy.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 'PUBLISHED', 'Cooking Simple Meals on Busy Days', 19),

    ('Why journaling every day changed my mindset.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'PUBLISHED', 'Daily Journaling: A Game Changer', 20),

    ('A breakdown of my current workout routine.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c', 'PUBLISHED', 'My Simple Workout Routine', 21),

    ('How to learn faster using spaced repetition.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'PUBLISHED', 'Learning Faster with Spaced Repetition', 22),

    ('Why side projects are the best way to learn.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1518770660439-4636190af475', 'PUBLISHED', 'The Power of Side Projects', 23),

    ('How to manage your money as a junior developer.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', 'PUBLISHED', 'Money Management for Developers', 24),

    ('My favorite movie soundtracks to code to.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4', 'PUBLISHED', 'Movie Soundtracks for Deep Work', 25),

    ('How to avoid burnout in tech.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'PUBLISHED', 'Avoiding Burnout in Tech', 26),

    ('A simple explanation of Kubernetes for beginners.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1518770660439-4636190af475', 'PUBLISHED', 'Kubernetes for Beginners', 27),

    ('Why reading fiction makes you a better developer.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1512820790803-83ca734da794', 'PUBLISHED', 'Fiction Books for Developers', 28),

    ('How to build a personal brand as a developer.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'PUBLISHED', 'Building Your Developer Brand', 29),

    ('My favorite playlists to focus and get work done.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4', 'PUBLISHED', 'Music for Deep Focus', 30),

    ('Why testing your code matters more than you think.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1518770660439-4636190af475', 'PUBLISHED', 'The Importance of Testing', 2),

    ('How to contribute to open source as a beginner.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1518770660439-4636190af475', 'PUBLISHED', 'Getting Started with Open Source', 3),

    ('A guide to building healthy habits that stick.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'PUBLISHED', 'Building Habits That Last', 4),

    ('Why design thinking matters for developers.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', 'PUBLISHED', 'Design Thinking for Developers', 5),

    ('How to debug complex issues without losing your mind.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1518770660439-4636190af475', 'PUBLISHED', 'Debugging Without Losing Your Mind', 6),

    ('What I learned after 1 year of remote work.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'PUBLISHED', 'One Year of Remote Work: Lessons Learned', 7);



-- ============================
-- COMMENTS (120+ realistic comments)
-- ============================
INSERT INTO COMMENTS (CONTENT, CREATED_AT, UPDATED_AT, USER_ID, POST_ID)
VALUES
    ('Great article, really made me think about the future of AI.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 1),
    ('AI both excites and scares me at the same time.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 1),
    ('Loved the practical examples you used here.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 1),
    ('These VSCode extensions are absolute game changers.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 2),
    ('I already use half of these, will try the rest!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 2),
    ('Please do a follow-up with more advanced tips.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 2),
    ('Working from home is hard, these tips really help.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 3),
    ('The part about setting boundaries hit me hard.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 3),
    ('I needed this today, thank you.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 3),
    ('Elden Ring truly is a masterpiece.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 11, 4),
    ('I rage quit so many times but still love it.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 12, 4),
    ('You convinced me to finally buy this game.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 13, 4),
    ('Spring Boot always felt intimidating, this made it simpler.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 14, 5),
    ('Would love a part 2 with security and JWT.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15, 5),
    ('Clear and straight to the point, well done.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 16, 5),
    ('Routines really are everything, I need to fix mine.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 17, 6),
    ('The morning routine example was super helpful.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 18, 6),
    ('I''ll try this for a week and see how it goes.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 19, 6),
    ('Error handling is so underrated, thanks for covering it.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20, 7),
    ('This should be required reading for junior devs.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 21, 7),
    ('Loved the examples with custom exceptions.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 22, 7),
    ('Japan is on my bucket list now.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 23, 8),
    ('The photos you took are stunning.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 24, 8),
    ('Minimalism is something I want to explore more.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25, 8),
    ('What a crazy Champions League week!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 26, 9),
    ('I disagree with your take on that last match, but good read.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 27, 9),
    ('Can you do more tactical breakdowns?', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 28, 9),
    ('Investing always scared me, this made it less intimidating.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 29, 10),
    ('Loved the part about starting small.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 30, 10),
    ('Please do a follow-up on index funds.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 10),
    ('I''m definitely visiting these coffee shops.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 11),
    ('Porto really has some hidden gems.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 11),
    ('Now I want coffee, thanks.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 11),
    ('Notion is powerful but overwhelming, this helped.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 12),
    ('The tag system idea is brilliant.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 12),
    ('I reorganized my whole workspace after reading this.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 12),
    ('Finally a simple explanation of ML I can share.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 13),
    ('My non-tech friends actually understood this.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 13),
    ('Please do one on neural networks next.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 11, 13),
    ('Sleep really is my biggest problem.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 12, 14),
    ('I''ll try your suggestion of a fixed sleep schedule.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 13, 14),
    ('This made me feel less guilty about resting.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 14, 14),
    ('Adding these books to my reading list.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15, 15),
    ('I loved the part about deep work.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 16, 15),
    ('Can you do a list just for fiction?', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 17, 15),
    ('I hate running but this gave me hope.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 18, 16),
    ('From couch to 5K is exactly my level.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 19, 16),
    ('I''ll start tomorrow. Probably.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20, 16),
    ('These phone photography tips are gold.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 21, 17),
    ('I didn''t know about the grid feature before.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 22, 17),
    ('My photos already look better.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 23, 17),
    ('Clean landing pages are so underrated.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 24, 18),
    ('Loved the section on hierarchy and whitespace.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25, 18),
    ('Please do a teardown of famous landing pages.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 26, 18),
    ('DevOps really is about people.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 27, 19),
    ('Too many teams focus only on tools.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 28, 19),
    ('This article is going to my team chat.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 29, 19),
    ('AI search is already changing how I work.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 30, 20),
    ('I love how you explained the trade-offs.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 20),
    ('Curious to see where this goes in 5 years.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 20),
    ('I use half of these productivity apps already.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 21),
    ('The calendar blocking tip was great.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 21),
    ('I''ll try limiting myself to just a few tools.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 21),
    ('Failing a startup hurts, thanks for being honest.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 22),
    ('The part about ego was so real.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 22),
    ('I''m in the middle of a failing project, this helped.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 22),
    ('These recipes are perfect for busy days.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 23),
    ('I tried the pasta one, it was great.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 11, 23),
    ('Please do more budget-friendly meals.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 12, 23),
    ('Journaling daily changed my life too.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 13, 24),
    ('I liked your prompt suggestions.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 14, 24),
    ('I''ll start tonight.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15, 24),
    ('Your workout routine looks doable.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 16, 25),
    ('I appreciate that it doesn''t require a gym.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 17, 25),
    ('I''ll adapt this to my schedule.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 18, 25),
    ('Spaced repetition is so powerful.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 19, 26),
    ('I''ve been using Anki and love it.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20, 26),
    ('Thanks for the deck template.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 21, 26),
    ('Side projects taught me more than my job.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 22, 27),
    ('I needed this push to start something.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 23, 27),
    ('Great reminder to build in public.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 24, 27),
    ('Money management is my weak spot.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25, 28),
    ('Loved the 50/30/20 breakdown.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 26, 28),
    ('Please do one on taxes for freelancers.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 27, 28),
    ('These soundtracks are amazing to code to.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 28, 29),
    ('You forgot Interstellar!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 29, 29),
    ('I added these to my playlist.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 30, 29),
    ('Burnout is so real in tech.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 30),
    ('Thanks for normalizing rest.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 30),
    ('I''m going to take a weekend off.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 30),
    ('Kubernetes still scares me but this helped.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 31),
    ('Loved the analogies you used.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 31),
    ('Please do a part 2 with real examples.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 31),
    ('Fiction really does make you more empathetic.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 32),
    ('Adding these books to my list.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 32),
    ('I miss reading just for fun.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10, 32),
    ('Personal branding is something I avoided.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 11, 33),
    ('This made it feel less cringe.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 12, 33),
    ('I''ll start by fixing my LinkedIn.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 13, 33),
    ('These playlists are exactly my vibe.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 14, 34),
    ('I love lo-fi for deep work.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15, 34),
    ('Please share your Spotify profile.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 16, 34),
    ('Testing saved me so many times.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 17, 35),
    ('I''ll start writing tests for my side project.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 18, 35),
    ('Great explanation of unit vs integration tests.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 19, 35),
    ('Open source always felt intimidating.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20, 36),
    ('Your suggestion to start with docs is great.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 21, 36),
    ('I just opened my first PR!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 22, 36),
    ('Habits really are everything.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 23, 37),
    ('I''ll start with just one habit.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 24, 37),
    ('The identity-based habits idea was powerful.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25, 37),
    ('Design thinking should be taught in schools.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 26, 38),
    ('Loved the empathy section.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 27, 38),
    ('I''ll share this with my team.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 28, 38),
    ('Debugging is my daily life.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 29, 39),
    ('The rubber duck trick actually works.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 30, 39),
    ('I feel less alone reading this.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 39),
    ('Remote work changed how I see productivity.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 40),
    ('Loved your honesty in this one.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 40),
    ('I relate to this so much.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 40);

-- ============================
-- POST_CATEGORY (each post linked to 1–3 categories)
-- ============================
INSERT INTO POST_CATEGORY (POST_ID, CATEGORY_ID)
VALUES
    (1, 1), (1, 20), (1, 16),
    (2, 2), (2, 18), (2, 19),
    (3, 4), (3, 5),
    (4, 3), (4, 13),
    (5, 2), (5, 1),
    (6, 4), (6, 5),
    (7, 2), (7, 19),
    (8, 7), (8, 4),
    (9, 6),
    (10, 11), (10, 10),
    (11, 8), (11, 4),
    (12, 5), (12, 17),
    (13, 20), (13, 16),
    (14, 12), (14, 5),
    (15, 15), (15, 10),
    (16, 12), (16, 6),
    (17, 9), (17, 18),
    (18, 18), (18, 2),
    (19, 19), (19, 10),
    (20, 20), (20, 1),
    (21, 5), (21, 4),
    (22, 10), (22, 11),
    (23, 8), (23, 4),
    (24, 4), (24, 5),
    (25, 12), (25, 6),
    (26, 17), (26, 5),
    (27, 2), (27, 10),
    (28, 11), (28, 1),
    (29, 13), (29, 14),
    (30, 12), (30, 4),
    (31, 19), (31, 2),
    (32, 15), (32, 13),
    (33, 10), (33, 2),
    (34, 13), (34, 5),
    (35, 2), (35, 1),
    (36, 2), (36, 10),
    (37, 4), (37, 12),
    (38, 18), (38, 2),
    (39, 2), (39, 19),
    (40, 4), (40, 5);