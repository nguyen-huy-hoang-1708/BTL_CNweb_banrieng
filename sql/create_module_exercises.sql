-- Delete old exercises and create new ones organized by module
-- Each module will have exactly 3 quiz questions

DELETE FROM Exercises;

-- Frontend Developer - Module 1: HTML & CSS Basics
INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'HTML Semantic Elements',
    'Câu hỏi về HTML5 semantic tags',
    JSON_OBJECT(
        'question', 'Tag HTML nào dùng để đánh dấu phần header của trang?',
        'image_url', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
        'code', '<??? class="site-header">\n  <h1>My Website</h1>\n</???>',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', '<div>'),
            JSON_OBJECT('id', 'B', 'text', '<header>'),
            JSON_OBJECT('id', 'C', 'text', '<section>'),
            JSON_OBJECT('id', 'D', 'text', '<nav>')
        ),
        'correct_answer', 'B',
        'explanation', '<header> là semantic tag dùng để đánh dấu phần đầu của trang hoặc section'
    ),
    'easy'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Frontend%' AND m.order_index = 1;

INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'CSS Box Model',
    'Hiểu về box model trong CSS',
    JSON_OBJECT(
        'question', 'Thứ tự từ trong ra ngoài của CSS box model là gì?',
        'image_url', 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
        'code', '.box {\n  padding: 10px;\n  border: 2px solid;\n  margin: 20px;\n}',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'content → padding → border → margin'),
            JSON_OBJECT('id', 'B', 'text', 'content → margin → padding → border'),
            JSON_OBJECT('id', 'C', 'text', 'content → border → padding → margin'),
            JSON_OBJECT('id', 'D', 'text', 'margin → border → padding → content')
        ),
        'correct_answer', 'A',
        'explanation', 'Box model từ trong ra ngoài: content (nội dung) → padding (đệm) → border (viền) → margin (khoảng cách ngoài)'
    ),
    'easy'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Frontend%' AND m.order_index = 1;

INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'CSS Flexbox',
    'Căn chỉnh items với Flexbox',
    JSON_OBJECT(
        'question', 'Thuộc tính nào căn giữa items theo cả 2 trục?',
        'image_url', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        'code', '.container {\n  display: flex;\n  justify-content: center;\n  align-items: ???;\n}',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'align-items: middle'),
            JSON_OBJECT('id', 'B', 'text', 'align-items: center'),
            JSON_OBJECT('id', 'C', 'text', 'align-content: center'),
            JSON_OBJECT('id', 'D', 'text', 'justify-items: center')
        ),
        'correct_answer', 'B',
        'explanation', 'align-items: center căn giữa theo cross axis (trục phụ), kết hợp với justify-content: center để căn giữa cả 2 trục'
    ),
    'easy'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Frontend%' AND m.order_index = 1;

-- Frontend Developer - Module 2: JavaScript Fundamentals
INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'JavaScript Variables',
    'Phân biệt var, let, const',
    JSON_OBJECT(
        'question', 'Từ khóa nào tạo biến không thể gán lại giá trị?',
        'image_url', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
        'code', '??? PI = 3.14;\nPI = 3.14159; // Error!',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'var'),
            JSON_OBJECT('id', 'B', 'text', 'let'),
            JSON_OBJECT('id', 'C', 'text', 'const'),
            JSON_OBJECT('id', 'D', 'text', 'static')
        ),
        'correct_answer', 'C',
        'explanation', 'const tạo biến hằng số, không thể gán lại giá trị (immutable binding)'
    ),
    'easy'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Frontend%' AND m.order_index = 2;

INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'Arrow Functions',
    'Cú pháp arrow function',
    JSON_OBJECT(
        'question', 'Cách viết arrow function nào đúng?',
        'image_url', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
        'code', 'const add = ??? => a + b;',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', '(a, b)'),
            JSON_OBJECT('id', 'B', 'text', 'function(a, b)'),
            JSON_OBJECT('id', 'C', 'text', '[a, b]'),
            JSON_OBJECT('id', 'D', 'text', '{a, b}')
        ),
        'correct_answer', 'A',
        'explanation', 'Arrow function với nhiều params dùng dấu ngoặc đơn: (a, b) => expression'
    ),
    'easy'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Frontend%' AND m.order_index = 2;

INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'Array Methods',
    'Các phương thức array trong JS',
    JSON_OBJECT(
        'question', 'Method nào trả về array mới với các phần tử đã transform?',
        'image_url', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        'code', 'const nums = [1, 2, 3];\nconst doubled = nums.???(x => x * 2);',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'forEach'),
            JSON_OBJECT('id', 'B', 'text', 'filter'),
            JSON_OBJECT('id', 'C', 'text', 'map'),
            JSON_OBJECT('id', 'D', 'text', 'reduce')
        ),
        'correct_answer', 'C',
        'explanation', 'map() transform từng phần tử và trả về array mới. forEach không return, filter để lọc, reduce để gộp'
    ),
    'medium'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Frontend%' AND m.order_index = 2;

-- Frontend Developer - Module 3: React Basics
INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'React useState Hook',
    'Quản lý state với useState',
    JSON_OBJECT(
        'question', 'Cách đúng để update state counter?',
        'image_url', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
        'code', 'const [count, setCount] = useState(0);\nsetCount(???);',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'count + 1'),
            JSON_OBJECT('id', 'B', 'text', 'count++'),
            JSON_OBJECT('id', 'C', 'text', 'prev => prev + 1'),
            JSON_OBJECT('id', 'D', 'text', 'Cả A và C đều đúng')
        ),
        'correct_answer', 'D',
        'explanation', 'Có thể dùng setCount(count + 1) hoặc setCount(prev => prev + 1). Dạng function an toàn hơn với batching'
    ),
    'medium'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Frontend%' AND m.order_index = 3;

INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'React Props',
    'Truyền dữ liệu qua props',
    JSON_OBJECT(
        'question', 'Cách nhận props trong functional component?',
        'image_url', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
        'code', 'function Greeting(???) {\n  return <h1>Hello {name}</h1>;\n}',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', '{name}'),
            JSON_OBJECT('id', 'B', 'text', 'props'),
            JSON_OBJECT('id', 'C', 'text', 'this.props'),
            JSON_OBJECT('id', 'D', 'text', 'Cả A và B đều đúng')
        ),
        'correct_answer', 'D',
        'explanation', 'Có thể dùng props rồi access props.name, hoặc destructure trực tiếp {name} trong parameter'
    ),
    'easy'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Frontend%' AND m.order_index = 3;

INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'React useEffect',
    'Side effects với useEffect',
    JSON_OBJECT(
        'question', 'useEffect chạy khi nào nếu dependency array rỗng?',
        'image_url', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        'code', 'useEffect(() => {\n  fetchData();\n}, []);',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'Mỗi lần component re-render'),
            JSON_OBJECT('id', 'B', 'text', 'Chỉ 1 lần sau khi mount'),
            JSON_OBJECT('id', 'C', 'text', 'Khi props thay đổi'),
            JSON_OBJECT('id', 'D', 'text', 'Không bao giờ chạy')
        ),
        'correct_answer', 'B',
        'explanation', 'Dependency array rỗng [] nghĩa là effect chỉ chạy 1 lần sau khi component mount, giống componentDidMount'
    ),
    'medium'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Frontend%' AND m.order_index = 3;

-- Backend Developer - Module 1: Node.js Basics
INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'Node.js Module System',
    'Import/Export modules trong Node',
    JSON_OBJECT(
        'question', 'Cách export function trong CommonJS?',
        'image_url', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        'code', '??? = function add(a, b) {\n  return a + b;\n};',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'export.add'),
            JSON_OBJECT('id', 'B', 'text', 'module.exports.add'),
            JSON_OBJECT('id', 'C', 'text', 'exports = add'),
            JSON_OBJECT('id', 'D', 'text', 'export default add')
        ),
        'correct_answer', 'B',
        'explanation', 'CommonJS dùng module.exports hoặc exports (không gán trực tiếp exports = ...)'
    ),
    'easy'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Backend%' AND m.order_index = 1;

INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'Async/Await',
    'Xử lý bất đồng bộ',
    JSON_OBJECT(
        'question', 'Từ khóa nào đợi Promise resolve?',
        'image_url', 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80',
        'code', 'async function getData() {\n  const result = ??? fetch("/api");\n  return result;\n}',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'wait'),
            JSON_OBJECT('id', 'B', 'text', 'await'),
            JSON_OBJECT('id', 'C', 'text', 'then'),
            JSON_OBJECT('id', 'D', 'text', 'promise')
        ),
        'correct_answer', 'B',
        'explanation', 'await đợi Promise resolve, chỉ dùng được trong async function'
    ),
    'medium'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Backend%' AND m.order_index = 1;

INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'Error Handling',
    'Xử lý lỗi trong async code',
    JSON_OBJECT(
        'question', 'Cách handle error với async/await?',
        'image_url', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
        'code', 'async function fetchData() {\n  ??? {\n    const data = await fetch("/api");\n  } ??? (error) {\n    console.log(error);\n  }\n}',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'try / catch'),
            JSON_OBJECT('id', 'B', 'text', 'if / else'),
            JSON_OBJECT('id', 'C', 'text', 'switch / case'),
            JSON_OBJECT('id', 'D', 'text', 'await / error')
        ),
        'correct_answer', 'A',
        'explanation', 'try/catch block dùng để bắt lỗi trong async/await code'
    ),
    'medium'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Backend%' AND m.order_index = 1;

-- Backend Developer - Module 2: Express & APIs
INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'Express Routes',
    'Định nghĩa routes trong Express',
    JSON_OBJECT(
        'question', 'HTTP method nào để lấy dữ liệu?',
        'image_url', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
        'code', 'app.???("/api/users", (req, res) => {\n  res.json(users);\n});',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'post'),
            JSON_OBJECT('id', 'B', 'text', 'get'),
            JSON_OBJECT('id', 'C', 'text', 'put'),
            JSON_OBJECT('id', 'D', 'text', 'delete')
        ),
        'correct_answer', 'B',
        'explanation', 'GET method dùng để retrieve (lấy) dữ liệu từ server'
    ),
    'easy'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Backend%' AND m.order_index = 2;

INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'Express Middleware',
    'Sử dụng middleware',
    JSON_OBJECT(
        'question', 'Middleware function có bao nhiêu parameters?',
        'image_url', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        'code', 'app.use((req, res, next) => {\n  console.log("Request received");\n  next();\n});',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', '2 (req, res)'),
            JSON_OBJECT('id', 'B', 'text', '3 (req, res, next)'),
            JSON_OBJECT('id', 'C', 'text', '4 (err, req, res, next)'),
            JSON_OBJECT('id', 'D', 'text', 'B và C đều đúng')
        ),
        'correct_answer', 'D',
        'explanation', 'Middleware thường có 3 params (req, res, next), error middleware có 4 (err, req, res, next)'
    ),
    'medium'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Backend%' AND m.order_index = 2;

INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'RESTful API Design',
    'Thiết kế REST API',
    JSON_OBJECT(
        'question', 'Endpoint nào đúng RESTful convention?',
        'image_url', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
        'code', 'DELETE ??? // Xóa user có id = 123',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', '/deleteUser?id=123'),
            JSON_OBJECT('id', 'B', 'text', '/users/delete/123'),
            JSON_OBJECT('id', 'C', 'text', '/users/123'),
            JSON_OBJECT('id', 'D', 'text', '/api/deleteUser/123')
        ),
        'correct_answer', 'C',
        'explanation', 'RESTful dùng HTTP method + resource path. DELETE /users/123 là chuẩn REST'
    ),
    'medium'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Backend%' AND m.order_index = 2;

-- Data Analyst - Module 1: Python & Pandas
INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'Pandas DataFrame',
    'Làm việc với DataFrame',
    JSON_OBJECT(
        'question', 'Cách đọc CSV file vào DataFrame?',
        'image_url', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        'code', 'import pandas as pd\ndf = pd.???(''data.csv'')',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'read_csv'),
            JSON_OBJECT('id', 'B', 'text', 'load_csv'),
            JSON_OBJECT('id', 'C', 'text', 'import_csv'),
            JSON_OBJECT('id', 'D', 'text', 'from_csv')
        ),
        'correct_answer', 'A',
        'explanation', 'pd.read_csv() là function để đọc CSV file vào DataFrame'
    ),
    'easy'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Data%' AND m.order_index = 1;

INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'Data Filtering',
    'Lọc dữ liệu trong DataFrame',
    JSON_OBJECT(
        'question', 'Cách lọc rows có age > 18?',
        'image_url', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
        'code', 'df[df[???] > 18]',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', '"age"'),
            JSON_OBJECT('id', 'B', 'text', 'age'),
            JSON_OBJECT('id', 'C', 'text', '.age'),
            JSON_OBJECT('id', 'D', 'text', 'Cả A và C')
        ),
        'correct_answer', 'D',
        'explanation', 'Có thể dùng df["age"] hoặc df.age để access column, nhưng df["age"] an toàn hơn'
    ),
    'easy'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Data%' AND m.order_index = 1;

INSERT INTO Exercises (exercise_id, module_id, title, description, examples, difficulty) 
SELECT 
    UUID(),
    m.module_id,
    'Data Aggregation',
    'Tính toán thống kê',
    JSON_OBJECT(
        'question', 'Function nào tính giá trị trung bình?',
        'image_url', 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80',
        'code', 'df["salary"].???()',
        'choices', JSON_ARRAY(
            JSON_OBJECT('id', 'A', 'text', 'average()'),
            JSON_OBJECT('id', 'B', 'text', 'mean()'),
            JSON_OBJECT('id', 'C', 'text', 'avg()'),
            JSON_OBJECT('id', 'D', 'text', 'median()')
        ),
        'correct_answer', 'B',
        'explanation', 'mean() tính trung bình cộng, median() tính trung vị'
    ),
    'easy'
FROM Modules m
JOIN Roadmaps r ON m.roadmap_id = r.roadmap_id
WHERE r.title LIKE '%Data%' AND m.order_index = 1;
