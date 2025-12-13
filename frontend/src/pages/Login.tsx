import React from 'react'
import { Form, Input, Button, message, Typography, Divider } from 'antd'
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, AppleOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

const { Title, Text } = Typography

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
    <div style={{ 
      display: 'flex',
      minHeight: 'calc(100vh - 128px)',
      background: '#fff'
    }}>
      {/* Left Side - Illustration */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        background: '#f7f9fa'
      }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontSize: 120, marginBottom: 24 }}>📚</div>
          <Title level={2} style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            marginBottom: 16,
            color: '#1c1d1f',
            fontFamily: "'Segoe UI', 'Roboto', sans-serif"
          }}>
            Learn from the best instructors
          </Title>
          <Text style={{ 
            fontSize: 18, 
            color: '#6a6f73',
            fontFamily: "'Segoe UI', 'Roboto', sans-serif"
          }}>
            Join millions of learners advancing their careers with SkillSync
          </Text>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Title level={2} style={{ 
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 32,
            color: '#1c1d1f',
            textAlign: 'center',
            fontFamily: "'Segoe UI', 'Roboto', sans-serif"
          }}>
            Log in to your account
          </Title>

          {/* Social Login Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            <Button 
              size="large"
              icon={<GoogleOutlined />}
              style={{ 
                height: 48,
                borderRadius: 4,
                border: '1px solid #1c1d1f',
                fontWeight: 600,
                fontSize: 14,
                fontFamily: "'Segoe UI', 'Roboto', sans-serif"
              }}
            >
              Continue with Google
            </Button>
            <Button 
              size="large"
              icon={<FacebookOutlined />}
              style={{ 
                height: 48,
                borderRadius: 4,
                border: '1px solid #1c1d1f',
                fontWeight: 600,
                fontSize: 14,
                fontFamily: "'Segoe UI', 'Roboto', sans-serif"
              }}
            >
              Continue with Facebook
            </Button>
            <Button 
              size="large"
              icon={<AppleOutlined />}
              style={{ 
                height: 48,
                borderRadius: 4,
                border: '1px solid #1c1d1f',
                fontWeight: 600,
                fontSize: 14,
                fontFamily: "'Segoe UI', 'Roboto', sans-serif"
              }}
            >
              Continue with Apple
            </Button>
          </div>

          <Divider style={{ margin: '24px 0' }}>
            <Text style={{ color: '#6a6f73', fontSize: 14 }}>or</Text>
          </Divider>

          {/* Email/Password Form */}
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item 
              name="email" 
              rules={[{ required: true, message: 'Please enter your email', type: 'email' }]}
            >
              <Input 
                size="large"
                prefix={<UserOutlined style={{ color: '#6a6f73' }} />}
                placeholder="Email"
                style={{ 
                  height: 48,
                  borderRadius: 4,
                  fontSize: 14,
                  fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                }}
              />
            </Form.Item>
            <Form.Item 
              name="password" 
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password 
                size="large"
                prefix={<LockOutlined style={{ color: '#6a6f73' }} />}
                placeholder="Password"
                style={{ 
                  height: 48,
                  borderRadius: 4,
                  fontSize: 14,
                  fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block
                size="large"
                style={{ 
                  height: 48,
                  borderRadius: 4,
                  background: '#a435f0',
                  borderColor: '#a435f0',
                  fontWeight: 700,
                  fontSize: 16,
                  fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                }}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Text style={{ color: '#6a6f73', fontSize: 14, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#a435f0', fontWeight: 700, textDecoration: 'underline' }}>
                Sign up
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
