-- Update Exercises with more detailed content
UPDATE Exercises SET 
    title = 'Build a Todo List App',
    description = 'Create a fully functional todo list application with add, edit, delete, and mark complete features using React and TypeScript.',
    examples = JSON_OBJECT('input', 'User clicks "Add Task"', 'output', 'New task appears in list'),
    starter_code = 'import React from "react";\n\nfunction TodoList() {\n  return <div>Start here</div>;\n}',
    solution_code = 'import React, { useState } from "react";\n\nfunction TodoList() {\n  const [todos, setTodos] = useState([]);\n  return <div>{todos.map(t => <div key={t.id}>{t.text}</div>)}</div>;\n}'
WHERE title LIKE '%Bài tập 1%' LIMIT 10;

UPDATE Exercises SET 
    title = 'Implement User Authentication',
    description = 'Build a secure authentication system with JWT tokens, password hashing using bcrypt, and session management.',
    examples = JSON_OBJECT('input', 'email: user@example.com, password: mypass', 'output', 'JWT token returned'),
    starter_code = 'async function login(email, password) {\n  // TODO: Implement login\n}',
    solution_code = 'async function login(email, password) {\n  const user = await db.findByEmail(email);\n  const valid = await bcrypt.compare(password, user.hash);\n  return jwt.sign({id: user.id});\n}'
WHERE title LIKE '%Bài tập 2%' LIMIT 10;

UPDATE Exercises SET 
    title = 'Create REST API Endpoints',
    description = 'Design and implement RESTful API endpoints for CRUD operations on a resource with proper HTTP methods and status codes.',
    examples = JSON_OBJECT('input', 'GET /api/users', 'output', '[{id: 1, name: "Alice"}]'),
    starter_code = 'app.get("/api/users", (req, res) => {\n  // TODO\n});',
    solution_code = 'app.get("/api/users", async (req, res) => {\n  const users = await db.query("SELECT * FROM users");\n  res.json(users);\n});'
WHERE title LIKE '%Bài tập 3%' LIMIT 10;

UPDATE Exercises SET 
    title = 'Database Query Optimization',
    description = 'Optimize slow SQL queries using indexes, query analysis, and proper JOIN strategies. Reduce query time from seconds to milliseconds.',
    examples = JSON_OBJECT('input', 'Slow query: SELECT * FROM orders JOIN users', 'output', 'Optimized with index on user_id'),
    starter_code = 'SELECT * FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email = ?;',
    solution_code = 'CREATE INDEX idx_users_email ON users(email);\nSELECT o.* FROM orders o JOIN users u USING(user_id) WHERE u.email = ?;'
WHERE title LIKE '%Bài tập 4%' OR title LIKE '%Bài tập 6%' LIMIT 10;

UPDATE Exercises SET 
    title = 'Implement Real-time Chat',
    description = 'Build a real-time chat application using WebSockets or Socket.io with message history, typing indicators, and online status.',
    examples = JSON_OBJECT('input', 'User sends "Hello"', 'output', 'Message broadcast to all connected clients'),
    starter_code = 'io.on("connection", (socket) => {\n  // TODO: Handle chat events\n});',
    solution_code = 'io.on("connection", (socket) => {\n  socket.on("message", (msg) => {\n    io.emit("message", {user: socket.id, text: msg});\n  });\n});'
WHERE title LIKE '%Bài tập 5%' OR title LIKE '%Bài tập 7%' LIMIT 10;

UPDATE Exercises SET 
    title = 'Deploy to Production',
    description = 'Configure CI/CD pipeline, set up environment variables, implement zero-downtime deployment, and monitor application health.',
    examples = JSON_OBJECT('input', 'git push main', 'output', 'Automated build, test, and deploy to production'),
    starter_code = '# .github/workflows/deploy.yml\nname: Deploy\non: [push]',
    solution_code = 'name: Deploy\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - run: npm test\n      - run: npm run build'
WHERE title LIKE '%Bài tập 8%' OR title LIKE '%Bài tập 9%' OR title LIKE '%Bài tập 10%' LIMIT 15;

-- Update Modules with better titles and descriptions
UPDATE Modules SET 
    title = 'Introduction to Frontend Development',
    description = 'Learn the fundamentals of HTML, CSS, JavaScript, and modern frontend frameworks. Build responsive web applications.',
    content = 'This module covers: HTML5 semantic elements, CSS Grid and Flexbox, JavaScript ES6+, React basics, state management, and component lifecycle.'
WHERE title = 'Module 1' AND roadmap_id IN (SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Frontend%');

UPDATE Modules SET 
    title = 'Advanced React Patterns',
    description = 'Master React hooks, context API, performance optimization, and advanced component patterns like HOCs and render props.',
    content = 'Topics: Custom hooks, useReducer, useContext, React.memo, useMemo, useCallback, code splitting, lazy loading, and error boundaries.'
WHERE title = 'Module 2' AND roadmap_id IN (SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Frontend%');

UPDATE Modules SET 
    title = 'Node.js and Express Fundamentals',
    description = 'Build scalable backend applications with Node.js and Express. Learn middleware, routing, and async patterns.',
    content = 'Learn: Event loop, streams, buffers, Express routing, middleware chain, error handling, async/await, and RESTful API design.'
WHERE title = 'Module 1' AND roadmap_id IN (SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Backend%');

UPDATE Modules SET 
    title = 'Database Design & SQL',
    description = 'Master relational database design, SQL queries, indexing, transactions, and database optimization techniques.',
    content = 'Covers: Normalization, ER diagrams, CRUD operations, JOINs, subqueries, indexes, transactions, ACID properties, and query optimization.'
WHERE title = 'Module 2' AND roadmap_id IN (SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Backend%');

UPDATE Modules SET 
    title = 'Python for Data Analysis',
    description = 'Use Python, Pandas, NumPy, and Matplotlib for data manipulation, analysis, and visualization.',
    content = 'Learn: Pandas DataFrames, data cleaning, aggregation, merging datasets, statistical analysis, and creating visualizations.'
WHERE title = 'Module 1' AND roadmap_id IN (SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Data%');

UPDATE Modules SET 
    title = 'Machine Learning Basics',
    description = 'Introduction to supervised and unsupervised learning, model training, evaluation, and feature engineering.',
    content = 'Topics: Linear regression, classification, decision trees, random forests, k-means clustering, model evaluation metrics, and cross-validation.'
WHERE title = 'Module 1' AND roadmap_id IN (SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%AI%');

-- Update CVs with more realistic data
UPDATE CVs SET
    personal_info = JSON_OBJECT(
        'name', 'Nguyen Van An',
        'email', 'an.nguyen@email.com',
        'phone', '+84 123 456 789',
        'location', 'Ho Chi Minh City, Vietnam',
        'title', 'Senior Frontend Developer'
    ),
    education = JSON_ARRAY(
        JSON_OBJECT('school', 'University of Technology', 'degree', 'Bachelor of Computer Science', 'year', '2020'),
        JSON_OBJECT('school', 'FPT University', 'degree', 'Software Engineering', 'year', '2018')
    ),
    experience = JSON_ARRAY(
        JSON_OBJECT('company', 'Tech Corp', 'position', 'Frontend Developer', 'duration', '2020-2023', 'description', 'Built responsive web applications using React and TypeScript'),
        JSON_OBJECT('company', 'StartupXYZ', 'position', 'Junior Developer', 'duration', '2018-2020', 'description', 'Developed features for e-commerce platform')
    ),
    skills = JSON_ARRAY('React', 'TypeScript', 'Node.js', 'Git', 'REST APIs', 'Jest', 'CSS/SASS'),
    projects = JSON_ARRAY(
        JSON_OBJECT('name', 'E-commerce Dashboard', 'description', 'Admin panel with real-time analytics', 'tech', 'React, Redux, Chart.js'),
        JSON_OBJECT('name', 'Learning Management System', 'description', 'Online course platform', 'tech', 'Next.js, PostgreSQL')
    )
WHERE cv_name LIKE '%Frontend%';

UPDATE CVs SET
    personal_info = JSON_OBJECT(
        'name', 'Tran Thi Binh',
        'email', 'binh.tran@email.com',
        'phone', '+84 987 654 321',
        'location', 'Hanoi, Vietnam',
        'title', 'Backend Engineer'
    ),
    education = JSON_ARRAY(
        JSON_OBJECT('school', 'Hanoi University of Science', 'degree', 'Master in Software Engineering', 'year', '2021')
    ),
    experience = JSON_ARRAY(
        JSON_OBJECT('company', 'Global Tech', 'position', 'Backend Developer', 'duration', '2021-Present', 'description', 'Design and implement microservices architecture'),
        JSON_OBJECT('company', 'DevOps Solutions', 'position', 'Software Engineer', 'duration', '2019-2021', 'description', 'Built RESTful APIs and database schemas')
    ),
    skills = JSON_ARRAY('Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Redis', 'Microservices'),
    projects = JSON_ARRAY(
        JSON_OBJECT('name', 'Payment Gateway', 'description', 'Secure payment processing system', 'tech', 'Node.js, Stripe, Redis'),
        JSON_OBJECT('name', 'Real-time Analytics', 'description', 'High-throughput data pipeline', 'tech', 'Python, Kafka, Elasticsearch')
    )
WHERE cv_name LIKE '%Backend%';

UPDATE CVs SET
    personal_info = JSON_OBJECT(
        'name', 'Le Hoang Cuong',
        'email', 'cuong.le@email.com',
        'phone', '+84 555 123 456',
        'location', 'Da Nang, Vietnam',
        'title', 'Fullstack Developer'
    ),
    education = JSON_ARRAY(
        JSON_OBJECT('school', 'Da Nang University', 'degree', 'Bachelor of IT', 'year', '2022')
    ),
    experience = JSON_ARRAY(
        JSON_OBJECT('company', 'Digital Agency', 'position', 'Fullstack Developer', 'duration', '2022-Present', 'description', 'Build end-to-end web applications')
    ),
    skills = JSON_ARRAY('React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'TypeScript', 'GraphQL', 'AWS'),
    projects = JSON_ARRAY(
        JSON_OBJECT('name', 'Social Media Platform', 'description', 'Full-featured social network', 'tech', 'Next.js, Prisma, PostgreSQL'),
        JSON_OBJECT('name', 'Task Management App', 'description', 'Collaborative project management', 'tech', 'React, Node.js, MongoDB')
    )
WHERE cv_name LIKE '%Fullstack%';
