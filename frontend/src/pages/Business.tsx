import React from 'react'
import { Row, Col, Card, Button, Typography, Space, Divider } from 'antd'
import { 
  TeamOutlined, 
  LineChartOutlined, 
  SafetyCertificateOutlined, 
  RocketOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  TrophyOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography

const Business: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <TeamOutlined style={{ fontSize: 48, color: '#a435f0' }} />,
      title: 'Team Training',
      description: 'Train your entire team with unlimited access to thousands of courses'
    },
    {
      icon: <LineChartOutlined style={{ fontSize: 48, color: '#a435f0' }} />,
      title: 'Analytics & Insights',
      description: 'Track team progress and measure skill development with detailed analytics'
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: 48, color: '#a435f0' }} />,
      title: 'Certification Programs',
      description: 'Provide recognized certifications to validate your team\'s expertise'
    },
    {
      icon: <GlobalOutlined style={{ fontSize: 48, color: '#a435f0' }} />,
      title: 'Global Content',
      description: 'Access courses in multiple languages and covering global standards'
    }
  ]

  const benefits = [
    'Unlimited access to 10,000+ top courses',
    'Advanced analytics and reporting',
    'Dedicated customer success manager',
    'Customized learning paths',
    'SSO and LMS integrations',
    'Priority 24/7 support'
  ]

  return (
    <div style={{ background: '#fff' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.7) 100%), url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80") center/cover',
        padding: '80px 60px',
        color: '#fff',
        textAlign: 'center',
        position: 'relative'
      }}>
        <Title level={1} style={{ color: '#fff', fontSize: 48, marginBottom: 24 }}>
          SkillSync for Business
        </Title>
        <Paragraph style={{ fontSize: 20, color: '#fff', maxWidth: 800, margin: '0 auto 32px' }}>
          Empower your workforce with the skills they need to thrive in today's digital economy
        </Paragraph>
        <Space size="large">
          <Button 
            type="primary" 
            size="large"
            style={{ 
              height: 50,
              fontSize: 16,
              background: '#fff',
              color: '#764ba2',
              border: 'none',
              fontWeight: 600,
              paddingLeft: 40,
              paddingRight: 40
            }}
          >
            Request Demo
          </Button>
          <Button 
            size="large"
            style={{ 
              height: 50,
              fontSize: 16,
              background: 'transparent',
              color: '#fff',
              border: '2px solid #fff',
              fontWeight: 600,
              paddingLeft: 40,
              paddingRight: 40
            }}
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
        </Space>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 60px', maxWidth: 1400, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 60, fontSize: 36 }}>
          Why Choose SkillSync Business?
        </Title>
        <Row gutter={[48, 48]}>
          {features.map((feature, index) => (
            <Col xs={24} md={12} key={index}>
              <Card 
                bordered={false}
                style={{ 
                  textAlign: 'center',
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  borderRadius: 16
                }}
              >
                <div style={{ marginBottom: 24 }}>{feature.icon}</div>
                <Title level={3} style={{ fontSize: 24, marginBottom: 16 }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ fontSize: 16, color: '#666' }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Benefits Section */}
      <div style={{ background: '#f7f9fa', padding: '80px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={64} align="middle">
            <Col xs={24} md={12}>
              <Title level={2} style={{ fontSize: 36, marginBottom: 24 }}>
                Everything Your Team Needs to Succeed
              </Title>
              <Paragraph style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>
                From technical skills to leadership development, SkillSync Business provides
                comprehensive learning solutions tailored to your organization's needs.
              </Paragraph>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {benefits.map((benefit, index) => (
                  <Space key={index} align="start">
                    <CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                    <Text style={{ fontSize: 16 }}>{benefit}</Text>
                  </Space>
                ))}
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Card 
                style={{ 
                  borderRadius: 16,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  background: '#fff'
                }}
              >
                <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
                  <TrophyOutlined style={{ fontSize: 80, color: '#faad14' }} />
                  <Title level={3} style={{ marginBottom: 8 }}>
                    Trusted by 12,000+ Companies
                  </Title>
                  <Paragraph style={{ fontSize: 16, color: '#666' }}>
                    Join leading organizations worldwide that trust SkillSync to develop their teams
                  </Paragraph>
                  <Divider />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div>
                      <Title level={2} style={{ color: '#a435f0', marginBottom: 8 }}>
                        95%
                      </Title>
                      <Text style={{ color: '#666' }}>Satisfaction Rate</Text>
                    </div>
                    <div>
                      <Title level={2} style={{ color: '#a435f0', marginBottom: 8 }}>
                        10M+
                      </Title>
                      <Text style={{ color: '#666' }}>Learners</Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ padding: '80px 60px', textAlign: 'center' }}>
        <Title level={2} style={{ fontSize: 36, marginBottom: 24 }}>
          Ready to Transform Your Team?
        </Title>
        <Paragraph style={{ fontSize: 18, color: '#666', marginBottom: 40, maxWidth: 700, margin: '0 auto 40px' }}>
          Get in touch with our team to learn how SkillSync Business can help your organization achieve its learning goals
        </Paragraph>
        <Space size="large">
          <Button 
            type="primary"
            size="large"
            icon={<CustomerServiceOutlined />}
            style={{ 
              height: 50,
              fontSize: 16,
              background: '#a435f0',
              borderColor: '#a435f0',
              fontWeight: 600,
              paddingLeft: 40,
              paddingRight: 40
            }}
          >
            Contact Sales
          </Button>
          <Button 
            size="large"
            icon={<RocketOutlined />}
            style={{ 
              height: 50,
              fontSize: 16,
              fontWeight: 600,
              paddingLeft: 40,
              paddingRight: 40
            }}
            onClick={() => navigate('/register')}
          >
            Start Free Trial
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default Business
