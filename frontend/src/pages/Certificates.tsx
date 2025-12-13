import React, { useEffect, useState } from 'react'
import { Card, Spin, Alert, Button, Typography, Space, Empty } from 'antd'
import { ArrowRightOutlined, BookOutlined, TrophyOutlined } from '@ant-design/icons'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

type Certificate = {
  certificate_id: string
  certificate_name: string
  issued_date: string
  roadmap_title?: string
  roadmap_id?: string
  pdf_url?: string
  description?: string
  provider?: string
  duration?: string
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

const Certificates: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Dữ liệu mẫu cho certificates với ảnh minh họa
  const sampleCertificates: Certificate[] = [
    {
      certificate_id: '1',
      certificate_name: 'Google Data Analytics Professional Certificate',
      issued_date: '2024-11-15',
      provider: 'Offered by Google',
      duration: '6 months at 10 hours per week',
      description: 'Prepare for a career in the high-growth field of data analytics with comprehensive training.',
      pdf_url: '/certificates/google-data-analytics.pdf',
      roadmap_title: 'Data Analytics',
      image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/fb/ed4c80d9ac11e8a594c71e234ade24/Google-DA_Icon.png'
    },
    {
      certificate_id: '2',
      certificate_name: 'Meta Front-End Developer Professional Certificate',
      issued_date: '2024-10-20',
      provider: 'Offered by Meta',
      duration: '7 months at 6 hours per week',
      description: 'Launch your career as a front-end developer. Build job-ready skills for an in-demand career.',
      pdf_url: '/certificates/meta-frontend.pdf',
      roadmap_title: 'Frontend Development',
      image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/c8/297178a5d34e8d88d80fcbdf5d3f7e/Meta-Logo.png'
    },
    {
      certificate_id: '3',
      certificate_name: 'IBM Full Stack Software Developer Professional Certificate',
      issued_date: '2024-09-05',
      provider: 'Offered by IBM',
      duration: '10 months at 5 hours per week',
      description: 'Prepare for a career in full stack development. Master the skills to create end-to-end applications.',
      pdf_url: '/certificates/ibm-fullstack.pdf',
      roadmap_title: 'Full Stack Development',
      image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/86/e611e0174011e8a2a0f7a057a8f24a/ibm-logo-black-rgb-square.png'
    }
  ]

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      setError('Please login to view certificates')
      setLoading(false)
      return
    }

    Promise.all([
      api.get(`/api/auth/users/${userId}`),
      api.get(`/api/certificates/user/${userId}`).catch(() => ({ data: [] }))
    ])
      .then(([userRes, certsRes]) => {
        setUser(userRes.data?.data || userRes.data)
        const fetchedCerts = certsRes.data?.data || certsRes.data || []
        // Nếu không có certificates từ API, dùng dữ liệu mẫu
        setCertificates(fetchedCerts.length > 0 ? fetchedCerts : sampleCertificates)
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load certificates')
        // Nếu có lỗi, vẫn hiển thị dữ liệu mẫu
        setCertificates(sampleCertificates)
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
    { name: 'Launch your career', icon: '🚀', color: '#52c41a' },
    { name: 'Advance your career', icon: '📈', color: '#1890ff' },
    { name: 'Prepare for a certification', icon: '📋', color: '#722ed1' },
    { name: 'Business Certificates', icon: '💼', color: '#fa8c16' },
    { name: 'Data Science Certificates', icon: '📊', color: '#13c2c2' },
    { name: 'Technology Certificates', icon: '💻', color: '#eb2f96' }
  ]

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 64px)',
      background: '#f5f7fa'
    }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
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
            Professional Certificates
          </Title>
          <Text style={{ fontSize: 18, color: '#666' }}>
            Get job-ready for an in-demand career
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
        {/* Left Column - Certificates List */}
        <div>
          <Title level={2} style={{ 
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 32,
            color: '#1a1a1a'
          }}>
            Launch your career
          </Title>

          {certificates.length > 0 ? (
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              {certificates.map((cert) => (
                <Card 
                  key={cert.certificate_id}
                  style={{ 
                    borderRadius: 8,
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <div style={{ display: 'flex', gap: 24 }}>
                    {/* Logo/Image */}
                    <div style={{
                      width: 120,
                      height: 80,
                      background: cert.image ? 'white' : '#f5f5f5',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden',
                      border: '1px solid #f0f0f0'
                    }}>
                      {cert.image ? (
                        <img 
                          src={cert.image} 
                          alt={cert.certificate_name}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain',
                            padding: 8
                          }}
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 40px; color: #faad14;">🏆</span>'
                          }}
                        />
                      ) : (
                        <TrophyOutlined style={{ fontSize: 40, color: '#faad14' }} />
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
                        {cert.certificate_name}
                      </Title>
                      
                      <Text type="secondary" style={{ 
                        display: 'block',
                        fontSize: 14,
                        marginBottom: 4
                      }}>
                        {cert.provider || 'Offered by SkillSync Learning Platform'}
                      </Text>

                      {cert.duration && (
                        <Text type="secondary" style={{ 
                          display: 'block',
                          fontSize: 14,
                          marginBottom: 8
                        }}>
                          {cert.duration}
                        </Text>
                      )}

                      <Text style={{ 
                        display: 'block',
                        fontSize: 14,
                        color: '#595959',
                        marginBottom: 16
                      }}>
                        {cert.description || 'Prepare for a career in this field with comprehensive training.'}
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
                        onClick={() => navigate(`/certificates/${cert.certificate_id}`)}
                      >
                        Go to certificate <ArrowRightOutlined style={{ fontSize: 12 }} />
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
                      No certificates yet
                    </Title>
                    <Text type="secondary">
                      Complete courses to earn professional certificates
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
                Explore Courses
              </Button>
            </Card>
          )}

          {certificates.length > 0 && (
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
              View more certificates ({certificates.length}) <ArrowRightOutlined />
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
              Explore more certificates by category
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
                  <BookOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <div>
                    <Text strong style={{ display: 'block', fontSize: 14 }}>
                      Learn from industry leaders
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Top instructors worldwide
                    </Text>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <TrophyOutlined style={{ fontSize: 20, color: '#faad14' }} />
                  <div>
                    <Text strong style={{ display: 'block', fontSize: 14 }}>
                      Career credentials
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Recognized by employers
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

export default Certificates
