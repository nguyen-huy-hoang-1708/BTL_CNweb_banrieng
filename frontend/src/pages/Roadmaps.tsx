import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Spin, Alert, Empty, Tag, Modal, Typography, Space, message, List } from 'antd'
import { BookOutlined, CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const { Title, Paragraph, Text } = Typography

type Roadmap = {
  roadmap_id: string
  title: string
  description?: string
  category?: string
  image_url?: string
  status?: string
}

type Module = {
  module_id: string
  title: string
  description?: string
  content?: string
  order_index: number
  estimated_hours?: number
}

const Roadmaps: React.FC = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    loadRoadmaps()
  }, [])

  const loadRoadmaps = () => {
    setLoading(true)
    api
      .get('/api/roadmaps')
      .then((res) => {
        const data = res.data?.data || res.data || []
        setItems(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        setError(err.message || 'Failed to load roadmaps')
        setItems([])
      })
      .finally(() => setLoading(false))
  }

  const handleViewDetails = async (roadmap: Roadmap) => {
    try {
      setSelectedRoadmap(roadmap)
      
      // Fetch modules
      const modulesRes = await api.get(`/api/roadmaps/${roadmap.roadmap_id}/modules`)
      const modulesData = modulesRes.data?.data || modulesRes.data || []
      setModules(Array.isArray(modulesData) ? modulesData.sort((a: Module, b: Module) => a.order_index - b.order_index) : [])
      
      setModalVisible(true)
    } catch (err: any) {
      message.error('Failed to load roadmap details')
    }
  }

  const handleEnroll = async (roadmapId: string) => {
    try {
      await api.post(`/api/roadmaps/${roadmapId}/enroll`)
      message.success('Successfully enrolled in roadmap!')
      setModalVisible(false)
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to enroll')
    }
  }

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '48px auto' }} />
  if (error) return <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />

  return (
    <div style={{ padding: '40px 60px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <Title level={1} style={{ fontSize: 42, fontWeight: 700, marginBottom: 12 }}>
          Explore Learning Paths
        </Title>
        <Paragraph style={{ fontSize: 18, color: '#666' }}>
          Choose your journey and master in-demand skills
        </Paragraph>
      </div>

      {items.length === 0 ? (
        <Empty description="No roadmaps available" />
      ) : (
        <Row gutter={[32, 32]}>
          {items.map((item) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={item.roadmap_id}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                }}
                cover={
                  item.image_url ? (
                    <div style={{ height: 200, overflow: 'hidden' }}>
                      <img
                        alt={item.title}
                        src={item.image_url}
                        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = `<div style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center;"><span style="font-size: 64px;">📚</span></div>`
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ 
                      height: 200, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <BookOutlined style={{ fontSize: 64, color: 'white' }} />
                    </div>
                  )
                }
                bodyStyle={{ padding: '20px', textAlign: 'center' }}
              >
                <Title 
                  level={4} 
                  style={{ 
                    marginBottom: 12, 
                    fontSize: 18,
                    fontWeight: 600,
                    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                    textAlign: 'center',
                    minHeight: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {item.title}
                </Title>
                <Paragraph 
                  ellipsis={{ rows: 2 }} 
                  style={{ 
                    color: '#666', 
                    fontSize: 14, 
                    marginBottom: 16,
                    minHeight: 42,
                    textAlign: 'center'
                  }}
                >
                  {item.description || 'Comprehensive learning path'}
                </Paragraph>
                <Space direction="vertical" style={{ width: '100%' }} size={8}>
                  {item.category && (
                    <Tag color="blue" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 12 }}>
                      {item.category}
                    </Tag>
                  )}
                  {item.status === 'published' && (
                    <Tag color="green" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 12 }}>
                      Published
                    </Tag>
                  )}
                  <Button 
                    type="primary" 
                    block 
                    style={{ 
                      marginTop: 8, 
                      borderRadius: 8,
                      height: 40,
                      fontSize: 15,
                      fontWeight: 600
                    }}
                    onClick={() => handleViewDetails(item)}
                  >
                    View Course
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={
          <Space>
            <BookOutlined />
            <span>{selectedRoadmap?.title}</span>
            {selectedRoadmap?.category && <Tag color="blue">{selectedRoadmap.category}</Tag>}
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="enroll"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => selectedRoadmap && handleEnroll(selectedRoadmap.roadmap_id)}
          >
            Đăng ký học
          </Button>,
        ]}
        width={800}
      >
        {selectedRoadmap && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Paragraph style={{ fontSize: 15 }}>{selectedRoadmap.description}</Paragraph>

            <div>
              <Title level={4}>📚 Danh sách bài học ({modules.length} bài)</Title>
              
              {modules.length === 0 ? (
                <Empty description="Chưa có bài học nào" />
              ) : (
                <List
                  dataSource={modules}
                  renderItem={(module, index) => (
                    <List.Item
                      key={module.module_id}
                      style={{
                        padding: '16px',
                        border: '1px solid #f0f0f0',
                        borderRadius: 8,
                        marginBottom: 12,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        background: '#fafafa'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e6f7ff'
                        e.currentTarget.style.borderColor = '#1890ff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fafafa'
                        e.currentTarget.style.borderColor = '#f0f0f0'
                      }}
                      onClick={() => navigate(`/roadmaps/${selectedRoadmap.roadmap_id}/modules/${module.module_id}`)}
                    >
                      <List.Item.Meta
                        avatar={
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: '#1890ff',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: 16
                          }}>
                            {index + 1}
                          </div>
                        }
                        title={
                          <Space>
                            <Text strong style={{ fontSize: 15 }}>{module.title}</Text>
                            {module.estimated_hours && (
                              <Tag color="purple">⏱️ {module.estimated_hours}h</Tag>
                            )}
                          </Space>
                        }
                        description={
                          <Text style={{ fontSize: 14 }}>
                            {module.description || 'Nội dung chi tiết của bài học'}
                          </Text>
                        }
                      />
                      <Button type="link" icon={<ArrowRightOutlined />}>
                        Học ngay
                      </Button>
                    </List.Item>
                  )}
                />
              )}
            </div>
          </Space>
        )}
      </Modal>
    </div>
  )
}

export default Roadmaps
