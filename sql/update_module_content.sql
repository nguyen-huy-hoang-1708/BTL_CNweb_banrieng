-- Update module descriptions and content for all roadmaps

-- Frontend Developer Roadmap
UPDATE Modules SET 
    description = 'Làm quen với HTML5 và CSS3, hai ngôn ngữ cốt lõi để xây dựng giao diện web. Học cách tạo cấu trúc trang web với HTML semantic và styling với CSS.',
    content = '📚 Nội dung học:\n\n1. HTML5 Fundamentals:\n   - Cấu trúc cơ bản của HTML document\n   - Semantic HTML tags: header, nav, main, section, article, footer\n   - Forms và input validation\n   - Multimedia: audio, video, canvas\n\n2. CSS3 Basics:\n   - Selectors và specificity\n   - Box model: margin, border, padding, content\n   - Colors, backgrounds, và gradients\n   - Text styling và web fonts\n\n3. CSS Layout:\n   - Display properties: block, inline, inline-block\n   - Positioning: static, relative, absolute, fixed, sticky\n   - Flexbox: flex container và flex items\n   - CSS Grid: rows, columns, areas\n\n4. Responsive Design:\n   - Media queries\n   - Mobile-first approach\n   - Viewport meta tag\n   - Responsive images\n\n🎯 Mục tiêu: Sau bài học này, bạn có thể tạo một trang web responsive hoàn chỉnh với HTML và CSS.'
WHERE title LIKE '%HTML%' OR title LIKE '%CSS%' AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Frontend%'
);

UPDATE Modules SET 
    description = 'Học JavaScript từ cơ bản đến nâng cao: biến, functions, arrays, objects, và asynchronous programming. Nắm vững ES6+ features.',
    content = '📚 Nội dung học:\n\n1. JavaScript Basics:\n   - Variables: var, let, const\n   - Data types: primitives và objects\n   - Operators: arithmetic, comparison, logical\n   - Control flow: if/else, switch, loops\n\n2. Functions:\n   - Function declaration vs expression\n   - Arrow functions\n   - Callbacks và higher-order functions\n   - Closures và scope\n\n3. Arrays và Objects:\n   - Array methods: map, filter, reduce, forEach\n   - Object manipulation\n   - Destructuring\n   - Spread và rest operators\n\n4. ES6+ Features:\n   - Template literals\n   - Modules: import/export\n   - Classes và inheritance\n   - Promises và async/await\n\n5. DOM Manipulation:\n   - Selecting elements\n   - Event handling\n   - Creating và modifying elements\n   - Form validation\n\n🎯 Mục tiêu: Viết JavaScript code hiện đại, xử lý events và tương tác với DOM.'
WHERE (title LIKE '%JavaScript%' OR order_index = 2) AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Frontend%'
);

UPDATE Modules SET 
    description = 'Tìm hiểu React - thư viện UI phổ biến nhất. Học về components, props, state, hooks, và cách xây dựng ứng dụng React từ đầu.',
    content = '📚 Nội dung học:\n\n1. React Fundamentals:\n   - JSX syntax\n   - Components: functional vs class\n   - Props và prop types\n   - Rendering lists và conditional rendering\n\n2. State Management:\n   - useState hook\n   - State lifting\n   - Controlled components\n   - Form handling\n\n3. React Hooks:\n   - useEffect: side effects và lifecycle\n   - useContext: global state\n   - useReducer: complex state logic\n   - Custom hooks\n\n4. React Router:\n   - Setting up routes\n   - Navigation và links\n   - Route parameters\n   - Nested routes\n\n5. Performance:\n   - React.memo\n   - useMemo và useCallback\n   - Code splitting với lazy loading\n   - Debugging với React DevTools\n\n🎯 Mục tiêu: Xây dựng single-page applications với React và quản lý state hiệu quả.'
WHERE (title LIKE '%React%' OR order_index = 3) AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Frontend%'
);

-- Backend Developer Roadmap
UPDATE Modules SET 
    description = 'Làm quen với Node.js và cách xây dựng backend với JavaScript. Học về event loop, modules, và asynchronous programming.',
    content = '📚 Nội dung học:\n\n1. Node.js Introduction:\n   - Node.js architecture\n   - V8 engine\n   - Event loop và non-blocking I/O\n   - CommonJS vs ES modules\n\n2. Core Modules:\n   - fs: file system operations\n   - path: working with file paths\n   - http: creating servers\n   - events: event emitter\n\n3. NPM và Package Management:\n   - package.json configuration\n   - Installing dependencies\n   - Semantic versioning\n   - Scripts và automation\n\n4. Asynchronous Patterns:\n   - Callbacks\n   - Promises\n   - Async/await\n   - Error handling\n\n5. Debugging:\n   - Console debugging\n   - Node.js debugger\n   - Chrome DevTools\n   - Error stack traces\n\n🎯 Mục tiêu: Hiểu cách Node.js hoạt động và viết async code an toàn.'
WHERE (title LIKE '%Node%' OR order_index = 1) AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Backend%'
);

UPDATE Modules SET 
    description = 'Học Express.js framework để xây dựng RESTful APIs. Tìm hiểu về routing, middleware, và best practices trong API design.',
    content = '📚 Nội dung học:\n\n1. Express Basics:\n   - Setting up Express app\n   - Routing: GET, POST, PUT, DELETE\n   - Route parameters và query strings\n   - Response methods: json, send, status\n\n2. Middleware:\n   - Built-in middleware: express.json(), express.static()\n   - Third-party middleware: cors, helmet, morgan\n   - Custom middleware\n   - Error handling middleware\n\n3. RESTful API Design:\n   - REST principles\n   - Resource naming conventions\n   - HTTP status codes\n   - API versioning\n\n4. Request Validation:\n   - Input validation với express-validator\n   - Sanitization\n   - Custom validators\n   - Error messages\n\n5. Authentication:\n   - JWT tokens\n   - Password hashing với bcrypt\n   - Protected routes\n   - Authorization middleware\n\n🎯 Mục tiêu: Xây dựng RESTful API hoàn chỉnh với Express và implement authentication.'
WHERE (title LIKE '%Express%' OR title LIKE '%API%' OR order_index = 2) AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Backend%'
);

UPDATE Modules SET 
    description = 'Database fundamentals: SQL queries, database design, và ORM. Học cách làm việc với MySQL/PostgreSQL và Prisma ORM.',
    content = '📚 Nội dung học:\n\n1. SQL Basics:\n   - Database và tables\n   - CRUD operations: INSERT, SELECT, UPDATE, DELETE\n   - WHERE clauses và filtering\n   - ORDER BY và LIMIT\n\n2. Advanced SQL:\n   - JOINs: INNER, LEFT, RIGHT, FULL\n   - Aggregation: COUNT, SUM, AVG, MIN, MAX\n   - GROUP BY và HAVING\n   - Subqueries\n\n3. Database Design:\n   - Entity-Relationship diagrams\n   - Normalization (1NF, 2NF, 3NF)\n   - Primary và foreign keys\n   - Indexes\n\n4. Prisma ORM:\n   - Schema definition\n   - Migrations\n   - CRUD với Prisma Client\n   - Relations và nested queries\n\n5. Transactions:\n   - ACID properties\n   - Transaction isolation levels\n   - Rollback và commit\n   - Handling concurrent updates\n\n🎯 Mục tiêu: Thiết kế database schema và thực hiện complex queries với SQL và Prisma.'
WHERE (title LIKE '%Database%' OR title LIKE '%SQL%' OR order_index = 3) AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Backend%'
);

-- Data Analyst Roadmap
UPDATE Modules SET 
    description = 'Python cơ bản và Pandas library cho data analysis. Học cách load, clean, transform, và analyze data với Python.',
    content = '📚 Nội dung học:\n\n1. Python Basics:\n   - Variables và data types\n   - Lists, tuples, dictionaries, sets\n   - Control flow: if/else, for, while\n   - Functions và modules\n\n2. NumPy:\n   - Arrays và vectorization\n   - Array operations\n   - Broadcasting\n   - Linear algebra basics\n\n3. Pandas Fundamentals:\n   - Series và DataFrame\n   - Reading data: CSV, Excel, SQL\n   - Data inspection: head, tail, info, describe\n   - Indexing và selecting data\n\n4. Data Cleaning:\n   - Handling missing values: fillna, dropna\n   - Data type conversion\n   - Removing duplicates\n   - String operations\n\n5. Data Transformation:\n   - Filtering rows\n   - Creating new columns\n   - Grouping và aggregation\n   - Merging và joining DataFrames\n\n🎯 Mục tiêu: Xử lý và phân tích dữ liệu thực tế với Pandas một cách hiệu quả.'
WHERE (title LIKE '%Python%' OR title LIKE '%Pandas%' OR order_index = 1) AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Data%'
);

UPDATE Modules SET 
    description = 'Data visualization với Matplotlib và Seaborn. Học cách tạo charts, graphs, và dashboards để trình bày insights.',
    content = '📚 Nội dung học:\n\n1. Matplotlib Basics:\n   - Figure và axes\n   - Line plots\n   - Scatter plots\n   - Bar charts và histograms\n\n2. Customization:\n   - Colors và styles\n   - Labels, titles, legends\n   - Subplots\n   - Saving figures\n\n3. Seaborn:\n   - Statistical plots: distplot, boxplot, violinplot\n   - Categorical plots: barplot, countplot\n   - Relationship plots: scatterplot, lineplot\n   - Heatmaps và correlation matrices\n\n4. Advanced Visualizations:\n   - Time series plots\n   - Geographical maps\n   - 3D plots\n   - Interactive plots với Plotly\n\n5. Dashboard Design:\n   - Chart selection best practices\n   - Color theory\n   - Layout principles\n   - Storytelling với data\n\n🎯 Mục tiêu: Tạo visualizations đẹp và có ý nghĩa để communicate insights.'
WHERE (title LIKE '%Visual%' OR order_index = 2) AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Data%'
);

-- AI Engineer Roadmap
UPDATE Modules SET 
    description = 'Machine Learning cơ bản: supervised và unsupervised learning. Học các algorithms phổ biến và cách train models.',
    content = '📚 Nội dung học:\n\n1. ML Fundamentals:\n   - Types of ML: supervised, unsupervised, reinforcement\n   - Training, validation, test sets\n   - Overfitting và underfitting\n   - Bias-variance tradeoff\n\n2. Supervised Learning:\n   - Linear regression\n   - Logistic regression\n   - Decision trees\n   - Random forests\n\n3. Classification:\n   - K-Nearest Neighbors\n   - Support Vector Machines\n   - Naive Bayes\n   - Evaluation metrics: accuracy, precision, recall, F1\n\n4. Unsupervised Learning:\n   - K-means clustering\n   - Hierarchical clustering\n   - Principal Component Analysis (PCA)\n   - Anomaly detection\n\n5. Model Evaluation:\n   - Cross-validation\n   - Confusion matrix\n   - ROC curve và AUC\n   - Hyperparameter tuning\n\n🎯 Mục tiêu: Implement và evaluate ML models cho classification và regression tasks.'
WHERE (title LIKE '%Machine%' OR title LIKE '%ML%' OR order_index = 1) AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%AI%'
);

UPDATE Modules SET 
    description = 'Deep Learning với TensorFlow/PyTorch. Neural networks, CNNs, RNNs, và transfer learning cho computer vision và NLP.',
    content = '📚 Nội dung học:\n\n1. Neural Networks:\n   - Perceptrons\n   - Activation functions: ReLU, sigmoid, tanh\n   - Backpropagation\n   - Gradient descent optimization\n\n2. Deep Learning Frameworks:\n   - TensorFlow/Keras basics\n   - PyTorch fundamentals\n   - Building models\n   - Training loops\n\n3. Convolutional Neural Networks:\n   - Convolution layers\n   - Pooling layers\n   - Image classification\n   - Object detection\n\n4. Recurrent Neural Networks:\n   - LSTM và GRU\n   - Sequence modeling\n   - Text generation\n   - Time series prediction\n\n5. Transfer Learning:\n   - Pre-trained models\n   - Fine-tuning\n   - Feature extraction\n   - Domain adaptation\n\n🎯 Mục tiêu: Build và train deep learning models cho image và text data.'
WHERE (title LIKE '%Deep%' OR title LIKE '%Neural%' OR order_index = 2) AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%AI%'
);

-- Mobile Developer Roadmap
UPDATE Modules SET 
    description = 'React Native fundamentals: components, navigation, và styling. Học cách build cross-platform mobile apps.',
    content = '📚 Nội dung học:\n\n1. React Native Basics:\n   - Setup development environment\n   - Core components: View, Text, Image, ScrollView\n   - StyleSheet và flexbox layout\n   - Platform-specific code\n\n2. User Input:\n   - TextInput và keyboard handling\n   - Touchables: TouchableOpacity, Pressable\n   - Gestures với React Native Gesture Handler\n   - Form validation\n\n3. Navigation:\n   - React Navigation setup\n   - Stack Navigator\n   - Tab Navigator\n   - Drawer Navigator\n\n4. State Management:\n   - Context API\n   - Redux với React Native\n   - Async storage\n   - Network requests với fetch/axios\n\n5. Native Features:\n   - Camera và photo library\n   - Geolocation\n   - Push notifications\n   - Device APIs\n\n🎯 Mục tiêu: Develop mobile apps chạy trên cả iOS và Android với React Native.'
WHERE order_index = 1 AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Mobile%'
);

-- DevOps Engineer Roadmap
UPDATE Modules SET 
    description = 'Docker containerization: images, containers, volumes, và networking. Học cách containerize applications.',
    content = '📚 Nội dung học:\n\n1. Docker Basics:\n   - What is containerization?\n   - Docker vs Virtual Machines\n   - Installing Docker\n   - Docker architecture\n\n2. Images và Containers:\n   - Pulling images từ Docker Hub\n   - Running containers\n   - Container lifecycle\n   - docker run options\n\n3. Dockerfile:\n   - Writing Dockerfile\n   - Build instructions: FROM, RUN, COPY, CMD\n   - Multi-stage builds\n   - Best practices\n\n4. Docker Compose:\n   - docker-compose.yml syntax\n   - Defining services\n   - Networks và volumes\n   - Environment variables\n\n5. Container Orchestration:\n   - Introduction to Kubernetes\n   - Pods và deployments\n   - Services và ingress\n   - Scaling applications\n\n🎯 Mục tiêu: Containerize applications và deploy chúng với Docker và Docker Compose.'
WHERE order_index = 1 AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%DevOps%'
);

-- Game Developer Roadmap
UPDATE Modules SET 
    description = 'Unity fundamentals: GameObject, Components, và Scripting với C#. Học cách tạo 2D/3D games.',
    content = '📚 Nội dung học:\n\n1. Unity Basics:\n   - Unity Editor interface\n   - Scene và GameObject hierarchy\n   - Transform: position, rotation, scale\n   - Prefabs và instantiation\n\n2. Components:\n   - Rigidbody: physics simulation\n   - Collider: collision detection\n   - Renderer: mesh và material\n   - Audio Source\n\n3. C# Scripting:\n   - MonoBehaviour lifecycle\n   - Input handling\n   - Moving objects\n   - Raycasting\n\n4. Game Mechanics:\n   - Player controller\n   - Enemy AI\n   - Health system\n   - Score và UI\n\n5. 2D Game Development:\n   - Sprites và animations\n   - Tilemaps\n   - 2D physics\n   - Particle systems\n\n🎯 Mục tiêu: Tạo một 2D hoặc 3D game đơn giản với Unity và C#.'
WHERE order_index = 1 AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Game%'
);

-- UI/UX Designer Roadmap
UPDATE Modules SET 
    description = 'UX Research và Design Thinking. Học cách understand users và design solutions phù hợp.',
    content = '📚 Nội dung học:\n\n1. UX Fundamentals:\n   - What is UX?\n   - UX vs UI\n   - User-centered design\n   - Design thinking process\n\n2. User Research:\n   - User interviews\n   - Surveys và questionnaires\n   - Usability testing\n   - Analytics và heatmaps\n\n3. Information Architecture:\n   - Site maps\n   - User flows\n   - Card sorting\n   - Navigation design\n\n4. Wireframing:\n   - Low-fidelity sketches\n   - Digital wireframes\n   - Interactive prototypes\n   - Design tools: Figma, Sketch\n\n5. UI Design:\n   - Visual hierarchy\n   - Typography\n   - Color theory\n   - Design systems\n\n🎯 Mục tiêu: Conduct user research và create wireframes/prototypes cho web/mobile apps.'
WHERE order_index = 1 AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%UI%' OR title LIKE '%UX%'
);

-- Fullstack Developer Roadmap
UPDATE Modules SET 
    description = 'Full-stack development với MERN stack. Kết hợp MongoDB, Express, React, Node.js để build complete web apps.',
    content = '📚 Nội dung học:\n\n1. MERN Stack Overview:\n   - Architecture overview\n   - Frontend vs Backend\n   - API communication\n   - Authentication flow\n\n2. MongoDB:\n   - NoSQL concepts\n   - Collections và documents\n   - CRUD operations\n   - Mongoose ODM\n\n3. Backend với Express:\n   - RESTful API design\n   - JWT authentication\n   - File upload\n   - Error handling\n\n4. Frontend với React:\n   - Component architecture\n   - State management với Redux\n   - API integration với axios\n   - Form handling\n\n5. Integration:\n   - Connecting frontend to backend\n   - CORS configuration\n   - Environment variables\n   - Deployment: Heroku, Vercel\n\n🎯 Mục tiêu: Build và deploy a full-stack MERN application from scratch.'
WHERE order_index = 1 AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Fullstack%'
);

-- Cybersecurity Specialist Roadmap
UPDATE Modules SET 
    description = 'Security fundamentals: threats, vulnerabilities, và protection mechanisms. Học cách secure web applications.',
    content = '📚 Nội dung học:\n\n1. Security Basics:\n   - CIA triad: Confidentiality, Integrity, Availability\n   - Common threats: XSS, SQL injection, CSRF\n   - Attack vectors\n   - Security mindset\n\n2. Web Application Security:\n   - OWASP Top 10\n   - Input validation\n   - Authentication best practices\n   - Session management\n\n3. Cryptography:\n   - Encryption: symmetric vs asymmetric\n   - Hashing algorithms\n   - Digital signatures\n   - SSL/TLS\n\n4. Network Security:\n   - Firewalls\n   - VPNs\n   - IDS/IPS\n   - DDoS protection\n\n5. Security Testing:\n   - Penetration testing\n   - Vulnerability scanning\n   - Security audits\n   - Bug bounty programs\n\n🎯 Mục tiêu: Identify và fix common security vulnerabilities trong web applications.'
WHERE order_index = 1 AND roadmap_id IN (
    SELECT roadmap_id FROM Roadmaps WHERE title LIKE '%Cybersecurity%' OR title LIKE '%Security%'
);
