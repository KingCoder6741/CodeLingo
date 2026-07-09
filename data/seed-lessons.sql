-- Extended lessons (25 total)
INSERT INTO lessons (lesson_key, title, description, category, level, xp_reward) VALUES
-- Italian Lessons
('italian-greetings', 'Italian Basics: Greetings', 'Learn how to greet people in Italian', 'language', 1, 20),
('italian-numbers', 'Italian Basics: Numbers 1-10', 'Count from 1 to 10 in Italian', 'language', 1, 20),
('italian-family', 'Italian Basics: Family Words', 'Learn family member names in Italian', 'language', 2, 25),
('italian-colors', 'Italian Basics: Colors', 'Learn color names in Italian', 'language', 1, 20),
('italian-food', 'Italian: Common Foods', 'Learn names of popular Italian foods', 'language', 2, 25),
('italian-verbs', 'Italian: Essential Verbs', 'Learn to conjugate basic Italian verbs', 'language', 3, 30),
('italian-questions', 'Italian: Asking Questions', 'How to form questions in Italian', 'language', 3, 30),
('italian-past-tense', 'Italian: Past Tense Basics', 'Introduction to Italian past tense', 'language', 4, 35),

-- JavaScript Lessons
('js-variables', 'JavaScript: Variables & Types', 'Learn let, const, var and data types', 'code', 1, 20),
('js-functions', 'JavaScript: Functions', 'Write and call functions', 'code', 2, 25),
('js-loops', 'JavaScript: Loops', 'Master for, while, and forEach loops', 'code', 2, 25),
('js-arrays', 'JavaScript: Arrays & Methods', 'Work with arrays and their methods', 'code', 3, 30),
('js-objects', 'JavaScript: Objects', 'Create and manipulate objects', 'code', 3, 30),
('js-async', 'JavaScript: Promises & Async/Await', 'Handle asynchronous code', 'code', 4, 35),
('js-dom', 'JavaScript: DOM Manipulation', 'Interact with web page elements', 'code', 2, 25),
('js-events', 'JavaScript: Event Handling', 'Respond to user interactions', 'code', 2, 25),

-- Python Lessons
('python-basics', 'Python: Getting Started', 'Introduction to Python syntax', 'code', 1, 20),
('python-strings', 'Python: Strings & Methods', 'Manipulate strings in Python', 'code', 2, 25),
('python-lists', 'Python: Lists & Tuples', 'Work with Python collections', 'code', 2, 25),
('python-dict', 'Python: Dictionaries', 'Use key-value pairs in Python', 'code', 3, 30),
('python-functions', 'Python: Functions', 'Define and use functions in Python', 'code', 2, 25),
('python-loops', 'Python: Loops & Control Flow', 'Master loops and conditionals', 'code', 2, 25),
('python-oop', 'Python: Object-Oriented Programming', 'Classes and inheritance in Python', 'code', 4, 35),

-- Duo Lessons
('duo-translator-js', 'Duo: Build a Language Translator', 'Use JavaScript to build a simple translator', 'code', 3, 35),
('duo-quiz-game', 'Duo: Create a Quiz Game', 'Code a quiz game while learning Italian', 'code', 3, 35);

-- Seed lesson steps for italian-greetings
INSERT INTO lesson_steps (lesson_id, step_number, content) VALUES
((SELECT id FROM lessons WHERE lesson_key = 'italian-greetings'), 1, 'Learn "Ciao" (Hello/Goodbye) - formal and informal'),
((SELECT id FROM lessons WHERE lesson_key = 'italian-greetings'), 2, 'Learn "Buongiorno" (Good morning) - polite greeting'),
((SELECT id FROM lessons WHERE lesson_key = 'italian-greetings'), 3, 'Learn "Buonasera" (Good evening) and "Buonanotte" (Good night)'),
((SELECT id FROM lessons WHERE lesson_key = 'italian-greetings'), 4, 'Practice: Greet someone in Italian with proper context');

-- Seed lesson steps for js-variables
INSERT INTO lesson_steps (lesson_id, step_number, content) VALUES
((SELECT id FROM lessons WHERE lesson_key = 'js-variables'), 1, 'Understand what a variable is - a container for data'),
((SELECT id FROM lessons WHERE lesson_key = 'js-variables'), 2, 'Learn the difference between let (block-scoped), const (immutable), and var (function-scoped)'),
((SELECT id FROM lessons WHERE lesson_key = 'js-variables'), 3, 'Learn about data types: string, number, boolean, null, undefined, symbol'),
((SELECT id FROM lessons WHERE lesson_key = 'js-variables'), 4, 'Write your first variable: const name = "John";');

-- Seed lesson steps for python-basics
INSERT INTO lesson_steps (lesson_id, step_number, content) VALUES
((SELECT id FROM lessons WHERE lesson_key = 'python-basics'), 1, 'What is Python? An interpreted, high-level programming language'),
((SELECT id FROM lessons WHERE lesson_key = 'python-basics'), 2, 'Print to console: print("Hello, World!")'),
((SELECT id FROM lessons WHERE lesson_key = 'python-basics'), 3, 'Using the Python REPL (interactive shell)'),
((SELECT id FROM lessons WHERE lesson_key = 'python-basics'), 4, 'Understanding indentation - Python uses indentation for code blocks');

-- Seed quizzes
INSERT INTO quizzes (lesson_id, question, correct_option_index) VALUES
((SELECT id FROM lessons WHERE lesson_key = 'italian-greetings'), 'What does "Ciao" mean?', 1);

INSERT INTO quiz_options (quiz_id, option_text, option_index) VALUES
((SELECT id FROM quizzes WHERE question = 'What does "Ciao" mean?'), 'Goodbye only', 0),
((SELECT id FROM quizzes WHERE question = 'What does "Ciao" mean?'), 'Hello or Goodbye', 1),
((SELECT id FROM quizzes WHERE question = 'What does "Ciao" mean?'), 'Good morning', 2);

INSERT INTO quizzes (lesson_id, question, correct_option_index) VALUES
((SELECT id FROM lessons WHERE lesson_key = 'js-variables'), 'Which keyword should you use for most variables?', 0);

INSERT INTO quiz_options (quiz_id, option_text, option_index) VALUES
((SELECT id FROM quizzes WHERE question = 'Which keyword should you use for most variables?'), 'const', 0),
((SELECT id FROM quizzes WHERE question = 'Which keyword should you use for most variables?'), 'var', 1),
((SELECT id FROM quizzes WHERE question = 'Which keyword should you use for most variables?'), 'let', 2);

INSERT INTO quizzes (lesson_id, question, correct_option_index) VALUES
((SELECT id FROM lessons WHERE lesson_key = 'python-basics'), 'What is the Python print function used for?', 0);

INSERT INTO quiz_options (quiz_id, option_text, option_index) VALUES
((SELECT id FROM quizzes WHERE question = 'What is the Python print function used for?'), 'Display output to the console', 0),
((SELECT id FROM quizzes WHERE question = 'What is the Python print function used for?'), 'Print documents', 1),
((SELECT id FROM quizzes WHERE question = 'What is the Python print function used for?'), 'Store data in memory', 2);

-- Seed achievements
INSERT INTO achievements (name, description, xp_threshold) VALUES
('First Steps', 'Complete your first lesson', 0),
('XP 100', 'Earn 100 total XP', 100),
('XP 300', 'Earn 300 total XP', 300),
('XP 600', 'Earn 600 total XP', 600),
('Level 5', 'Reach level 5', 500),
('Level 10', 'Reach level 10', 1000),
('Polyglot', 'Complete 5 language lessons', 0),
('Code Master', 'Complete 5 coding lessons', 0),
('JavaScript Expert', 'Master all JavaScript lessons', 0),
('Python Pro', 'Master all Python lessons', 0),
('Italian Fluent', 'Complete all Italian lessons', 0);
