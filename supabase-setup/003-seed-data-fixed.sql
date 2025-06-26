-- Clear existing data first to avoid duplicates
DELETE FROM public.user_achievements;
DELETE FROM public.quiz_attempts;
DELETE FROM public.quizzes;
DELETE FROM public.user_lesson_progress;
DELETE FROM public.lessons;
DELETE FROM public.achievements;
DELETE FROM public.translations WHERE user_id IS NULL;

-- Insert sample achievements
INSERT INTO public.achievements (name, description, icon, condition_type, condition_value, xp_reward) VALUES
('First Translation', 'Complete your first translation', '🎯', 'translations_count', 1, 10),
('Translation Master', 'Complete 100 translations', '🏆', 'translations_count', 100, 100),
('First Lesson', 'Complete your first lesson', '📚', 'lessons_completed', 1, 20),
('Learning Streak', 'Maintain a 7-day learning streak', '🔥', 'streak_days', 7, 50),
('Quiz Champion', 'Score 100% on 10 quizzes', '🎓', 'perfect_quizzes', 10, 75);

-- Insert sample lessons with specific IDs to avoid subquery issues
INSERT INTO public.lessons (id, title, description, language, difficulty, content, order_index, is_published) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Basic Greetings', 'Learn essential greetings in Spanish', 'es', 'beginner', '{
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

('550e8400-e29b-41d4-a716-446655440002', 'Numbers 1-20', 'Learn numbers from 1 to 20 in Spanish', 'es', 'beginner', '{
  "vocabulary": [
    {"word": "uno", "translation": "one", "pronunciation": "OO-noh"},
    {"word": "dos", "translation": "two", "pronunciation": "dohs"},
    {"word": "tres", "translation": "three", "pronunciation": "trehs"},
    {"word": "cuatro", "translation": "four", "pronunciation": "KWAH-troh"},
    {"word": "cinco", "translation": "five", "pronunciation": "SEEN-koh"},
    {"word": "seis", "translation": "six", "pronunciation": "says"},
    {"word": "siete", "translation": "seven", "pronunciation": "see-EH-teh"},
    {"word": "ocho", "translation": "eight", "pronunciation": "OH-choh"},
    {"word": "nueve", "translation": "nine", "pronunciation": "noo-EH-veh"},
    {"word": "diez", "translation": "ten", "pronunciation": "dee-EHS"}
  ]
}', 2, true),

('550e8400-e29b-41d4-a716-446655440003', 'Family Members', 'Learn family vocabulary in Spanish', 'es', 'beginner', '{
  "vocabulary": [
    {"word": "familia", "translation": "family", "pronunciation": "fah-MEE-lyah"},
    {"word": "padre", "translation": "father", "pronunciation": "PAH-dreh"},
    {"word": "madre", "translation": "mother", "pronunciation": "MAH-dreh"},
    {"word": "hermano", "translation": "brother", "pronunciation": "ehr-MAH-noh"},
    {"word": "hermana", "translation": "sister", "pronunciation": "ehr-MAH-nah"},
    {"word": "abuelo", "translation": "grandfather", "pronunciation": "ah-BWAY-loh"},
    {"word": "abuela", "translation": "grandmother", "pronunciation": "ah-BWAY-lah"},
    {"word": "hijo", "translation": "son", "pronunciation": "EE-hoh"},
    {"word": "hija", "translation": "daughter", "pronunciation": "EE-hah"}
  ]
}', 3, true),

('550e8400-e29b-41d4-a716-446655440004', 'Common Phrases', 'Essential phrases for daily conversation', 'es', 'beginner', '{
  "vocabulary": [
    {"word": "Por favor", "translation": "Please", "pronunciation": "por fah-VOR"},
    {"word": "Gracias", "translation": "Thank you", "pronunciation": "GRAH-see-ahs"},
    {"word": "De nada", "translation": "You''re welcome", "pronunciation": "deh NAH-dah"},
    {"word": "Lo siento", "translation": "I''m sorry", "pronunciation": "loh see-EHN-toh"},
    {"word": "Disculpe", "translation": "Excuse me", "pronunciation": "dees-KOOL-peh"}
  ]
}', 4, true),

('550e8400-e29b-41d4-a716-446655440005', 'Colors and Shapes', 'Learn colors and basic shapes in Spanish', 'es', 'beginner', '{
  "vocabulary": [
    {"word": "rojo", "translation": "red", "pronunciation": "ROH-hoh"},
    {"word": "azul", "translation": "blue", "pronunciation": "ah-SOOL"},
    {"word": "verde", "translation": "green", "pronunciation": "VEHR-deh"},
    {"word": "amarillo", "translation": "yellow", "pronunciation": "ah-mah-REE-yoh"},
    {"word": "negro", "translation": "black", "pronunciation": "NEH-groh"},
    {"word": "blanco", "translation": "white", "pronunciation": "BLAHN-koh"}
  ]
}', 5, true);

-- Insert sample quizzes using the specific lesson IDs
INSERT INTO public.quizzes (lesson_id, title, questions) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Greetings Quiz', '[
  {
    "type": "multiple_choice",
    "question": "How do you say ''Hello'' in Spanish?",
    "options": ["Hola", "Adiós", "Gracias", "Por favor"],
    "correct": 0
  },
  {
    "type": "multiple_choice",
    "question": "What does ''Buenos días'' mean?",
    "options": ["Good night", "Good morning", "Good afternoon", "Goodbye"],
    "correct": 1
  },
  {
    "type": "translation",
    "question": "Translate: Good evening",
    "answer": "Buenas noches"
  }
]'),

('550e8400-e29b-41d4-a716-446655440002', 'Numbers Quiz', '[
  {
    "type": "multiple_choice",
    "question": "How do you say ''five'' in Spanish?",
    "options": ["cuatro", "cinco", "seis", "siete"],
    "correct": 1
  },
  {
    "type": "multiple_choice",
    "question": "What number is ''diez''?",
    "options": ["8", "9", "10", "11"],
    "correct": 2
  },
  {
    "type": "translation",
    "question": "Translate: three",
    "answer": "tres"
  }
]'),

('550e8400-e29b-41d4-a716-446655440003', 'Family Quiz', '[
  {
    "type": "multiple_choice",
    "question": "How do you say ''mother'' in Spanish?",
    "options": ["padre", "madre", "hermana", "abuela"],
    "correct": 1
  },
  {
    "type": "translation",
    "question": "Translate: family",
    "answer": "familia"
  }
]');

-- Insert some sample translations for demo
INSERT INTO public.translations (user_id, source_text, translated_text, source_language, target_language) VALUES
(NULL, 'Hello world', 'Hola mundo', 'en', 'es'),
(NULL, 'Good morning', 'Buenos días', 'en', 'es'),
(NULL, 'Thank you', 'Gracias', 'en', 'es'),
(NULL, 'How are you?', '¿Cómo estás?', 'en', 'es'),
(NULL, 'I love you', 'Te amo', 'en', 'es');
