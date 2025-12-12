import React, { useEffect, useState } from 'react'
import { Card, Progress, Spin, Alert, Empty, Typography, Space, Row, Col, Statistic, Tag } from 'antd'
import { TrophyOutlined, BookOutlined, CheckCircleOutlined, ClockCircleOutlined, RocketOutlined } from '@ant-design/icons'
import api from '../services/api'

const { Title, Text, Paragraph } = Typography

type ModuleWithProgress = {
  module_id: string
  title: string
  roadmap_title: string
  status: string
  completion_percentage: number
}

const ProgressPage: React.FC = () => {
  const [items, setItems] = useState<ModuleWithProgress[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      setError('Please login to view your progress')
      return
    }

    // Fetch roadmaps and show modules (progress tracking coming soon)
    setLoading(true)
    api
      .get('/api/roadmaps')
      .then(async (res) => {
        const roadmaps = res.data?.data || res.data || []
        const modulesWithProgress: ModuleWithProgress[] = []
        
        // Get first 3 roadmaps
        for (const roadmap of roadmaps.slice(0, 3)) {
          try {
            const roadmapRes = await api.get(`/api/roadmaps/${roadmap.roadmap_id}`)
            const modules = roadmapRes.data?.data?.modules || []
            
            // Show first 3 modules of each roadmap with placeholder progress
            for (const module of modules.slice(0, 3)) {
              modulesWithProgress.push({
                module_id: module.module_id,
                title: module.title,
                roadmap_title: roadmap.title,
                status: 'not_started',
                completion_percentage: 0
              })
            }
          } catch (err) {
            console.error('Error fetching roadmap:', err)
          }
        }
        
        setItems(modulesWithProgress)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load modules')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Spin size="large" />
    </div>
  )
  if (error) return <Alert type="warning" message={error} showIcon style={{ margin: '40px 80px' }} />

  const completedCount = items.filter(i => i.completion_percentage === 100).length
  const inProgressCount = items.filter(i => i.completion_percentage > 0 && i.completion_percentage < 100).length
  const notStartedCount = items.filter(i => i.completion_percentage === 0).length

  return (
    <div style={{ padding: '40px 80px', maxWidth: 1600, margin: '0 auto', background: '#f8f9fa', minHeight: 'calc(100vh - 128px)' }}>
      <div style={{ marginBottom: 40 }}>
        <Title level={1} style={{ 
          fontSize: 42, 
          fontWeight: 700, 
          marginBottom: 12,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-flex',
          alignItems: 'center'
        }}>
          <span style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📊 My Learning Progress
          </span>
        </Title>
        <Paragraph style={{ fontSize: 17, color: '#666', marginBottom: 0 }}>
          Track your progress across different courses and modules
        </Paragraph>
      </div>

      {/* Stats Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 48 }}>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              transition: 'all 0.3s'
            }}
            bodyStyle={{ padding: '24px' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.95)', fontSize: 15, fontWeight: 500, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Total Modules</span>}
              value={items.length}
              valueStyle={{ color: 'white', fontSize: 36, fontWeight: 700, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}
              prefix={<BookOutlined style={{ fontSize: 28, color: 'white', marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 12px rgba(82, 196, 26, 0.15)', 
              background: 'linear-gradient(135deg, #52c41a 0%, #237804 100%)',
              border: 'none',
              transition: 'all 0.3s'
            }}
            bodyStyle={{ padding: '24px' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(82, 196, 26, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(82, 196, 26, 0.15)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.95)', fontSize: 15, fontWeight: 500, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Completed</span>}
              value={completedCount}
              valueStyle={{ color: 'white', fontSize: 36, fontWeight: 700, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}
              prefix={<CheckCircleOutlined style={{ fontSize: 28, color: 'white', marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.15)', 
              background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)',
              border: 'none',
              transition: 'all 0.3s'
            }}
            bodyStyle={{ padding: '24px' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(24, 144, 255, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.15)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.95)', fontSize: 15, fontWeight: 500, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>In Progress</span>}
              value={inProgressCount}
              valueStyle={{ color: 'white', fontSize: 36, fontWeight: 700, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}
              prefix={<RocketOutlined style={{ fontSize: 28, color: 'white', marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 12px rgba(250, 173, 20, 0.15)', 
              background: 'linear-gradient(135deg, #faad14 0%, #d46b08 100%)',
              border: 'none',
              transition: 'all 0.3s'
            }}
            bodyStyle={{ padding: '24px' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(250, 173, 20, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(250, 173, 20, 0.15)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.95)', fontSize: 15, fontWeight: 500, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Not Started</span>}
              value={notStartedCount}
              valueStyle={{ color: 'white', fontSize: 36, fontWeight: 700, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}
              prefix={<ClockCircleOutlined style={{ fontSize: 28, color: 'white', marginRight: 8 }} />}
            />
          </Card>
        </Col>
      </Row>
      
      {items.length === 0 ? (
        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '80px 40px', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <Empty 
            description={
              <div>
                <div style={{ fontSize: 20, marginBottom: 16, fontWeight: 600, color: '#333' }}>No modules found</div>
                <Text type="secondary" style={{ fontSize: 16 }}>Start learning to track your progress!</Text>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: 32,
            padding: '0 4px'
          }}>
            <Title level={2} style={{ 
              fontSize: 28, 
              marginBottom: 0, 
              fontWeight: 700,
              fontFamily: "'Segoe UI', 'Roboto', sans-serif"
            }}>
              📚 Course Modules
            </Title>
          </div>
          <Row gutter={[24, 24]}>
            {items.map((item) => (
              <Col xs={24} sm={12} lg={8} key={item.module_id}>
                <Card 
                  hoverable
                  style={{ 
                    borderRadius: 16,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    height: '100%',
                    transition: 'all 0.3s',
                    background: 'white',
                    border: '1px solid #f0f0f0',
                    overflow: 'hidden'
                  }}
                  bodyStyle={{ padding: '28px' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)'
                    e.currentTarget.style.borderColor = '#1890ff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'
                    e.currentTarget.style.borderColor = '#f0f0f0'
                  }}
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div>
                      <Tag 
                        color="blue" 
                        style={{ 
                          fontSize: 13, 
                          padding: '4px 12px',
                          borderRadius: 8,
                          marginBottom: 12,
                          fontWeight: 500,
                          border: 'none',
                          fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                        }}
                      >
                        {item.roadmap_title}
                      </Tag>
                      <Title level={4} style={{ 
                        margin: 0, 
                        fontSize: 20, 
                        fontWeight: 600,
                        lineHeight: 1.4,
                        color: '#1a1a1a',
                        fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                      }}>
                        {item.title}
                      </Title>
                    </div>
                    
                    <div>
                      <div style={{ 
                        marginBottom: 16, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                      }}>
                        <Text strong style={{ 
                          fontSize: 15, 
                          color: '#666',
                          fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                        }}>
                          Status
                        </Text>
                        <Tag style={{
                          padding: '6px 14px',
                          borderRadius: 20,
                          fontSize: 13,
                          fontWeight: 600,
                          border: 'none',
                          background: item.status === 'completed' ? '#f6ffed' : item.status === 'in_progress' ? '#e6f7ff' : '#f5f5f5',
                          color: item.status === 'completed' ? '#52c41a' : item.status === 'in_progress' ? '#1890ff' : '#8c8c8c',
                          fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                        }}>
                          {item.status === 'completed' ? '✅ Completed' : 
                           item.status === 'in_progress' ? '📚 In Progress' : 
                           '⏳ Not Started'}
                        </Tag>
                      </div>
                      <div style={{ 
                        background: '#f8f9fa', 
                        padding: '16px', 
                        borderRadius: 12,
                        border: '1px solid #e8e8e8'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: 8
                        }}>
                          <Text style={{ 
                            fontSize: 13, 
                            color: '#666',
                            fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                          }}>
                            Progress
                          </Text>
                          <Text strong style={{ 
                            fontSize: 16, 
                            color: item.completion_percentage === 100 ? '#52c41a' : '#1890ff',
                            fontWeight: 700,
                            fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                          }}>
                            {item.completion_percentage}%
                          </Text>
                        </div>
                        <Progress 
                          percent={Number(item.completion_percentage)} 
                          status={item.completion_percentage === 100 ? 'success' : 'active'}
                          strokeColor={item.completion_percentage === 100 ? '#52c41a' : {
                            '0%': '#1890ff',
                            '100%': '#096dd9'
                          }}
                          strokeWidth={12}
                          showInfo={false}
                          style={{ marginBottom: 0 }}
                          strokeLinecap="round"
                        />
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  )
}

export default ProgressPage
