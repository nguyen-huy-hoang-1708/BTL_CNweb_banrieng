import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Spin, Alert, Typography, Space, Tag, Divider, message } from 'antd'
import { ArrowLeftOutlined, BookOutlined } from '@ant-design/icons'
import api from '../services/api'

const { Title, Paragraph, Text } = Typography

type Module = {
  module_id: string
  title: string
  description?: string
  content?: string
  order_index: number
  estimated_hours?: number
}

type Exercise = {
  exercise_id: string
  title: string
  description: string
  difficulty?: string
  examples?: {
    question?: string
    image_url?: string
    code?: string
    choices?: Array<{ id: string; text: string }>
    correct_answer?: string
    explanation?: string
  }
}

const ModuleDetail: React.FC = () => {
  const { roadmapId, moduleId } = useParams<{ roadmapId: string; moduleId: string }>()
  const navigate = useNavigate()
  const [module, setModule] = useState<Module | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadModuleData()
  }, [moduleId])

  const loadModuleData = async () => {
    try {
      setLoading(true)
      
      // Fetch modules to find the current one
      const modulesRes = await api.get(`/api/roadmaps/${roadmapId}/modules`)
      const modules = modulesRes.data?.data || modulesRes.data || []
      const currentModule = modules.find((m: Module) => m.module_id === moduleId)
      setModule(currentModule || null)

      // Fetch exercises for this module
      const exercisesRes = await api.get(`/api/exercises?moduleId=${moduleId}`)
      const exercisesData = exercisesRes.data?.data || exercisesRes.data || []
      setExercises(Array.isArray(exercisesData) ? exercisesData : [])
    } catch (err: any) {
      message.error('Không thể tải nội dung bài học')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!module) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Alert message="Không tìm thấy bài học" type="error" showIcon />
        <Button type="primary" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
          Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 80px' }}>
      {/* Header */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: 24, height: 38, fontSize: 14 }}
        size="middle"
      >
        Quay lại khóa học
      </Button>

      {/* Module Info */}
      <Card style={{ marginBottom: 32, borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Space align="center">
            <BookOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 700 }}>{module.title}</Title>
          </Space>
          {module.estimated_hours && (
            <Tag color="purple" style={{ fontSize: 15, padding: '6px 16px', borderRadius: 16 }}>
              ⏱️ Thời lượng: {module.estimated_hours} giờ
            </Tag>
          )}
        </Space>
      </Card>

      {/* Module Description */}
      {module.description && (
        <Card 
          title={<Text strong style={{ fontSize: 18 }}>📋 Mô tả bài học</Text>}
          style={{ marginBottom: 32, borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          <Paragraph style={{ fontSize: 16, lineHeight: 1.9, color: '#333' }}>
            {module.description}
          </Paragraph>
        </Card>
      )}

      {/* Module Content */}
      {module.content && (
        <Card 
          title={<Text strong style={{ fontSize: 18 }}>📖 Nội dung chi tiết</Text>}
          style={{ marginBottom: 32, borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          <Paragraph style={{ fontSize: 16, lineHeight: 1.9, whiteSpace: 'pre-wrap', color: '#333' }}>
            {module.content}
          </Paragraph>
        </Card>
      )}

      <Divider style={{ margin: '48px 0' }} />

      {/* Quiz Section */}
      {exercises.length > 0 && (
        <Card style={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ fontSize: 32, fontWeight: 700 }}>✍️ Bài tập ôn tập</Title>
              <Paragraph style={{ fontSize: 16, color: '#666' }}>
                Kiểm tra kiến thức của bạn với 5 câu hỏi trắc nghiệm
              </Paragraph>
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate(`/exercises/${moduleId}`)}
                style={{ height: 44, padding: '0 32px', fontSize: 16, fontWeight: 600, borderRadius: 8 }}
              >
                Bắt đầu ôn tập
              </Button>
            </div>
          </Space>
        </Card>
      )}
    </div>
  )
}

export default ModuleDetail
