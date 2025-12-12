import React, { useEffect, useState } from 'react'
import { List, Card, Tag, Button, Modal, Form, Input, Select, message, Empty, Avatar, Typography, Space } from 'antd'
import { UserOutlined, PlusOutlined, MessageOutlined, ClockCircleOutlined } from '@ant-design/icons'
import api from '../services/api'

const { Title, Text } = Typography

type InterviewSession = {
  session_id: string
  session_name: string
  interview_type: string
  score?: number
  created_at: string
}

const Interviews: React.FC = () => {
  const [items, setItems] = useState<InterviewSession[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null)
  const [form] = Form.useForm()

  const fetchInterviews = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/interviews/sessions')
      const data = res.data?.data || res.data || []
      setItems(Array.isArray(data) ? data : [])
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to load interviews')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterviews()
  }, [])

  const onCreate = async (values: any) => {
    try {
      await api.post('/api/interviews/sessions', values)
      message.success('Interview session created!')
      setModalVisible(false)
      form.resetFields()
      fetchInterviews()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to create session')
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'simulated' ? '#1890ff' : '#52c41a'
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 128px)', background: '#f5f5f5' }}>
      {/* Sidebar - Session List */}
      <div style={{ 
        width: 380, 
        background: 'white', 
        borderRight: '1px solid #e8e8e8',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid #e8e8e8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Title level={3} style={{ margin: 0, fontSize: 24 }}>
            <MessageOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            Interview Sessions
          </Title>
          <Button 
            type="primary" 
            shape="circle" 
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setModalVisible(true)}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#999' }}>Loading...</div>
          ) : items.length === 0 ? (
            <Empty 
              description="No sessions yet" 
              style={{ marginTop: 80 }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <List
              dataSource={items}
              renderItem={(item) => (
                <div
                  onClick={() => setSelectedSession(item)}
                  style={{
                    padding: '16px 24px',
                    cursor: 'pointer',
                    background: selectedSession?.session_id === item.session_id ? '#e6f7ff' : 'white',
                    borderLeft: selectedSession?.session_id === item.session_id ? '4px solid #1890ff' : '4px solid transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSession?.session_id !== item.session_id) {
                      e.currentTarget.style.background = '#fafafa'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSession?.session_id !== item.session_id) {
                      e.currentTarget.style.background = 'white'
                    }
                  }}
                >
                  <Space align="start" style={{ width: '100%' }}>
                    <Avatar 
                      size={52} 
                      icon={<UserOutlined />} 
                      style={{ background: getTypeColor(item.interview_type), flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontSize: 16, 
                        fontWeight: 600, 
                        marginBottom: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.session_name}
                      </div>
                      <div style={{ fontSize: 13, color: '#999', marginBottom: 6 }}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {new Date(item.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <Space size={8}>
                        <Tag color={getTypeColor(item.interview_type)} style={{ margin: 0, borderRadius: 12 }}>
                          {item.interview_type}
                        </Tag>
                        {item.score != null && (
                          <Tag color="gold" style={{ margin: 0, borderRadius: 12 }}>
                            Score: {item.score}
                          </Tag>
                        )}
                      </Space>
                    </div>
                  </Space>
                </div>
              )}
            />
          )}
        </div>
      </div>

      {/* Main Content - Chat Area */}
      <div style={{ 
        flex: 1, 
        background: '#f5f7fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {selectedSession ? (
          <Card style={{ 
            maxWidth: 800, 
            width: '90%', 
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }} size="large">
              <Avatar 
                size={80} 
                icon={<UserOutlined />} 
                style={{ background: getTypeColor(selectedSession.interview_type) }}
              />
              <div>
                <Title level={2} style={{ marginBottom: 8 }}>{selectedSession.session_name}</Title>
                <Space size={12}>
                  <Tag color={getTypeColor(selectedSession.interview_type)} style={{ fontSize: 14, padding: '4px 16px', borderRadius: 16 }}>
                    {selectedSession.interview_type}
                  </Tag>
                  {selectedSession.score != null && (
                    <Tag color="gold" style={{ fontSize: 14, padding: '4px 16px', borderRadius: 16 }}>
                      📊 Score: {selectedSession.score}
                    </Tag>
                  )}
                </Space>
              </div>
              <Text type="secondary" style={{ fontSize: 15 }}>
                <ClockCircleOutlined style={{ marginRight: 6 }} />
                Created on {new Date(selectedSession.created_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              <div style={{ 
                width: '100%', 
                padding: 24, 
                background: '#f0f5ff', 
                borderRadius: 12,
                marginTop: 16
              }}>
                <Text style={{ fontSize: 15, color: '#666' }}>
                  💬 Interview chat history and feedback will appear here
                </Text>
              </div>
              <Space size={12}>
                <Button type="primary" size="large" style={{ height: 44, padding: '0 32px', fontSize: 16, fontWeight: 600, borderRadius: 8 }}>
                  Start Interview
                </Button>
                <Button size="large" style={{ height: 44, padding: '0 32px', fontSize: 16, borderRadius: 8 }}>
                  View Details
                </Button>
              </Space>
            </Space>
          </Card>
        ) : (
          <Empty 
            description={
              <Space direction="vertical" size={12}>
                <Text style={{ fontSize: 18, color: '#999' }}>Select a session from the left sidebar</Text>
                <Text style={{ fontSize: 15, color: '#bbb' }}>or create a new one to get started</Text>
              </Space>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ marginTop: -80 }}
          />
        )}
      </div>

      <Modal
        title={
          <Space>
            <PlusOutlined />
            <span>Create New Interview Session</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={onCreate} style={{ marginTop: 24 }}>
          <Form.Item label="Session Name" name="session_name" rules={[{ required: true, message: 'Please enter session name' }]}>
            <Input size="large" placeholder="e.g., Frontend Developer Interview" />
          </Form.Item>
          <Form.Item label="Interview Type" name="interview_type" rules={[{ required: true, message: 'Please select type' }]}>
            <Select size="large" placeholder="Choose interview type">
              <Select.Option value="simulated">🎭 Simulated Interview</Select.Option>
              <Select.Option value="prep_feedback">📝 Prep & Feedback</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block size="large" style={{ height: 44, fontSize: 16, fontWeight: 600, borderRadius: 8 }}>
              Create Session
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Interviews
