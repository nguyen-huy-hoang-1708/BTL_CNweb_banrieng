import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Modal, Form, Input, Select, Spin, Alert, Empty, Space, Typography, message, Tag, Divider } from 'antd'
import { FileTextOutlined, PlusOutlined, UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, TrophyOutlined, ProjectOutlined, BookOutlined, SaveOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons'
import api from '../services/api'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

type CV = {
  cv_id: string
  cv_name: string
  template_style?: string
  created_at: string
  personal_info?: any
  skills?: any
  experience?: any
  pdf_url?: string
}

type CVFormData = {
  cv_name: string
  template_style: string
  full_name: string
  email: string
  phone: string
  location: string
  summary: string
  education: string
  experience: string
  skills: string
}

const CVs: React.FC = () => {
  const [items, setItems] = useState<CV[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createMode, setCreateMode] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [selectedCV, setSelectedCV] = useState<CV | null>(null)
  const [form] = Form.useForm()
  const [formValues, setFormValues] = useState<Partial<CVFormData>>({
    template_style: 'modern',
    full_name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    education: '',
    experience: '',
    skills: ''
  })

  useEffect(() => {
    loadCVs()
  }, [])

  const loadCVs = () => {
    setLoading(true)
    api
      .get('/api/cvs')
      .then((res) => {
        const data = res.data?.data || res.data || []
        setItems(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load CVs')
        setItems([])
      })
      .finally(() => setLoading(false))
  }

  const handleCreate = async (values: CVFormData) => {
    try {
      await api.post('/api/cvs', {
        cv_name: values.cv_name,
        template_style: values.template_style || 'modern',
        personal_info: {
          full_name: values.full_name,
          email: values.email,
          phone: values.phone,
          location: values.location,
          summary: values.summary
        },
        skills: values.skills,
        experience: values.experience,
        education: values.education
      })
      message.success('CV created successfully!')
      setCreateMode(false)
      form.resetFields()
      setFormValues({
        template_style: 'modern',
        full_name: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        education: '',
        experience: '',
        skills: ''
      })
      loadCVs()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to create CV')
    }
  }

  const handleFormChange = () => {
    setFormValues(form.getFieldsValue())
  }

  const handlePreview = (cv: CV) => {
    setSelectedCV(cv)
    setPreviewVisible(true)
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Spin size="large" />
    </div>
  )
  if (error) return <Alert type="error" message={error} showIcon style={{ margin: '40px 80px' }} />

  // CV List View
  if (!createMode) {
    return (
      <div style={{ padding: '40px 80px', maxWidth: 1400, margin: '0 auto', background: '#fafafa', minHeight: 'calc(100vh - 128px)' }}>
        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={1} style={{ fontSize: 42, fontWeight: 700, marginBottom: 12 }}>
              <FileTextOutlined style={{ marginRight: 12, color: '#1890ff' }} />
              My CVs
            </Title>
            <Paragraph style={{ fontSize: 18, color: '#666', marginBottom: 0 }}>
              Create and manage your professional CVs
            </Paragraph>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setCreateMode(true)} 
            size="large"
            style={{ height: 44, fontSize: 16, borderRadius: 8, padding: '0 24px' }}
          >
            Create New CV
          </Button>
        </div>

        {items.length === 0 ? (
          <Card style={{ borderRadius: 12, textAlign: 'center', padding: '60px 0', background: 'white' }}>
            <Empty 
              description={
                <div>
                  <div style={{ fontSize: 18, marginBottom: 12 }}>No CVs created yet</div>
                  <Text type="secondary" style={{ fontSize: 15 }}>Create your first CV to get started!</Text>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setCreateMode(true)}
              size="large"
              style={{ marginTop: 24, height: 44, fontSize: 16 }}
            >
              Create Your First CV
            </Button>
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {items.map((item) => (
              <Col xs={24} sm={12} lg={8} key={item.cv_id}>
                <Card
                  hoverable
                  style={{ 
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    height: '100%',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ 
                      width: 56, 
                      height: 56, 
                      borderRadius: 12, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 16,
                      flexShrink: 0
                    }}>
                      <FileTextOutlined style={{ fontSize: 28, color: 'white' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                        {item.cv_name}
                      </Title>
                      <Tag color="blue" style={{ marginBottom: 8 }}>{item.template_style || 'Default'}</Tag>
                      <div style={{ fontSize: 13, color: '#999' }}>
                        Created: {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button 
                      type="default" 
                      icon={<EyeOutlined />} 
                      onClick={() => handlePreview(item)}
                      style={{ height: 38, fontSize: 14 }}
                    >
                      Preview
                    </Button>
                    {item.pdf_url && (
                      <Button 
                        type="primary"
                        icon={<DownloadOutlined />}
                        href={item.pdf_url}
                        target="_blank"
                        style={{ height: 38, fontSize: 14 }}
                      >
                        Download
                      </Button>
                    )}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 20, fontWeight: 600 }}>
              <EyeOutlined style={{ marginRight: 12, color: '#1890ff' }} />
              {selectedCV?.cv_name}
            </div>
          }
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={[
            <Button key="close" onClick={() => setPreviewVisible(false)} style={{ height: 44, fontSize: 16 }}>
              Close
            </Button>,
            selectedCV?.pdf_url && (
              <Button key="download" type="primary" icon={<DownloadOutlined />} href={selectedCV.pdf_url} target="_blank" style={{ height: 44, fontSize: 16 }}>
                Download PDF
              </Button>
            ),
          ]}
          width={800}
        >
          {selectedCV && (
            <div style={{ padding: '16px 0' }}>
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 15 }}>Template: </Text>
                <Tag color="blue">{selectedCV.template_style || 'Default'}</Tag>
              </div>
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 15 }}>Created: </Text>
                <Text style={{ fontSize: 15 }}>{new Date(selectedCV.created_at).toLocaleString()}</Text>
              </div>
              {selectedCV.personal_info && (
                <div style={{ marginBottom: 24 }}>
                  <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 12 }}>Personal Information:</Text>
                  <div style={{ paddingLeft: 16 }}>
                    <Text style={{ fontSize: 15, display: 'block', marginBottom: 8 }}>
                      {selectedCV.personal_info.full_name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>
                      {selectedCV.personal_info.email}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 14, display: 'block' }}>
                      {selectedCV.personal_info.phone}
                    </Text>
                  </div>
                </div>
              )}
              {selectedCV.skills && (
                <div>
                  <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 12 }}>Skills:</Text>
                  <div style={{ paddingLeft: 16 }}>
                    <Text style={{ fontSize: 14 }}>{typeof selectedCV.skills === 'string' ? selectedCV.skills : JSON.stringify(selectedCV.skills)}</Text>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    )
  }

  // CV Builder View (TopCV-style)
  return (
    <div style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header Bar */}
      <div style={{ 
        background: 'white', 
        padding: '16px 40px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            onClick={() => setCreateMode(false)} 
            style={{ marginRight: 16 }}
          >
            ← Back to CVs
          </Button>
          <Title level={3} style={{ margin: 0, fontSize: 20 }}>
            <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            Create New CV
          </Title>
        </div>
        <Space>
          <Button 
            icon={<SaveOutlined />} 
            onClick={() => form.submit()}
            type="primary"
            size="large"
            style={{ height: 44, fontSize: 16 }}
          >
            Save CV
          </Button>
        </Space>
      </div>

      {/* Form + Preview Layout */}
      <div style={{ display: 'flex', padding: '24px', gap: 24, maxWidth: 1600, margin: '0 auto' }}>
        {/* Left: Form Section */}
        <div style={{ 
          width: 480, 
          flexShrink: 0,
          maxHeight: 'calc(100vh - 140px)',
          overflowY: 'auto',
          padding: '0 8px'
        }}>
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleCreate}
            onValuesChange={handleFormChange}
            initialValues={formValues}
          >
            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
              <Title level={4} style={{ fontSize: 18, marginBottom: 16 }}>
                <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                Basic Information
              </Title>
              <Form.Item 
                name="cv_name" 
                label="CV Name" 
                rules={[{ required: true, message: 'Please enter CV name' }]}
              >
                <Input size="large" placeholder="e.g., Software Engineer CV" />
              </Form.Item>
              <Form.Item name="template_style" label="Template Style" initialValue="modern">
                <Select size="large">
                  <Select.Option value="modern">🎨 Modern</Select.Option>
                  <Select.Option value="classic">📄 Classic</Select.Option>
                  <Select.Option value="minimal">✨ Minimal</Select.Option>
                </Select>
              </Form.Item>
            </Card>

            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
              <Title level={4} style={{ fontSize: 18, marginBottom: 16 }}>
                <UserOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                Personal Details
              </Title>
              <Form.Item 
                name="full_name" 
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input size="large" prefix={<UserOutlined />} placeholder="John Doe" />
              </Form.Item>
              <Form.Item 
                name="email" 
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input size="large" prefix={<MailOutlined />} placeholder="john@example.com" />
              </Form.Item>
              <Form.Item name="phone" label="Phone">
                <Input size="large" prefix={<PhoneOutlined />} placeholder="+1 234 567 8900" />
              </Form.Item>
              <Form.Item name="location" label="Location">
                <Input size="large" prefix={<EnvironmentOutlined />} placeholder="New York, USA" />
              </Form.Item>
              <Form.Item name="summary" label="Professional Summary">
                <TextArea 
                  rows={4} 
                  placeholder="Brief summary about your professional background..."
                  style={{ fontSize: 15 }}
                />
              </Form.Item>
            </Card>

            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
              <Title level={4} style={{ fontSize: 18, marginBottom: 16 }}>
                <BookOutlined style={{ marginRight: 8, color: '#faad14' }} />
                Education
              </Title>
              <Form.Item name="education" label="Education Background">
                <TextArea 
                  rows={5} 
                  placeholder="e.g., Bachelor of Computer Science&#10;University Name, 2018-2022&#10;GPA: 3.8/4.0"
                  style={{ fontSize: 15 }}
                />
              </Form.Item>
            </Card>

            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
              <Title level={4} style={{ fontSize: 18, marginBottom: 16 }}>
                <ProjectOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                Work Experience
              </Title>
              <Form.Item name="experience" label="Professional Experience">
                <TextArea 
                  rows={6} 
                  placeholder="e.g., Software Engineer&#10;Company Name, 2022-Present&#10;- Developed web applications using React&#10;- Collaborated with team of 5 developers"
                  style={{ fontSize: 15 }}
                />
              </Form.Item>
            </Card>

            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
              <Title level={4} style={{ fontSize: 18, marginBottom: 16 }}>
                <TrophyOutlined style={{ marginRight: 8, color: '#eb2f96' }} />
                Skills
              </Title>
              <Form.Item 
                name="skills" 
                label="Technical & Soft Skills"
                extra="Separate skills with commas"
              >
                <TextArea 
                  rows={3} 
                  placeholder="JavaScript, React, Node.js, TypeScript, Communication, Problem Solving"
                  style={{ fontSize: 15 }}
                />
              </Form.Item>
            </Card>
          </Form>
        </div>

        {/* Right: Live Preview Section */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Card 
            style={{ 
              borderRadius: 12,
              minHeight: 'calc(100vh - 140px)',
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ 
              maxWidth: 800, 
              margin: '0 auto',
              padding: '40px',
              background: 'white',
              minHeight: '100%'
            }}>
              {/* CV Preview Header */}
              <div style={{ textAlign: 'center', marginBottom: 40, paddingBottom: 32, borderBottom: '3px solid #1890ff' }}>
                <Title level={1} style={{ 
                  fontSize: 36, 
                  fontWeight: 700, 
                  marginBottom: 8,
                  color: '#1890ff'
                }}>
                  {formValues.full_name || 'Your Name'}
                </Title>
                <Space split={<span style={{ color: '#ddd' }}>|</span>} style={{ fontSize: 15, color: '#666' }}>
                  {formValues.email && (
                    <span><MailOutlined style={{ marginRight: 6 }} />{formValues.email}</span>
                  )}
                  {formValues.phone && (
                    <span><PhoneOutlined style={{ marginRight: 6 }} />{formValues.phone}</span>
                  )}
                  {formValues.location && (
                    <span><EnvironmentOutlined style={{ marginRight: 6 }} />{formValues.location}</span>
                  )}
                </Space>
              </div>

              {/* Professional Summary */}
              {formValues.summary && (
                <div style={{ marginBottom: 32 }}>
                  <Title level={3} style={{ 
                    fontSize: 20, 
                    fontWeight: 600, 
                    color: '#1890ff',
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottom: '2px solid #e8e8e8'
                  }}>
                    Professional Summary
                  </Title>
                  <Paragraph style={{ fontSize: 15, lineHeight: 1.8, color: '#555' }}>
                    {formValues.summary}
                  </Paragraph>
                </div>
              )}

              {/* Education */}
              {formValues.education && (
                <div style={{ marginBottom: 32 }}>
                  <Title level={3} style={{ 
                    fontSize: 20, 
                    fontWeight: 600, 
                    color: '#1890ff',
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottom: '2px solid #e8e8e8'
                  }}>
                    <BookOutlined style={{ marginRight: 8 }} />
                    Education
                  </Title>
                  <Paragraph style={{ fontSize: 15, lineHeight: 1.8, color: '#555', whiteSpace: 'pre-line' }}>
                    {formValues.education}
                  </Paragraph>
                </div>
              )}

              {/* Work Experience */}
              {formValues.experience && (
                <div style={{ marginBottom: 32 }}>
                  <Title level={3} style={{ 
                    fontSize: 20, 
                    fontWeight: 600, 
                    color: '#1890ff',
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottom: '2px solid #e8e8e8'
                  }}>
                    <ProjectOutlined style={{ marginRight: 8 }} />
                    Work Experience
                  </Title>
                  <Paragraph style={{ fontSize: 15, lineHeight: 1.8, color: '#555', whiteSpace: 'pre-line' }}>
                    {formValues.experience}
                  </Paragraph>
                </div>
              )}

              {/* Skills */}
              {formValues.skills && (
                <div style={{ marginBottom: 32 }}>
                  <Title level={3} style={{ 
                    fontSize: 20, 
                    fontWeight: 600, 
                    color: '#1890ff',
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottom: '2px solid #e8e8e8'
                  }}>
                    <TrophyOutlined style={{ marginRight: 8 }} />
                    Skills
                  </Title>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {formValues.skills.split(',').map((skill, idx) => (
                      <Tag 
                        key={idx} 
                        color="blue" 
                        style={{ 
                          fontSize: 14, 
                          padding: '4px 12px',
                          borderRadius: 6,
                          marginBottom: 0
                        }}
                      >
                        {skill.trim()}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!formValues.full_name && !formValues.email && !formValues.summary && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                  <FileTextOutlined style={{ fontSize: 64, marginBottom: 16, opacity: 0.3 }} />
                  <Paragraph style={{ fontSize: 16 }}>
                    Start filling out the form to see your CV preview
                  </Paragraph>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CVs
