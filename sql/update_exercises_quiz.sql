-- Convert Exercises to multiple choice quiz format with images

-- Frontend React Quiz
UPDATE Exercises SET 
    title = 'React Hooks - useState',
    description = 'Câu hỏi về cách sử dụng useState hook trong React',
    examples = JSON_OBJECT(
        'question', 'Kết quả khi click button sẽ là gì?',
        'image_url', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
        'code', 'const [count, setCount] = useState(0);\nreturn <button onClick={() => setCount(count + 1)}>{count}</button>',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'Counter tăng lên 1'),
            JSON_OBJECT('id', 'B', 'text', 'Counter không thay đổi'),
            JSON_OBJECT('id', 'C', 'text', 'Báo lỗi'),
            JSON_OBJECT('id', 'D', 'text', 'Counter reset về 0')
        ),
        'correct_answer', 'A',
        'explanation', 'useState hook cập nhật state và re-render component khi setCount được gọi'
    ),
    difficulty = 'easy'
WHERE title LIKE '%Build a Todo%' OR title LIKE '%Bài tập 1%' LIMIT 10;

-- JavaScript ES6
UPDATE Exercises SET 
    title = 'JavaScript Arrow Functions',
    description = 'Hiểu về arrow function và context trong JavaScript',
    examples = JSON_OBJECT(
        'question', 'Giá trị của "this" trong arrow function là gì?',
        'image_url', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
        'code', 'const obj = {\n  name: "Alice",\n  greet: () => {\n    console.log(this.name);\n  }\n};\nobj.greet();',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'Alice'),
            JSON_OBJECT('id', 'B', 'text', 'undefined'),
            JSON_OBJECT('id', 'C', 'text', 'window object'),
            JSON_OBJECT('id', 'D', 'text', 'obj object')
        ),
        'correct_answer', 'B',
        'explanation', 'Arrow function không có "this" riêng, nó lấy "this" từ scope bên ngoài (lexical scope)'
    ),
    difficulty = 'medium'
WHERE title LIKE '%Authentication%' OR title LIKE '%Bài tập 2%' LIMIT 10;

-- CSS Flexbox
UPDATE Exercises SET 
    title = 'CSS Flexbox Layout',
    description = 'Bố cục với Flexbox trong CSS',
    examples = JSON_OBJECT(
        'question', 'Thuộc tính nào căn giữa các items theo trục chính?',
        'image_url', 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
        'code', 'display: flex;\nalign-items: center;\njustify-content: ?;',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'align-items: center'),
            JSON_OBJECT('id', 'B', 'text', 'justify-content: center'),
            JSON_OBJECT('id', 'C', 'text', 'flex-direction: center'),
            JSON_OBJECT('id', 'D', 'text', 'text-align: center')
        ),
        'correct_answer', 'B',
        'explanation', 'justify-content căn giữa theo main axis (trục chính), align-items căn giữa theo cross axis'
    ),
    difficulty = 'easy'
WHERE title LIKE '%REST API%' OR title LIKE '%Bài tập 3%' LIMIT 10;

-- Database SQL
UPDATE Exercises SET 
    title = 'SQL JOIN Operations',
    description = 'Hiểu về các loại JOIN trong SQL',
    examples = JSON_OBJECT(
        'question', 'Loại JOIN nào trả về tất cả rows từ bảng trái?',
        'image_url', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
        'code', 'SELECT * FROM users\n? JOIN orders ON users.id = orders.user_id;',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'INNER JOIN'),
            JSON_OBJECT('id', 'B', 'text', 'LEFT JOIN'),
            JSON_OBJECT('id', 'C', 'text', 'RIGHT JOIN'),
            JSON_OBJECT('id', 'D', 'text', 'CROSS JOIN')
        ),
        'correct_answer', 'B',
        'explanation', 'LEFT JOIN (LEFT OUTER JOIN) trả về tất cả rows từ bảng bên trái, kể cả khi không match'
    ),
    difficulty = 'medium'
WHERE title LIKE '%Database%' OR title LIKE '%Bài tập 4%' OR title LIKE '%Bài tập 6%' LIMIT 10;

-- Node.js Async
UPDATE Exercises SET 
    title = 'Node.js Async/Await',
    description = 'Xử lý bất đồng bộ với async/await',
    examples = JSON_OBJECT(
        'question', 'Cách đúng để handle error với async/await?',
        'image_url', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        'code', 'async function getData() {\n  const result = await fetch("/api/data");\n  return result.json();\n}',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'try-catch block'),
            JSON_OBJECT('id', 'B', 'text', '.then().catch()'),
            JSON_OBJECT('id', 'C', 'text', 'if-else statement'),
            JSON_OBJECT('id', 'D', 'text', 'Cả A và B đều đúng')
        ),
        'correct_answer', 'D',
        'explanation', 'Có thể dùng try-catch bên trong async function hoặc .catch() khi gọi function'
    ),
    difficulty = 'medium'
WHERE title LIKE '%Real-time%' OR title LIKE '%Bài tập 5%' OR title LIKE '%Bài tập 7%' LIMIT 10;

-- Python Data Structures
UPDATE Exercises SET 
    title = 'Python Lists vs Tuples',
    description = 'Sự khác biệt giữa List và Tuple trong Python',
    examples = JSON_OBJECT(
        'question', 'Điều gì đúng về Tuple trong Python?',
        'image_url', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
        'code', 'my_tuple = (1, 2, 3)\nmy_tuple[0] = 5  # ???',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'Tuple có thể thay đổi giá trị'),
            JSON_OBJECT('id', 'B', 'text', 'Tuple không thể thay đổi (immutable)'),
            JSON_OBJECT('id', 'C', 'text', 'Tuple nhanh hơn List'),
            JSON_OBJECT('id', 'D', 'text', 'Cả B và C đều đúng')
        ),
        'correct_answer', 'D',
        'explanation', 'Tuple là immutable (không thể thay đổi) và nhanh hơn List do không cần hỗ trợ các operation thay đổi'
    ),
    difficulty = 'easy'
WHERE title LIKE '%Deploy%' OR title LIKE '%Bài tập 8%' OR title LIKE '%Bài tập 9%' LIMIT 10;

-- Git Version Control
UPDATE Exercises SET 
    title = 'Git Branching Strategy',
    description = 'Hiểu về Git branching và merge',
    examples = JSON_OBJECT(
        'question', 'Lệnh nào tạo branch mới và chuyển sang branch đó?',
        'image_url', 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80',
        'code', 'git ??? feature-login',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'git branch feature-login'),
            JSON_OBJECT('id', 'B', 'text', 'git checkout -b feature-login'),
            JSON_OBJECT('id', 'C', 'text', 'git switch feature-login'),
            JSON_OBJECT('id', 'D', 'text', 'git merge feature-login')
        ),
        'correct_answer', 'B',
        'explanation', 'git checkout -b tạo branch mới và chuyển sang branch đó ngay lập tức. git switch -c cũng tương tự'
    ),
    difficulty = 'easy'
WHERE title LIKE '%Bài tập 10%' LIMIT 10;

-- REST API Design
UPDATE Exercises SET 
    title = 'RESTful API Best Practices',
    description = 'Thiết kế RESTful API đúng chuẩn',
    examples = JSON_OBJECT(
        'question', 'HTTP method nào để update một phần resource?',
        'image_url', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        'code', 'PATCH /api/users/123\n{"email": "new@email.com"}',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'POST - tạo mới resource'),
            JSON_OBJECT('id', 'B', 'text', 'PUT - thay thế toàn bộ resource'),
            JSON_OBJECT('id', 'C', 'text', 'PATCH - update một phần'),
            JSON_OBJECT('id', 'D', 'text', 'UPDATE - update resource')
        ),
        'correct_answer', 'C',
        'explanation', 'PATCH dùng để update một phần resource, PUT thay thế toàn bộ resource'
    ),
    difficulty = 'medium'
WHERE title NOT IN (
    SELECT title FROM (
        SELECT title FROM Exercises 
        WHERE title IN ('React Hooks - useState', 'JavaScript Arrow Functions', 'CSS Flexbox Layout', 
                       'SQL JOIN Operations', 'Node.js Async/Await', 'Python Lists vs Tuples', 
                       'Git Branching Strategy', 'RESTful API Best Practices')
    ) AS temp
) LIMIT 12;

-- TypeScript Generics
UPDATE Exercises SET 
    title = 'TypeScript Generics',
    description = 'Sử dụng Generics trong TypeScript',
    examples = JSON_OBJECT(
        'question', 'Kết quả kiểu dữ liệu của result là gì?',
        'image_url', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
        'code', 'function identity<T>(arg: T): T {\n  return arg;\n}\nconst result = identity("hello");',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'any'),
            JSON_OBJECT('id', 'B', 'text', 'string'),
            JSON_OBJECT('id', 'C', 'text', 'T'),
            JSON_OBJECT('id', 'D', 'text', 'unknown')
        ),
        'correct_answer', 'B',
        'explanation', 'TypeScript infer kiểu T là string từ argument, nên result có type string'
    ),
    difficulty = 'hard'
WHERE title NOT IN (
    SELECT title FROM (
        SELECT title FROM Exercises 
        WHERE title IN ('React Hooks - useState', 'JavaScript Arrow Functions', 'CSS Flexbox Layout', 
                       'SQL JOIN Operations', 'Node.js Async/Await', 'Python Lists vs Tuples', 
                       'Git Branching Strategy', 'RESTful API Best Practices', 'TypeScript Generics')
    ) AS temp
) LIMIT 12;

-- Docker Containers
UPDATE Exercises SET 
    title = 'Docker Containerization',
    description = 'Hiểu về Docker containers và images',
    examples = JSON_OBJECT(
        'question', 'Lệnh nào chạy container từ image?',
        'image_url', 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80',
        'code', 'docker ??? -p 3000:3000 myapp:latest',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'docker start'),
            JSON_OBJECT('id', 'B', 'text', 'docker run'),
            JSON_OBJECT('id', 'C', 'text', 'docker create'),
            JSON_OBJECT('id', 'D', 'text', 'docker exec')
        ),
        'correct_answer', 'B',
        'explanation', 'docker run tạo và chạy container mới từ image. Flag -p map port host:container'
    ),
    difficulty = 'medium'
WHERE title NOT IN (
    SELECT title FROM (
        SELECT title FROM Exercises 
        WHERE title IN ('React Hooks - useState', 'JavaScript Arrow Functions', 'CSS Flexbox Layout', 
                       'SQL JOIN Operations', 'Node.js Async/Await', 'Python Lists vs Tuples', 
                       'Git Branching Strategy', 'RESTful API Best Practices', 'TypeScript Generics',
                       'Docker Containerization')
    ) AS temp
) LIMIT 15;
