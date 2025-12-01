import React from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const Login: React.FC = () => {
  const navigate = useNavigate()

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const res = await api.post('/api/auth/login', values)
      message.success('Login successful!')
      const data = res.data?.data || res.data
      if (data.token) localStorage.setItem('token', data.token)
      if (data.user_id) localStorage.setItem('user_id', data.user_id)
      navigate('/')
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '48px auto' }}>
      <Card title="Login">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
