import React from 'react'
import { Row, Col, Card, Typography, Collapse, Tag } from 'antd'
import { BulbOutlined, StarOutlined, CheckCircleOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse

const interviewTips = [
  {
    id: 1,
    category: 'Behavioral',
    question: 'Tell me about yourself',
    tip: 'Sử dụng công thức Present-Past-Future: Hiện tại bạn đang làm gì, quá khứ bạn đã làm gì, tương lai bạn muốn gì.',
    example: 'Hiện tại tôi là sinh viên năm 3 chuyên ngành CNTT, đang tập trung vào web development. Trước đây tôi đã hoàn thành 2 dự án fullstack và 1 internship 3 tháng. Tương lai tôi muốn trở thành fullstack developer chuyên nghiệp.',
    level: 'easy'
  },
  {
    id: 2,
    category: 'Technical',
    question: 'Explain the difference between var, let, and const in JavaScript',
    tip: 'Nhấn mạnh scope, hoisting, và re-assignment. Đưa ví dụ cụ thể cho từng trường hợp.',
    example: 'var: function-scoped, hoisted, có thể re-assign. let: block-scoped, không hoisted, có thể re-assign. const: block-scoped, không hoisted, KHÔNG thể re-assign (nhưng object properties vẫn mutable).',
    level: 'medium'
  },
  {
    id: 3,
    category: 'Behavioral',
    question: 'Describe a challenging project you worked on',
    tip: 'Dùng phương pháp STAR: Situation (tình huống), Task (nhiệm vụ), Action (hành động), Result (kết quả).',
    example: 'Situation: Dự án e-commerce deadline gấp. Task: Tối ưu performance từ 5s xuống <2s. Action: Implement lazy loading, code splitting, caching. Result: Giảm load time xuống 1.5s, tăng conversion 15%.',
    level: 'medium'
  },
  {
    id: 4,
    category: 'Technical',
    question: 'What is closure in JavaScript?',
    tip: 'Giải thích đơn giản: function bên trong có thể access biến từ function bên ngoài. Đưa ví dụ thực tế.',
    example: 'Closure là khi inner function "nhớ" scope của outer function ngay cả khi outer function đã return. Ví dụ: counter function, private variables, event handlers.',
    level: 'hard'
  },
  {
    id: 5,
    category: 'Behavioral',
    question: 'Why do you want to work here?',
    tip: 'Research công ty trước! Kết nối giá trị cá nhân với mission công ty. Tránh nói về lương.',
    example: 'Tôi thấy công ty focus vào innovation trong fintech, đúng với passion của tôi. Tech stack React/Node cũng match với skillset tôi đang phát triển. Văn hoá learning & growth ở đây rất phù hợp.',
    level: 'easy'
  },
  {
    id: 6,
    category: 'Technical',
    question: 'Explain event loop in Node.js',
    tip: 'Vẽ diagram nếu được! Giải thích: call stack → callback queue → event loop check.',
    example: 'Event loop kiểm tra call stack có empty không. Nếu empty, lấy callback từ queue đưa vào stack. Phases: timers → pending → poll → check → close. Microtasks (promises) ưu tiên hơn macrotasks (setTimeout).',
    level: 'hard'
  },
  {
    id: 7,
    category: 'Behavioral',
    question: 'What are your weaknesses?',
    tip: 'Chọn weakness thật nhưng không critical, và QUAN TRỌNG: nói cách bạn đang improve.',
    example: 'Trước đây tôi hay perfectionism quá mức khiến deadline bị delay. Giờ tôi đã học cách prioritize và ship MVP trước, iterate sau. Dùng agile methodology giúp tôi cải thiện điểm này.',
    level: 'medium'
  },
  {
    id: 8,
    category: 'Technical',
    question: 'What is the difference between SQL and NoSQL?',
    tip: 'So sánh structure, scalability, use cases. Đưa ví dụ cụ thể (MySQL vs MongoDB).',
    example: 'SQL: structured, ACID, vertical scaling, relationships (e.g., PostgreSQL cho banking). NoSQL: flexible schema, eventual consistency, horizontal scaling, denormalized (e.g., MongoDB cho social media, logs).',
    level: 'medium'
  },
  {
    id: 9,
    category: 'Behavioral',
    question: 'How do you handle conflicts in a team?',
    tip: 'Focus vào communication và problem-solving, không blame người khác.',
    example: 'Tôi lắng nghe perspective của cả 2 bên, tìm root cause (thường là miscommunication), propose solution dựa trên data/facts, không emotion. Ví dụ: tranh luận về tech stack → tôi tổ chức meeting so sánh pros/cons cụ thể.',
    level: 'easy'
  },
  {
    id: 10,
    category: 'Technical',
    question: 'Explain RESTful API principles',
    tip: 'Nhắc đến HTTP methods, status codes, stateless, resource-based URLs.',
    example: 'REST principles: 1) Stateless (mỗi request độc lập), 2) Resource-based URLs (/users/123), 3) HTTP methods chuẩn (GET/POST/PUT/DELETE), 4) Status codes đúng (200/201/404/500), 5) JSON format, 6) HATEOAS (hypermedia links).',
    level: 'medium'
  },
  {
    id: 11,
    category: 'Behavioral',
    question: 'Where do you see yourself in 5 years?',
    tip: 'Balance giữa ambition và realism. Align với career path công ty offer.',
    example: 'Trong 2-3 năm đầu, tôi muốn master fullstack development và contribute to architecture decisions. Năm 4-5, tôi mong muốn lead một small team hoặc trở thành senior engineer, mentoring juniors.',
    level: 'easy'
  },
  {
    id: 12,
    category: 'Technical',
    question: 'What is Docker and why use it?',
    tip: 'Giải thích containerization, so sánh với VM, nói về benefits (consistency, portability).',
    example: 'Docker đóng gói app + dependencies thành container. Khác VM (virtualize hardware), Docker virtualize OS. Benefits: "works on my machine" problem solved, easy deployment, resource-efficient, microservices-friendly.',
    level: 'hard'
  }
]

const Exercises: React.FC = () => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'easy': return 'green'
      case 'medium': return 'orange'
      case 'hard': return 'red'
      default: return 'blue'
    }
  }

  const behavioral = interviewTips.filter(tip => tip.category === 'Behavioral')
  const technical = interviewTips.filter(tip => tip.category === 'Technical')

  return (
    <div style={{ padding: '40px 80px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <BulbOutlined style={{ fontSize: 64, color: '#faad14', marginBottom: 16 }} />
        <Title level={1} style={{ fontSize: 42, fontWeight: 700, marginBottom: 16 }}>
          Những câu hỏi mẹo hay khi đi phỏng vấn
        </Title>
        <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 800, margin: '0 auto' }}>
          Tổng hợp các câu hỏi phổ biến nhất trong phỏng vấn kèm theo tips trả lời thông minh
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
        <Col xs={24} md={12}>
          <Card 
            size="small" 
            style={{ 
              background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
              textAlign: 'center',
              borderRadius: 12,
              border: '2px solid #1890ff',
              boxShadow: '0 4px 12px rgba(24,144,255,0.15)'
            }}
            bodyStyle={{ padding: 32 }}
          >
            <StarOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={2} style={{ margin: 0, fontSize: 28 }}>Behavioral Questions</Title>
            <Text style={{ fontSize: 18, fontWeight: 600, color: '#1890ff' }}>{behavioral.length} câu hỏi</Text>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            size="small" 
            style={{ 
              background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
              textAlign: 'center',
              borderRadius: 12,
              border: '2px solid #52c41a',
              boxShadow: '0 4px 12px rgba(82,196,26,0.15)'
            }}
            bodyStyle={{ padding: 32 }}
          >
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
            <Title level={2} style={{ margin: 0, fontSize: 28 }}>Technical Questions</Title>
            <Text style={{ fontSize: 18, fontWeight: 600, color: '#52c41a' }}>{technical.length} câu hỏi</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={12}>
          <Title level={3} style={{ fontSize: 26, marginBottom: 24 }}>
            <StarOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            Behavioral Questions
          </Title>
          <Collapse 
            accordion 
            bordered={false}
            style={{ background: 'transparent' }}
          >
            {behavioral.map((tip) => (
              <Panel
                key={tip.id}
                header={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <Tag color="blue" style={{ fontSize: 13, padding: '4px 12px' }}>
                      {tip.category}
                    </Tag>
                    <Tag color={getLevelColor(tip.level)} style={{ fontSize: 13, padding: '4px 12px' }}>
                      {tip.level}
                    </Tag>
                    <Text strong style={{ flex: 1, fontSize: 15 }}>{tip.question}</Text>
                  </div>
                }
                style={{ marginBottom: 16, border: '1px solid #d9d9d9', borderRadius: 12, background: 'white' }}
              >
                <div style={{ padding: '16px 0' }}>
                  <div style={{ marginBottom: 20 }}>
                    <Text strong style={{ color: '#1890ff', fontSize: 17 }}>💡 Mẹo trả lời:</Text>
                    <Paragraph style={{ marginTop: 12, fontSize: 16, lineHeight: 1.9, color: '#333' }}>
                      {tip.tip}
                    </Paragraph>
                  </div>
                  <div>
                    <Text strong style={{ color: '#52c41a', fontSize: 17 }}>✅ Câu trả lời mẫu:</Text>
                    <Card 
                      size="small" 
                      style={{ marginTop: 12, background: '#fafafa', border: '1px dashed #d9d9d9', borderRadius: 8 }}
                    >
                      <Text style={{ fontSize: 15, fontStyle: 'italic', lineHeight: 1.8 }}>
                        {tip.example}
                      </Text>
                    </Card>
                  </div>
                </div>
              </Panel>
            ))}
          </Collapse>
        </Col>

        <Col xs={24} lg={12}>
          <Title level={3} style={{ fontSize: 26, marginBottom: 24 }}>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
            Technical Questions
          </Title>
          <Collapse 
            accordion 
            bordered={false}
            style={{ background: 'transparent' }}
          >
            {technical.map((tip) => (
              <Panel
                key={tip.id}
                header={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <Tag color="green" style={{ fontSize: 13, padding: '4px 12px' }}>
                      {tip.category}
                    </Tag>
                    <Tag color={getLevelColor(tip.level)} style={{ fontSize: 13, padding: '4px 12px' }}>
                      {tip.level}
                    </Tag>
                    <Text strong style={{ flex: 1, fontSize: 15 }}>{tip.question}</Text>
                  </div>
                }
                style={{ marginBottom: 16, border: '1px solid #d9d9d9', borderRadius: 12, background: 'white' }}
              >
                <div style={{ padding: '16px 0' }}>
                  <div style={{ marginBottom: 20 }}>
                    <Text strong style={{ color: '#1890ff', fontSize: 17 }}>💡 Mẹo trả lời:</Text>
                    <Paragraph style={{ marginTop: 12, fontSize: 16, lineHeight: 1.9, color: '#333' }}>
                      {tip.tip}
                    </Paragraph>
                  </div>
                  <div>
                    <Text strong style={{ color: '#52c41a', fontSize: 17 }}>✅ Câu trả lời mẫu:</Text>
                    <Card 
                      size="small" 
                      style={{ marginTop: 12, background: '#fafafa', border: '1px dashed #d9d9d9', borderRadius: 8 }}
                    >
                      <Text style={{ fontSize: 15, fontStyle: 'italic', lineHeight: 1.8 }}>
                        {tip.example}
                      </Text>
                    </Card>
                  </div>
                </div>
              </Panel>
            ))}
          </Collapse>
        </Col>
      </Row>
    </div>
  )
}

export default Exercises
