import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Typography, Space } from 'antd'
import { BookOutlined, ReadOutlined, TeamOutlined, SafetyCertificateOutlined, RocketOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const { Meta } = Card

const { Title, Paragraph } = Typography

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    roadmaps: 0,
    certificates: 0,
    exercises: 0
  })

  useEffect(() => {
    Promise.all([
      api.get('/api/roadmaps').catch(() => ({ data: { data: [] } })),
      api.get('/api/certificates').catch(() => ({ data: { data: [] } })),
      api.get('/api/exercises').catch(() => ({ data: { data: [] } }))
    ]).then(([roadmaps, certs, exercises]) => {
      setStats({
        roadmaps: (roadmaps.data?.data || roadmaps.data || []).length,
        certificates: (certs.data?.data || certs.data || []).length,
        exercises: (exercises.data?.data || exercises.data || []).length
      })
    })
  }, [])

  const features = [
    {
      icon: <BookOutlined style={{ fontSize: 60 }} />,
      title: 'ONLINE COURSES',
      description: 'Explore hundreds of courses across multiple disciplines. Learn at your own pace.',
      color: '#17a2b8',
      bgColor: '#e7f6f9'
    },
    {
      icon: <ReadOutlined style={{ fontSize: 60 }} />,
      title: 'BOOKS & LIBRARY',
      description: 'Access our comprehensive digital library with thousands of learning resources.',
      color: '#ffc107',
      bgColor: '#fff8e1'
    },
    {
      icon: <TeamOutlined style={{ fontSize: 60 }} />,
      title: 'EXPERT TEACHERS',
      description: 'Learn from industry experts and experienced professionals.',
      color: '#17a2b8',
      bgColor: '#e7f6f9'
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: 60 }} />,
      title: 'CERTIFICATION',
      description: 'Earn recognized certificates upon course completion.',
      color: '#ffc107',
      bgColor: '#fff8e1'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600) center/cover',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <div>
          <Title level={1} style={{ 
            color: 'white', 
            fontSize: '48px',
            fontWeight: 700,
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            OWN YOUR FUTURE BY<br />LEARNING SKILLS
          </Title>
          <Paragraph style={{ 
            fontSize: '18px', 
            color: 'white',
            marginBottom: 32,
            opacity: 0.9
          }}>
            Master new skills, advance your career, and achieve your goals
          </Paragraph>
          <Space size="large">
            <Button 
              size="large" 
              style={{ 
                height: '50px',
                padding: '0 40px',
                fontSize: '16px',
                fontWeight: 600,
                border: '2px solid white',
                background: 'transparent',
                color: 'white'
              }}
              onClick={() => navigate('/roadmaps')}
            >
              BROWSE ALL COURSES
            </Button>
            <Button 
              type="primary"
              size="large"
              style={{ 
                height: '50px',
                padding: '0 40px',
                fontSize: '16px',
                fontWeight: 600,
                background: '#1890ff',
                border: 'none'
              }}
              onClick={() => navigate('/register')}
            >
              SIGN UP NOW
            </Button>
          </Space>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 50px', background: '#f5f5f5' }}>
        <Row gutter={[32, 32]} justify="center">
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <div style={{ 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  background: feature.bgColor,
                  border: `6px solid ${feature.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 28px',
                  color: feature.color,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }}>
                  {React.cloneElement(feature.icon, { style: { fontSize: 70 } })}
                </div>
                <Title level={3} style={{ 
                  marginBottom: 16,
                  fontSize: '20px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  fontFamily: '\'Segoe UI\', \'Roboto\', \'Helvetica Neue\', sans-serif'
                }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ 
                  color: '#666',
                  fontSize: '16px',
                  lineHeight: 1.8,
                  fontFamily: '\'Segoe UI\', \'Roboto\', \'Helvetica Neue\', sans-serif'
                }}>
                  {feature.description}
                </Paragraph>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Courses Section */}
      <div style={{ padding: '80px 50px' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Card
              hoverable
              style={{ 
                height: '400px',
                border: 'none',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }}
              cover={
                <div style={{
                  height: '200px',
                  background: 'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800) center/cover',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(23,162,184,0.45) 0%, rgba(19,132,150,0.45) 100%)'
                  }} />
                </div>
              }
              bodyStyle={{
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                color: 'white'
              }}
              onClick={() => navigate('/roadmaps')}
            >
              <Title level={1} style={{ color: 'white', marginBottom: 12, fontSize: '42px', fontFamily: '\'Segoe UI\', \'Roboto\', sans-serif' }}>
                TRENDING
              </Title>
              <Title level={3} style={{ color: 'white', fontWeight: 400, fontSize: '24px', fontFamily: '\'Segoe UI\', \'Roboto\', sans-serif' }}>
                COURSES
              </Title>
              <Paragraph style={{ color: 'white', marginTop: 16, opacity: 0.95, fontSize: '16px' }}>
                {stats.roadmaps}+ Learning Paths Available
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              hoverable
              style={{ 
                height: '400px',
                border: 'none',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }}
              cover={
                <div style={{
                  height: '200px',
                  background: 'url(https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800) center/cover',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(255,193,7,0.45) 0%, rgba(255,152,0,0.45) 100%)'
                  }} />
                </div>
              }
              bodyStyle={{
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                color: 'white'
              }}
              onClick={() => navigate('/exercises')}
            >
              <Title level={1} style={{ color: 'white', marginBottom: 12, fontSize: '42px', fontFamily: '\'Segoe UI\', \'Roboto\', sans-serif' }}>
                NEW
              </Title>
              <Title level={3} style={{ color: 'white', fontWeight: 400, fontSize: '24px', fontFamily: '\'Segoe UI\', \'Roboto\', sans-serif' }}>
                CHALLENGES
              </Title>
              <Paragraph style={{ color: 'white', marginTop: 16, opacity: 0.95, fontSize: '16px' }}>
                {stats.exercises}+ Coding Exercises
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* CTA Section */}
      <div style={{
        background: '#001529',
        padding: '60px 50px',
        textAlign: 'center',
        color: 'white'
      }}>
        <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
          Ready to Start Your Learning Journey?
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: 32 }}>
          Join thousands of learners achieving their goals
        </Paragraph>
        <Button 
          type="primary"
          size="large"
          icon={<RocketOutlined />}
          style={{ 
            height: '50px',
            padding: '0 40px',
            fontSize: '16px',
            fontWeight: 600
          }}
          onClick={() => navigate('/register')}
        >
          GET STARTED TODAY
        </Button>
      </div>
    </div>
  )
}

export default Home
