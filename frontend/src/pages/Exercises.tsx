import React, { useState, useEffect } from 'react'
import { Card, Button, Typography, Space, Tag } from 'antd'
import { BookOutlined, PlayCircleOutlined, TrophyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const { Title, Text } = Typography

type Module = {
  module_id: string
  module_title: string
  description?: string
  order_index?: number
}

const Exercises: React.FC = () => {
  const navigate = useNavigate()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  // Dữ liệu mẫu
  const sampleModules: Module[] = [
    {
      module_id: '1',
      module_title: 'HTML Semantic Elements',
      description: 'Kiểm tra kiến thức về các thẻ HTML semantic',
      order_index: 1
    },
    {
      module_id: '2', 
      module_title: 'CSS Flexbox Layout',
      description: 'Bài tập về Flexbox và responsive design',
      order_index: 2
    },
    {
      module_id: '3',
      module_title: 'JavaScript ES6 Features',
      description: 'Câu hỏi về arrow functions, destructuring, spread operator',
      order_index: 3
    },
    {
      module_id: '4',
      module_title: 'React Hooks',
      description: 'Ôn tập useState, useEffect, useContext',
      order_index: 4
    },
    {
      module_id: '5',
      module_title: 'Node.js Fundamentals',
      description: 'Kiến thức cơ bản về Node.js và Express',
      order_index: 5
    }
  ]

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get('/api/roadmaps')
        const roadmaps = res.data?.data || res.data || []
        if (roadmaps.length > 0) {
          // Lấy modules từ roadmap đầu tiên
          const firstRoadmap = roadmaps[0]
          if (firstRoadmap.modules && firstRoadmap.modules.length > 0) {
            setModules(firstRoadmap.modules.slice(0, 5))
          } else {
            setModules(sampleModules)
          }
        } else {
          setModules(sampleModules)
        }
      } catch (err) {
        console.error('Failed to load modules:', err)
        setModules(sampleModules)
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

  const handleStartQuiz = (moduleId: string) => {
    navigate(`/exercises/${moduleId}`)
  }

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 64px)',
      background: '#f5f7fa'
    }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #e6f7ff 0%, #f5f5f5 100%)',
        padding: '80px 24px',
        borderBottom: '1px solid #e0e0e0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <BookOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 24 }} />
          <Title level={1} style={{ 
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 16,
            color: '#1a1a1a'
          }}>
            ✍️ Bài tập ôn tập
          </Title>
          <Text style={{ fontSize: 18, color: '#666' }}>
            Kiểm tra kiến thức của bạn với 5 câu hỏi trắc nghiệm
          </Text>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto',
        padding: '48px 24px'
      }}>
        <div style={{ marginBottom: 32 }}>
          <Title level={2} style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Các bài tập có sẵn
          </Title>
          <Text type="secondary" style={{ fontSize: 15 }}>
            Mỗi bài có 5 câu hỏi trắc nghiệm • Hoàn thành để nhận điểm
          </Text>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: 24
        }}>
          {modules.map((module, index) => (
            <Card
              key={module.module_id}
              hoverable
              style={{ 
                borderRadius: 16,
                border: '2px solid #e8e8e8',
                height: '100%'
              }}
              bodyStyle={{ padding: 24 }}
            >
              <div style={{ marginBottom: 20 }}>
                <div style={{ 
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <BookOutlined style={{ fontSize: 28, color: 'white' }} />
                </div>
                
                <Tag color="blue" style={{ marginBottom: 12 }}>
                  {module.order_index ? `Module ${module.order_index}` : `Bài ${index + 1}`}
                </Tag>
                
                <Title level={4} style={{ 
                  fontSize: 18,
                  marginBottom: 12,
                  minHeight: 50
                }}>
                  {module.module_title}
                </Title>
                
                <Text type="secondary" style={{ 
                  fontSize: 14,
                  display: 'block',
                  marginBottom: 16,
                  minHeight: 40
                }}>
                  {module.description || 'Kiểm tra kiến thức của bạn với 5 câu hỏi trắc nghiệm'}
                </Text>
              </div>

              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 16,
                borderTop: '1px solid #f0f0f0'
              }}>
                <Space size={16}>
                  <Space size={4}>
                    <PlayCircleOutlined style={{ color: '#1890ff' }} />
                    <Text type="secondary" style={{ fontSize: 13 }}>5 câu hỏi</Text>
                  </Space>
                  <Space size={4}>
                    <TrophyOutlined style={{ color: '#faad14' }} />
                    <Text type="secondary" style={{ fontSize: 13 }}>100 điểm</Text>
                  </Space>
                </Space>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={() => handleStartQuiz(module.module_id)}
                style={{ 
                  marginTop: 20,
                  height: 44,
                  borderRadius: 8,
                  fontWeight: 600
                }}
              >
                Bắt đầu ôn tập
              </Button>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <Card style={{ 
          marginTop: 48,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #fff7e6 0%, #ffffff 100%)',
          border: '2px solid #ffd666'
        }}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#faad14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrophyOutlined style={{ fontSize: 20, color: 'white' }} />
              </div>
              <div>
                <Text strong style={{ fontSize: 16, display: 'block' }}>
                  💡 Mẹo làm bài
                </Text>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Đọc kỹ câu hỏi trước khi chọn đáp án • Bạn có thể quay lại câu trước • Cần đạt 60% để đạt
                </Text>
              </div>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  )
}

export default Exercises
