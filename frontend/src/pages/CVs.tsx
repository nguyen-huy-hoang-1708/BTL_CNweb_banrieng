import React, { useEffect, useState } from 'react'
import { Card, Spin, Alert, Button, Typography, Space, Empty } from 'antd'
import { ArrowRightOutlined, FileTextOutlined, UserOutlined, TrophyOutlined } from '@ant-design/icons'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

type CV = {
  cv_id: string
  cv_name: string
  created_at: string
  template_style?: string
  description?: string
  status?: string
  image?: string
}

type UserInfo = {
  user_id: string
  full_name: string
  email: string
  created_at: string
  current_level?: string
  role?: string
  avatar_url?: string
}

const CVs: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [cvs, setCVs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Dữ liệu mẫu cho CVs với ảnh minh họa
  const sampleCVs: CV[] = [
    {
      cv_id: '1',
      cv_name: 'Frontend Developer CV',
      created_at: '2024-11-15',
      template_style: 'Modern Professional',
      description: 'A modern CV template perfect for frontend developers showcasing React, TypeScript, and UI/UX skills.',
      status: 'Active',
      image: 'https://marketplace.canva.com/EAFHblx_Y3Q/1/0/1131w/canva-black-white-minimalist-cv-resume-f5JNR8K2w2Y.jpg'
    },
    {
      cv_id: '2',
      cv_name: 'Full Stack Developer CV',
      created_at: '2024-10-20',
      template_style: 'Creative Tech',
      description: 'Showcase your full-stack expertise with this comprehensive CV highlighting both frontend and backend skills.',
      status: 'Active',
      image: 'https://d.novoresume.com/images/doc/functional-resume-template.png'
    },
    {
      cv_id: '3',
      cv_name: 'Data Analyst CV',
      created_at: '2024-09-05',
      template_style: 'Professional Clean',
      description: 'Professional CV template designed for data analysts emphasizing analytical skills and project outcomes.',
      status: 'Active',
      image: 'https://resumegenius.com/wp-content/uploads/entry-level-resume-template-freebie.png'
    }
  ]

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      setError('Please login to view CVs')
      setLoading(false)
      return
    }

    Promise.all([
      api.get(`/api/auth/users/${userId}`),
      api.get(`/api/cvs/user/${userId}`).catch(() => ({ data: [] }))
    ])
      .then(([userRes, cvsRes]) => {
        setUser(userRes.data?.data || userRes.data)
        const fetchedCVs = cvsRes.data?.data || cvsRes.data || []
        // Nếu không có CVs từ API, dùng dữ liệu mẫu
        setCVs(fetchedCVs.length > 0 ? fetchedCVs : sampleCVs)
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load CVs')
        // Nếu có lỗi, vẫn hiển thị dữ liệu mẫu
        setCVs(sampleCVs)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
        <Alert type="error" message={error} showIcon />
      </div>
    )
  }

  const categories = [
    { name: 'Modern Templates', icon: '🎨', color: '#1890ff' },
    { name: 'Professional Templates', icon: '💼', color: '#52c41a' },
    { name: 'Creative Templates', icon: '✨', color: '#722ed1' },
    { name: 'Technical Templates', icon: '💻', color: '#fa8c16' },
    { name: 'Executive Templates', icon: '👔', color: '#13c2c2' },
    { name: 'Student Templates', icon: '🎓', color: '#eb2f96' }
  ]

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 64px)',
      background: '#f5f7fa'
    }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #e8f4f8 0%, #f5f5f5 100%)',
        padding: '80px 24px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={1} style={{ 
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 16,
            color: '#1a1a1a'
          }}>
            Professional CVs
          </Title>
          <Text style={{ fontSize: 18, color: '#666' }}>
            Create your professional CV to showcase your skills and experience
          </Text>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto',
        padding: '48px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 48
      }}>
        {/* Left Column - CVs List */}
        <div>
          <Title level={2} style={{ 
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 32,
            color: '#1a1a1a'
          }}>
            My CVs
          </Title>

          {cvs.length > 0 ? (
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              {cvs.map((cv) => (
                <Card 
                  key={cv.cv_id}
                  style={{ 
                    borderRadius: 8,
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <div style={{ display: 'flex', gap: 24 }}>
                    {/* CV Preview Image */}
                    <div style={{
                      width: 120,
                      height: 160,
                      background: cv.image ? 'white' : '#f5f5f5',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden',
                      border: '1px solid #f0f0f0'
                    }}>
                      {cv.image ? (
                        <img 
                          src={cv.image} 
                          alt={cv.cv_name}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 40px; color: #1890ff;">📄</span>'
                          }}
                        />
                      ) : (
                        <FileTextOutlined style={{ fontSize: 40, color: '#1890ff' }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <Title level={4} style={{ 
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 8,
                        color: '#1a1a1a'
                      }}>
                        {cv.cv_name}
                      </Title>
                      
                      <Text type="secondary" style={{ 
                        display: 'block',
                        fontSize: 14,
                        marginBottom: 4
                      }}>
                        {cv.template_style || 'Custom Template'}
                      </Text>

                      <Text type="secondary" style={{ 
                        display: 'block',
                        fontSize: 14,
                        marginBottom: 8
                      }}>
                        Created: {cv.created_at ? new Date(cv.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                      </Text>

                      <Text style={{ 
                        display: 'block',
                        fontSize: 14,
                        color: '#595959',
                        marginBottom: 16
                      }}>
                        {cv.description || 'Your professional CV ready to impress employers.'}
                      </Text>

                      <Button 
                        type="link"
                        style={{ 
                          padding: 0,
                          fontSize: 14,
                          fontWeight: 600,
                          color: '#1890ff',
                          height: 'auto'
                        }}
                        onClick={() => navigate(`/cvs/${cv.cv_id}`)}
                      >
                        View CV <ArrowRightOutlined style={{ fontSize: 12 }} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </Space>
          ) : (
            <Card style={{ borderRadius: 8, textAlign: 'center', padding: '60px 24px' }}>
              <Empty 
                description={
                  <div>
                    <Title level={4} style={{ color: '#999', marginBottom: 8 }}>
                      No CVs yet
                    </Title>
                    <Text type="secondary">
                      Create your first professional CV to start your career journey
                    </Text>
                  </div>
                }
              />
              <Button 
                type="primary"
                size="large"
                style={{ marginTop: 24 }}
                onClick={() => navigate('/roadmaps')}
              >
                Create CV
              </Button>
            </Card>
          )}

          {cvs.length > 0 && (
            <Button 
              type="link"
              style={{ 
                marginTop: 32,
                fontSize: 16,
                fontWeight: 600,
                color: '#1890ff',
                padding: 0
              }}
            >
              View all CVs ({cvs.length}) <ArrowRightOutlined />
            </Button>
          )}
        </div>

        {/* Right Column - Category Sidebar */}
        <div>
          <Card 
            style={{ 
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              position: 'sticky',
              top: 24
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Title level={3} style={{ 
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 24,
              color: '#1a1a1a'
            }}>
              Explore CV templates by style
            </Title>

            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {categories.map((category, index) => (
                <Button
                  key={index}
                  block
                  size="large"
                  style={{
                    height: 'auto',
                    padding: '16px 20px',
                    textAlign: 'left',
                    border: '1px solid #e0e0e0',
                    borderRadius: 8,
                    background: 'white',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = category.color
                    e.currentTarget.style.boxShadow = `0 2px 8px ${category.color}33`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  onClick={() => navigate('/roadmaps')}
                >
                  <Space>
                    <span style={{ fontSize: 24 }}>{category.icon}</span>
                    <Text style={{ 
                      fontSize: 15,
                      fontWeight: 500,
                      color: '#1a1a1a'
                    }}>
                      {category.name}
                    </Text>
                  </Space>
                </Button>
              ))}
            </Space>

            {/* Additional Info */}
            <div style={{ 
              marginTop: 32,
              padding: 20,
              background: '#f9f9f9',
              borderRadius: 8
            }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <UserOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <div>
                    <Text strong style={{ display: 'block', fontSize: 14 }}>
                      ATS-Friendly Templates
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Optimized for applicant tracking systems
                    </Text>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <TrophyOutlined style={{ fontSize: 20, color: '#faad14' }} />
                  <div>
                    <Text strong style={{ display: 'block', fontSize: 14 }}>
                      Professional Design
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Stand out with modern layouts
                    </Text>
                  </div>
                </div>
              </Space>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CVs
