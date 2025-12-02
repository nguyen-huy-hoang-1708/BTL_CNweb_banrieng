-- Clear existing data (keep users with hashed passwords)
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE AINotes;
TRUNCATE TABLE LearningEvents;
TRUNCATE TABLE Certificates;
TRUNCATE TABLE CVs;
TRUNCATE TABLE InterviewSessions;
TRUNCATE TABLE Exercises;
TRUNCATE TABLE UserProgress;
TRUNCATE TABLE Modules;
TRUNCATE TABLE Roadmaps;
SET FOREIGN_KEY_CHECKS=1;

-- Get first user ID
SET @user_id = (SELECT user_id FROM Users LIMIT 1);

-- ================== ROADMAPS (Chi tiết) ==================
INSERT INTO Roadmaps (roadmap_id, title, description, category, image_url, created_by, status) VALUES
(UUID(), 'Frontend Developer', 'Lộ trình học Frontend từ cơ bản đến nâng cao: HTML, CSS, JavaScript, React, TypeScript', 'Web', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', @user_id, 'published'),
(UUID(), 'Backend Developer', 'Lộ trình học Backend: Node.js, Express, Database, API, Authentication, Deployment', 'Web', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600', @user_id, 'published'),
(UUID(), 'Data Analyst', 'Lộ trình phân tích dữ liệu: Python, Pandas, NumPy, SQL, Data Visualization, Statistics', 'Data', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600', @user_id, 'published'),
(UUID(), 'AI Engineer', 'Lộ trình AI/ML: Machine Learning, Deep Learning, TensorFlow, PyTorch, Computer Vision', 'AI', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600', @user_id, 'published'),
(UUID(), 'Mobile Developer', 'Lộ trình phát triển ứng dụng di động: React Native, Flutter, iOS, Android', 'Mobile', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600', @user_id, 'published'),
(UUID(), 'DevOps Engineer', 'Lộ trình DevOps: Docker, Kubernetes, CI/CD, AWS, Monitoring, Infrastructure as Code', 'Cloud', 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600', @user_id, 'published'),
(UUID(), 'Game Developer', 'Lộ trình phát triển game: Unity, Unreal Engine, C#, Game Design, 3D Graphics', 'Game', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600', @user_id, 'published'),
(UUID(), 'UI/UX Designer', 'Lộ trình thiết kế UI/UX: Figma, Adobe XD, User Research, Prototyping, Design Systems', 'Design', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600', @user_id, 'published'),
(UUID(), 'Fullstack Developer', 'Lộ trình Fullstack hoàn chỉnh: Frontend + Backend + Database + Deployment', 'Web', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', @user_id, 'published'),
(UUID(), 'Cybersecurity Specialist', 'Lộ trình an ninh mạng: Network Security, Penetration Testing, Cryptography, Ethical Hacking', 'Security', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600', @user_id, 'published');

-- ================== MODULES (10 modules mỗi roadmap) ==================
INSERT INTO Modules (module_id, roadmap_id, title, description, content, order_index, estimated_hours)
SELECT 
    UUID(),
    r.roadmap_id,
    CASE 
        WHEN r.title = 'Frontend Developer' THEN 
            CASE n.num
                WHEN 1 THEN 'HTML Fundamentals'
                WHEN 2 THEN 'CSS Styling & Layouts'
                WHEN 3 THEN 'JavaScript Basics'
                WHEN 4 THEN 'Advanced JavaScript'
                WHEN 5 THEN 'React.js Fundamentals'
                WHEN 6 THEN 'React Hooks & State Management'
                WHEN 7 THEN 'TypeScript Basics'
                WHEN 8 THEN 'Next.js Framework'
                WHEN 9 THEN 'Testing & Debugging'
                WHEN 10 THEN 'Deployment & Optimization'
            END
        WHEN r.title = 'Backend Developer' THEN
            CASE n.num
                WHEN 1 THEN 'Node.js Introduction'
                WHEN 2 THEN 'Express.js Framework'
                WHEN 3 THEN 'RESTful API Design'
                WHEN 4 THEN 'Database - SQL & NoSQL'
                WHEN 5 THEN 'Authentication & Authorization'
                WHEN 6 THEN 'API Security'
                WHEN 7 THEN 'Testing Backend APIs'
                WHEN 8 THEN 'Microservices Architecture'
                WHEN 9 THEN 'Performance Optimization'
                WHEN 10 THEN 'Cloud Deployment'
            END
        ELSE CONCAT('Module ', n.num)
    END,
    'Nội dung chi tiết của module',
    'Học tập với video lectures, assignments, và projects thực tế',
    n.num,
    FLOOR(3 + RAND() * 5)
FROM Roadmaps r
CROSS JOIN (
    SELECT 1 AS num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
    UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
) n;

-- ================== EXERCISES (10 bài tập cho mỗi roadmap) ==================
INSERT INTO Exercises (exercise_id, module_id, title, description, examples, starter_code, solution_code, difficulty)
SELECT 
    UUID(),
    m.module_id,
    CONCAT('Bài tập ', FLOOR(1 + RAND() * 10)),
    'Mô tả bài tập thực hành',
    JSON_OBJECT('input', 'Sample input', 'output', 'Expected output'),
    '// Write your code here\nfunction solve() {\n  // TODO\n}',
    '// Solution\nfunction solve() {\n  return "solved";\n}',
    ELT(FLOOR(1 + RAND() * 3), 'easy', 'medium', 'hard')
FROM Modules m
LIMIT 100;

-- ================== CERTIFICATES (10 chứng chỉ) ==================
INSERT INTO Certificates (certificate_id, user_id, roadmap_id, certificate_name, pdf_url, issue_date)
SELECT 
    UUID(),
    @user_id,
    r.roadmap_id,
    CONCAT('Chứng chỉ hoàn thành: ', r.title),
    'https://example.com/certificates/cert.pdf',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY)
FROM Roadmaps r
LIMIT 10;

-- ================== CVs (5 CVs mẫu) ==================
INSERT INTO CVs (cv_id, user_id, cv_name, template_style, personal_info, education, experience, skills, projects, pdf_url)
VALUES
(UUID(), @user_id, 'Frontend Developer CV', 'modern',
 JSON_OBJECT('name', 'John Doe', 'email', 'john@example.com', 'phone', '0123456789'),
 JSON_ARRAY('Computer Science - ABC University'),
 JSON_ARRAY('Frontend Developer at Tech Corp - 2 years'),
 JSON_ARRAY('JavaScript', 'React', 'TypeScript', 'HTML/CSS', 'Git'),
 JSON_ARRAY('E-commerce Website', 'Portfolio Site', 'Social Media App'),
 'https://example.com/cvs/frontend-cv.pdf'),

(UUID(), @user_id, 'Backend Developer CV', 'classic',
 JSON_OBJECT('name', 'Jane Smith', 'email', 'jane@example.com', 'phone', '0987654321'),
 JSON_ARRAY('Software Engineering - XYZ University'),
 JSON_ARRAY('Backend Developer at StartupCo - 3 years'),
 JSON_ARRAY('Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker'),
 JSON_ARRAY('RESTful API Service', 'Microservices Platform'),
 'https://example.com/cvs/backend-cv.pdf'),

(UUID(), @user_id, 'Fullstack Developer CV', 'minimal',
 JSON_OBJECT('name', 'Alex Johnson', 'email', 'alex@example.com'),
 JSON_ARRAY('Information Technology - DEF University'),
 JSON_ARRAY('Fullstack Developer - Freelance'),
 JSON_ARRAY('React', 'Node.js', 'Next.js', 'Prisma', 'AWS'),
 JSON_ARRAY('SaaS Platform', 'Mobile App Backend'),
 'https://example.com/cvs/fullstack-cv.pdf');

-- ================== INTERVIEW SESSIONS (10 sessions) ==================
INSERT INTO InterviewSessions (session_id, user_id, session_name, interview_type, questions, user_answers, ai_feedback, score)
VALUES
(UUID(), @user_id, 'Frontend Interview - Round 1', 'simulated',
 JSON_ARRAY('Explain React hooks', 'What is Virtual DOM?', 'CSS Flexbox vs Grid'),
 JSON_ARRAY('Hooks are functions...', 'Virtual DOM is...', 'Flexbox is...'),
 JSON_ARRAY('Good explanation', 'Could be more detailed', 'Excellent answer'),
 85.5),

(UUID(), @user_id, 'Backend Interview - System Design', 'simulated',
 JSON_ARRAY('Design a URL shortener', 'Explain microservices', 'Database scaling'),
 JSON_ARRAY('Use hash function...', 'Microservices are...', 'Sharding and...'),
 JSON_ARRAY('Good approach', 'Consider edge cases', 'Well structured'),
 78.0),

(UUID(), @user_id, 'JavaScript Coding Challenge', 'prep_feedback',
 JSON_ARRAY('Implement debounce', 'Array methods', 'Async/await'),
 JSON_ARRAY('function debounce()...', 'map, filter, reduce...', 'async function...'),
 JSON_ARRAY('Correct implementation', 'Good examples', 'Perfect understanding'),
 92.0);

-- ================== LEARNING EVENTS (20 events) ==================
INSERT INTO LearningEvents (event_id, user_id, title, description, status, start_utc, end_utc, timezone, module_id, color, is_ai_suggested, reminder_minutes)
SELECT 
    UUID(),
    @user_id,
    CONCAT('Study Session: ', m.title),
    CONCAT('Complete module: ', m.title),
    ELT(FLOOR(1 + RAND() * 4), 'planned', 'done', 'missed', 'cancelled'),
    DATE_ADD(NOW(), INTERVAL n.num DAY),
    DATE_ADD(NOW(), INTERVAL (n.num * 24 + 2) HOUR),
    'Asia/Ho_Chi_Minh',
    m.module_id,
    ELT(FLOOR(1 + RAND() * 5), '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'),
    RAND() < 0.5,
    30
FROM Modules m
CROSS JOIN (
    SELECT 1 AS num UNION SELECT 2 UNION SELECT 3 UNION SELECT 5 UNION SELECT 7
    UNION SELECT 10 UNION SELECT 14 UNION SELECT 21
) n
LIMIT 20;

-- ================== USER PROGRESS ==================
INSERT INTO UserProgress (progress_id, user_id, module_id, status, completion_percentage, started_at, completed_at)
SELECT 
    UUID(),
    @user_id,
    m.module_id,
    ELT(FLOOR(1 + RAND() * 3), 'not_started', 'in_progress', 'completed'),
    ROUND(RAND() * 100, 2),
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY),
    CASE WHEN RAND() > 0.5 THEN DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 15) DAY) ELSE NULL END
FROM Modules m
WHERE RAND() < 0.3
LIMIT 15;

-- ================== AI NOTES ==================
INSERT INTO AINotes (note_id, user_id, module_id, note_type, content, sequence_order)
SELECT 
    UUID(),
    @user_id,
    m.module_id,
    ELT(FLOOR(1 + RAND() * 6), 'summary', 'hint', 'explanation', 'feedback', 'user_question', 'ai_response'),
    'AI-generated note content providing helpful insights and explanations',
    FLOOR(1 + RAND() * 10)
FROM Modules m
WHERE RAND() < 0.2
LIMIT 20;
