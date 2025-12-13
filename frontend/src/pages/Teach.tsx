import React, { useState } from 'react'
import { Row, Col, Card, Button, Typography, Space, Form, Input, Steps, Divider, Upload, message } from 'antd'
import { 
  RocketOutlined, 
  DollarOutlined, 
  VideoCameraOutlined, 
  TeamOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BookOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input
const { Step } = Steps

const Teach: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()

  const reasons = [
    {
      icon: <TeamOutlined style={{ fontSize: 48, color: '#a435f0' }} />,
      title: 'Reach Millions',
      description: 'Share your knowledge with learners from around the world'
    },
    {
      icon: <DollarOutlined style={{ fontSize: 48, color: '#a435f0' }} />,
      title: 'Earn Money',
      description: 'Build a sustainable income stream doing what you love'
    },
    {
      icon: <VideoCameraOutlined style={{ fontSize: 48, color: '#a435f0' }} />,
      title: 'Full Support',
      description: 'Get access to our instructor tools and resources'
    },
    {
      icon: <RocketOutlined style={{ fontSize: 48, color: '#a435f0' }} />,
      title: 'Grow Your Career',
      description: 'Build your reputation as an expert in your field'
    }
  ]

  const steps = [
    {
      title: 'Plan Your Course',
      description: 'Define your target audience and course outline'
    },
    {
      title: 'Create Content',
      description: 'Record and upload your video lessons'
    },
    {
      title: 'Launch & Market',
      description: 'Publish your course and reach students'
    }
  ]

  const handleSubmit = async (values: any) => {
    try {
      message.success('Application submitted successfully! We\'ll contact you soon.')
      form.resetFields()
      setCurrentStep(0)
    } catch (err) {
      message.error('Failed to submit application')
    }
  }

  return (
    <div style={{ background: '#fff' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.3) 0%, rgba(245, 87, 108, 0.7) 100%), url("https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80") center/cover',
        padding: '80px 60px',
        color: '#fff',
        textAlign: 'center',
        position: 'relative'
      }}>
        <Title level={1} style={{ color: '#fff', fontSize: 48, marginBottom: 24 }}>
          Teach on SkillSync
        </Title>
        <Paragraph style={{ fontSize: 20, color: '#fff', maxWidth: 800, margin: '0 auto 32px' }}>
          Join thousands of instructors teaching millions of students worldwide. Share your knowledge and earn money doing what you love.
        </Paragraph>
        <Button 
          type="primary" 
          size="large"
          icon={<RocketOutlined />}
          style={{ 
            height: 50,
            fontSize: 16,
            background: '#fff',
            color: '#f5576c',
            border: 'none',
            fontWeight: 600,
            paddingLeft: 40,
            paddingRight: 40
          }}
          onClick={() => {
            document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Become an Instructor
        </Button>
      </div>

      {/* Reasons Section */}
      <div style={{ padding: '80px 60px', maxWidth: 1400, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 60, fontSize: 36 }}>
          Why Teach on SkillSync?
        </Title>
        <Row gutter={[48, 48]}>
          {reasons.map((reason, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                bordered={false}
                style={{ 
                  textAlign: 'center',
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  borderRadius: 16
                }}
              >
                <div style={{ marginBottom: 24 }}>{reason.icon}</div>
                <Title level={4} style={{ fontSize: 20, marginBottom: 16 }}>
                  {reason.title}
                </Title>
                <Paragraph style={{ fontSize: 15, color: '#666' }}>
                  {reason.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* How It Works */}
      <div style={{ background: '#f7f9fa', padding: '80px 60px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 60, fontSize: 36 }}>
            How to Get Started
          </Title>
          <Steps current={-1} direction="horizontal">
            {steps.map((step, index) => (
              <Step
                key={index}
                title={<Text strong style={{ fontSize: 16 }}>{step.title}</Text>}
                description={<Text style={{ fontSize: 14 }}>{step.description}</Text>}
                icon={<CheckCircleOutlined style={{ fontSize: 24 }} />}
              />
            ))}
          </Steps>
        </div>
      </div>

      {/* Success Stories */}
      <div style={{ padding: '80px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 60, fontSize: 36 }}>
            Instructor Success Stories
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 16, height: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    background: '#a435f0',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    margin: '0 auto 16px'
                  }}>
                    👨‍💻
                  </div>
                  <Title level={4}>John Smith</Title>
                  <Text type="secondary">Web Development Instructor</Text>
                </div>
                <Paragraph style={{ fontSize: 15, fontStyle: 'italic', color: '#666' }}>
                  "Teaching on SkillSync has been life-changing. I've reached over 100,000 students and built a thriving online business."
                </Paragraph>
                <Divider />
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>📚 15 Courses</Text>
                  <Text strong>👥 120K+ Students</Text>
                  <Text strong>⭐ 4.8 Average Rating</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 16, height: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    background: '#52c41a',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    margin: '0 auto 16px'
                  }}>
                    👩‍🎨
                  </div>
                  <Title level={4}>Sarah Johnson</Title>
                  <Text type="secondary">Design Instructor</Text>
                </div>
                <Paragraph style={{ fontSize: 15, fontStyle: 'italic', color: '#666' }}>
                  "The platform is so easy to use and the support team is amazing. I love seeing my students succeed!"
                </Paragraph>
                <Divider />
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>📚 8 Courses</Text>
                  <Text strong>👥 45K+ Students</Text>
                  <Text strong>⭐ 4.9 Average Rating</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 16, height: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    background: '#1890ff',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    margin: '0 auto 16px'
                  }}>
                    👨‍🏫
                  </div>
                  <Title level={4}>Michael Chen</Title>
                  <Text type="secondary">Data Science Instructor</Text>
                </div>
                <Paragraph style={{ fontSize: 15, fontStyle: 'italic', color: '#666' }}>
                  "I can teach from anywhere in the world and make a real impact on people's careers. Best decision ever!"
                </Paragraph>
                <Divider />
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>📚 12 Courses</Text>
                  <Text strong>👥 85K+ Students</Text>
                  <Text strong>⭐ 4.7 Average Rating</Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Application Form */}
      <div id="apply-form" style={{ background: '#f7f9fa', padding: '80px 60px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 16, fontSize: 36 }}>
            Apply to Become an Instructor
          </Title>
          <Paragraph style={{ textAlign: 'center', fontSize: 16, color: '#666', marginBottom: 48 }}>
            Fill out the form below and we'll get back to you within 2-3 business days
          </Paragraph>
          
          <Card style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Please enter your full name' }]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="John Doe"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined />} 
                      placeholder="john@example.com"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Phone Number"
                    name="phone"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                  >
                    <Input 
                      prefix={<PhoneOutlined />} 
                      placeholder="+84 123 456 789"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Area of Expertise"
                    name="expertise"
                    rules={[{ required: true, message: 'Please enter your expertise' }]}
                  >
                    <Input 
                      prefix={<BookOutlined />} 
                      placeholder="e.g., Web Development, Data Science"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Tell us about your teaching experience"
                name="experience"
                rules={[{ required: true, message: 'Please describe your experience' }]}
              >
                <TextArea 
                  rows={4}
                  placeholder="Share your background, experience, and why you want to teach on SkillSync..."
                />
              </Form.Item>

              <Form.Item
                label="Course Ideas (Optional)"
                name="courseIdeas"
              >
                <TextArea 
                  rows={3}
                  placeholder="What courses would you like to create? Share your ideas..."
                />
              </Form.Item>

              <Form.Item
                label="Resume/CV (Optional)"
                name="resume"
              >
                <Upload>
                  <Button icon={<UploadOutlined />}>Upload Resume</Button>
                </Upload>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  size="large"
                  style={{
                    height: 50,
                    fontSize: 16,
                    background: '#a435f0',
                    borderColor: '#a435f0',
                    fontWeight: 600,
                    paddingLeft: 60,
                    paddingRight: 60
                  }}
                >
                  Submit Application
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ padding: '80px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 60, fontSize: 36 }}>
            Frequently Asked Questions
          </Title>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card>
              <Title level={4}>Do I need teaching experience?</Title>
              <Paragraph style={{ color: '#666' }}>
                Not necessarily! While teaching experience is helpful, we welcome passionate experts who want to share their knowledge. We provide resources and support to help you create engaging courses.
              </Paragraph>
            </Card>
            <Card>
              <Title level={4}>How much can I earn?</Title>
              <Paragraph style={{ color: '#666' }}>
                Instructor earnings vary based on course pricing, enrollment, and engagement. Top instructors earn six figures annually. You set your course price and earn revenue from each enrollment.
              </Paragraph>
            </Card>
            <Card>
              <Title level={4}>What equipment do I need?</Title>
              <Paragraph style={{ color: '#666' }}>
                Basic requirements include a decent camera (even a smartphone works), a microphone for clear audio, and screen recording software. We provide detailed technical guidelines to help you get started.
              </Paragraph>
            </Card>
            <Card>
              <Title level={4}>How long does the approval process take?</Title>
              <Paragraph style={{ color: '#666' }}>
                We review applications within 2-3 business days. Once approved, you can start creating your first course right away with access to all our instructor tools and resources.
              </Paragraph>
            </Card>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default Teach
