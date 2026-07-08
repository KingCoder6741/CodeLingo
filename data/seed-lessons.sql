-- Seed lessons
INSERT INTO lessons (lesson_key, title, description, category, level, xp_reward) VALUES
('italian-greetings', 'Italian Basics: Greetings', 'Learn how to greet people in Italian', 'language', 1, 20),
('italian-numbers', 'Italian Basics: Numbers 1-10', 'Count from 1 to 10 in Italian', 'language', 1, 20),
('italian-family', 'Italian Basics: Family Words', 'Learn family member names in Italian', 'language', 2, 25),
('js-variables', 'JavaScript: Variables & Types', 'Learn let, const, var and data types', 'code', 1, 20),
('js-functions', 'JavaScript: Functions', 'Write and call functions', 'code', 2, 25),
('js-loops', 'JavaScript: Loops', 'Master for, while, and forEach loops', 'code', 2, 25),
('js-arrays', 'JavaScript: Arrays & Methods', 'Work with arrays and their methods', 'code', 3, 30),
('python-basics', 'Python: Getting Started', 'Introduction to Python syntax', 'code', 1, 20),
('python-strings', 'Python: Strings & Methods', 'Manipulate strings in Python', 'code', 2, 25);

-- Seed lesson steps for italian-greetings
INSERT INTO lesson_steps (lesson_id, step_number, content) VALUES
((SELECT id FROM lessons WHERE lesson_key = 'italian-greetings'), 1, 'Learn "Ciao" (Hello/Goodbye)'),
((SELECT id FROM lessons WHERE lesson_key = 'italian-greetings'), 2, 'Learn "Buongiorno" (Good morning)'),
((SELECT id FROM lessons WHERE lesson_key = 'italian-greetings'), 3, 'Learn "Buonasera" (Good evening)'),
((SELECT id FROM lessons WHERE lesson_key = 'italian-greetings'), 4, 'Practice: Greet someone in Italian');

-- Seed lesson steps for js-variables
INSERT INTO lesson_steps (lesson_id, step_number, content) VALUES
((SELECT id FROM lessons WHERE lesson_key = 'js-variables'), 1, 'Understand what a variable is'),
((SELECT id FROM lessons WHERE lesson_key = 'js-variables'), 2, 'Learn the difference between let, const, and var'),
((SELECT id FROM lessons WHERE lesson_key = 'js-variables'), 3, 'Learn about data types: string, number, boolean'),
((SELECT id FROM lessons WHERE lesson_key = 'js-variables'), 4, 'Write your first variable');

-- Seed quizzes for italian-greetings
INSERT INTO quizzes (lesson_id, question, correct_option_index) VALUES
((SELECT id FROM lessons WHERE lesson_key = 'italian-greetings'), 'What does "Ciao" mean?', 1);

INSERT INTO quiz_options (quiz_id, option_text, option_index) VALUES
((SELECT id FROM quizzes WHERE question = 'What does "Ciao" mean?'), 'Goodbye', 0),
((SELECT id FROM quizzes WHERE question = 'What does "Ciao" mean?'), 'Hello or Goodbye', 1),
((SELECT id FROM quizzes WHERE question = 'What does "Ciao" mean?'), 'Good morning', 2);

INSERT INTO quizzes (lesson_id, question, correct_option_index) VALUES
((SELECT id FROM lessons WHERE lesson_key = 'js-variables'), 'Which keyword should you use for most variables?', 0);

INSERT INTO quiz_options (quiz_id, option_text, option_index) VALUES
((SELECT id FROM quizzes WHERE question = 'Which keyword should you use for most variables?'), 'const', 0),
((SELECT id FROM quizzes WHERE question = 'Which keyword should you use for most variables?'), 'var', 1),
((SELECT id FROM quizzes WHERE question = 'Which keyword should you use for most variables?'), 'let', 2);

-- Seed achievements
INSERT INTO achievements (name, description, xp_threshold) VALUES
('First Steps', 'Complete your first lesson', 0),
('XP 100', 'Earn 100 total XP', 100),
('XP 300', 'Earn 300 total XP', 300),
('XP 600', 'Earn 600 total XP', 600),
('Level 5', 'Reach level 5', 500),
('Level 10', 'Reach level 10', 1000),
('Polyglot', 'Complete 5 language lessons', 0),
('Code Master', 'Complete 5 coding lessons', 0);
