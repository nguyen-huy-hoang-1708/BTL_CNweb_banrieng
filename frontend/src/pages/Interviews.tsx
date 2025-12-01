import React, { useEffect, useState } from 'react'
import { List, Card, Tag, Button, Modal, Form, Input, Select, message, Empty } from 'antd'
import api from '../services/api'

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

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => setModalVisible(true)}>
        New Interview Session
      </Button>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>Loading...</div>
      ) : items.length === 0 ? (
        <Empty description="No interview sessions yet" />
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={items}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={item.session_name}
                extra={<Tag color="green">{item.interview_type}</Tag>}
              >
                <p>Score: {item.score ?? 'N/A'}</p>
                <p>Created: {new Date(item.created_at).toLocaleDateString()}</p>
              </Card>
            </List.Item>
          )}
        />
      )}
      <Modal
        title="Create Interview Session"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onCreate}>
          <Form.Item label="Session Name" name="session_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Type" name="interview_type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="simulated">Simulated</Select.Option>
              <Select.Option value="prep_feedback">Prep Feedback</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Interviews
