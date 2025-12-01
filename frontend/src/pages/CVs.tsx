import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Modal, Form, Input, Select, Spin, Alert, Empty, Space, Typography, message, Tag, Descriptions } from 'antd'
import { FileTextOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import api from '../services/api'

const { Title, Paragraph } = Typography
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

const CVs: React.FC = () => {
  const [items, setItems] = useState<CV[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [selectedCV, setSelectedCV] = useState<CV | null>(null)
  const [form] = Form.useForm()

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

  const handleCreate = async (values: any) => {
    try {
      await api.post('/api/cvs', {
        ...values,
        template_style: values.template_style || 'modern'
      })
      message.success('CV created successfully!')
      setModalVisible(false)
      form.resetFields()
      loadCVs()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to create CV')
    }
  }

  const handlePreview = (cv: CV) => {
    setSelectedCV(cv)
    setPreviewVisible(true)
  }

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '48px auto' }} />
  if (error) return <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2}>My CVs</Title>
          <Paragraph>Create and manage your professional CVs</Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)} size="large">
          Create New CV
        </Button>
      </div>

      {items.length === 0 ? (
        <Empty description="No CVs created yet. Create your first CV to get started!" />
      ) : (
        <Row gutter={[16, 16]}>
          {items.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.cv_id}>
              <Card
                hoverable
                actions={[
                  <Button type="link" icon={<EyeOutlined />} onClick={() => handlePreview(item)}>Preview</Button>,
                  <Button type="link" icon={<EditOutlined />}>Edit</Button>,
                ]}
              >
                <Card.Meta
                  avatar={<FileTextOutlined style={{ fontSize: 32, color: '#1890ff' }} />}
                  title={item.cv_name}
                  description={
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Tag color="blue">{item.template_style || 'Default'}</Tag>
                      <div style={{ fontSize: 12, color: '#999' }}>
                        Created: {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="Create New CV"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="cv_name" label="CV Name" rules={[{ required: true, message: 'Please enter CV name' }]}>
            <Input placeholder="e.g., Software Engineer CV" />
          </Form.Item>
          <Form.Item name="template_style" label="Template Style" initialValue="modern">
            <Select>
              <Select.Option value="modern">Modern</Select.Option>
              <Select.Option value="classic">Classic</Select.Option>
              <Select.Option value="minimal">Minimal</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="skills" label="Skills (comma separated)">
            <Input placeholder="JavaScript, React, Node.js" />
          </Form.Item>
          <Form.Item name="experience" label="Work Experience">
            <TextArea rows={4} placeholder="Describe your work experience..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={selectedCV?.cv_name}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>Close</Button>,
          selectedCV?.pdf_url && (
            <Button key="download" type="primary" href={selectedCV.pdf_url} target="_blank">
              Download PDF
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedCV && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Template">{selectedCV.template_style || 'Default'}</Descriptions.Item>
            <Descriptions.Item label="Created">{new Date(selectedCV.created_at).toLocaleString()}</Descriptions.Item>
            {selectedCV.skills && (
              <Descriptions.Item label="Skills">{JSON.stringify(selectedCV.skills)}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default CVs
