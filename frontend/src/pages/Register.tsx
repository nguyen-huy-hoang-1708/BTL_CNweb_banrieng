import React from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const Register: React.FC = () => {
  const navigate = useNavigate()

  const onFinish = async (values: { email: string; password: string; full_name: string }) => {
    try {
      await api.post('/api/auth/register', values)
      message.success('Registration successful! Please login.')
      navigate('/login')
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '48px auto' }}>
      <Card title="Register">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Full Name" name="full_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Register
