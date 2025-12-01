import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Spin, Alert, Empty, Tag, Modal, Typography, Space, message } from 'antd'
import { BookOutlined, CheckCircleOutlined } from '@ant-design/icons'
import api from '../services/api'

const { Title, Paragraph } = Typography

type Roadmap = {
  roadmap_id: string
  title: string
  description?: string
  category?: string
  image_url?: string
  status?: string
}

const Roadmaps: React.FC = () => {
  const [items, setItems] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null)
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
      const res = await api.get(`/api/roadmaps/${roadmap.roadmap_id}`)
      setSelectedRoadmap(res.data?.data || res.data)
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
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Learning Roadmaps</Title>
        <Paragraph>Choose your learning path and start your journey</Paragraph>
      </div>

      {items.length === 0 ? (
        <Empty description="No roadmaps available" />
      ) : (
        <Row gutter={[16, 16]}>
          {items.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.roadmap_id}>
              <Card
                hoverable
                cover={
                  <div style={{ height: 200, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                  </div>
                }
                actions={[
                  <Button type="link" onClick={() => handleViewDetails(item)}>View Details</Button>,
                ]}
              >
                <Card.Meta
                  title={item.title}
                  description={
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>{item.description || 'No description available'}</div>
                      {item.category && <Tag color="blue">{item.category}</Tag>}
                      {item.status === 'published' && <Tag color="green">Published</Tag>}
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={selectedRoadmap?.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="enroll"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => selectedRoadmap && handleEnroll(selectedRoadmap.roadmap_id)}
          >
            Enroll Now
          </Button>,
        ]}
        width={700}
      >
        {selectedRoadmap && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Paragraph>{selectedRoadmap.description}</Paragraph>
            {selectedRoadmap.category && (
              <div>
                <strong>Category:</strong> <Tag color="blue">{selectedRoadmap.category}</Tag>
              </div>
            )}
          </Space>
        )}
      </Modal>
    </div>
  )
}

export default Roadmaps
