-- Insert sample achievements
INSERT INTO public.achievements (name, description, icon, condition_type, condition_value, xp_reward) VALUES
('First Translation', 'Complete your first translation', '🎯', 'translations_count', 1, 10),
('Translation Master', 'Complete 100 translations', '🏆', 'translations_count', 100, 100),
('First Lesson', 'Complete your first lesson', '📚', 'lessons_completed', 1, 20),
('Learning Streak', 'Maintain a 7-day learning streak', '🔥', 'streak_days', 7, 50),
('Quiz Champion', 'Score 100% on 10 quizzes', '🎓', 'perfect_quizzes', 10, 75);

-- Insert sample lessons
INSERT INTO public.lessons (title, description, language, difficulty, content, order_index, is_published) VALUES
('Basic Greetings', 'Learn essential greetings in Spanish', 'es', 'beginner', '{
  "vocabulary": [
    {"word": "Hola", "translation": "Hello", "pronunciation": "OH-lah"},
    {"word": "Buenos días", "translation": "Good morning", "pronunciation": "BWAY-nohs DEE-ahs"},
    {"word": "Buenas tardes", "translation": "Good afternoon", "pronunciation": "BWAY-nahs TAR-dehs"},
    {"word": "Buenas noches", "translation": "Good evening", "pronunciation": "BWAY-nahs NOH-chehs"},
    {"word": "Adiós", "translation": "Goodbye", "pronunciation": "ah-DYOHS"}
  ],
  "examples": [
    {"spanish": "Hola, ¿cómo estás?", "english": "Hello, how are you?"},
    {"spanish": "Buenos días, señora", "english": "Good morning, ma''am"}
  ]
}', 1, true),

('Numbers 1-20', 'Learn numbers from 1 to 20 in Spanish', 'es', 'beginner', '{
  "vocabulary": [
    {"word": "uno", "translation": "one", "pronunciation": "OO-noh"},
    {"word": "dos", "translation": "two", "pronunciation": "dohs"},
    {"word": "tres", "translation": "three", "pronunciation": "trehs"},
    {"word": "cuatro", "translation": "four", "pronunciation": "KWAH-troh"},
    {"word": "cinco", "translation": "five", "pronunciation": "SEEN-koh"}
  ]
}', 2, true),

('Family Members', 'Learn family vocabulary in Spanish', 'es', 'beginner', '{
  "vocabulary": [
    {"word": "familia", "translation": "family", "pronunciation": "fah-MEE-lyah"},
    {"word": "padre", "translation": "father", "pronunciation": "PAH-dreh"},
    {"word": "madre", "translation": "mother", "pronunciation": "MAH-dreh"},
    {"word": "hermano", "translation": "brother", "pronunciation": "ehr-MAH-noh"},
    {"word": "hermana", "translation": "sister", "pronunciation": "ehr-MAH-nah"}
  ]
}', 3, true);

-- Insert sample quizzes
INSERT INTO public.quizzes (lesson_id, title, questions) VALUES
((SELECT id FROM public.lessons WHERE title = 'Basic Greetings'), 'Greetings Quiz', '[
  {
    "type": "multiple_choice",
    "question": "How do you say ''Hello'' in Spanish?",
    "options": ["Hola", "Adiós", "Gracias", "Por favor"],
    "correct": 0
  },
  {
    "type": "translation",
    "question": "Translate: Good morning",
    "answer": "Buenos días"
  }
]');
