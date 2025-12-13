import React from 'react'
import { Form, Input, Button, message, Typography, Checkbox, Divider } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined, FacebookOutlined, AppleOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

const { Title, Text } = Typography

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
          <div style={{ fontSize: 120, marginBottom: 24 }}>🚀</div>
          <Title level={2} style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            marginBottom: 16,
            color: '#1c1d1f',
            fontFamily: "'Segoe UI', 'Roboto', sans-serif"
          }}>
            Start your learning journey
          </Title>
          <Text style={{ 
            fontSize: 18, 
            color: '#6a6f73',
            fontFamily: "'Segoe UI', 'Roboto', sans-serif"
          }}>
            Sign up and get unlimited access to thousands of courses
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
            Sign up with email
          </Title>

          {/* Social Signup Buttons */}
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
            <Text style={{ color: '#6a6f73', fontSize: 14 }}>Other sign up options</Text>
          </Divider>

          {/* Email/Password Form */}
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item 
              name="full_name" 
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input 
                size="large"
                prefix={<UserOutlined style={{ color: '#6a6f73' }} />}
                placeholder="Full name"
                style={{ 
                  height: 48,
                  borderRadius: 4,
                  fontSize: 14,
                  fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                }}
              />
            </Form.Item>
            <Form.Item 
              name="email" 
              rules={[{ required: true, message: 'Please enter your email', type: 'email' }]}
            >
              <Input 
                size="large"
                prefix={<MailOutlined style={{ color: '#6a6f73' }} />}
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
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
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
            <Form.Item 
              name="agreement" 
              valuePropName="checked"
              rules={[{ required: false }]}
            >
              <Checkbox style={{ fontSize: 12, color: '#6a6f73', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
                Send me special offers, personalized recommendations, and learning tips.
              </Checkbox>
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
                Sign up
              </Button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 12, color: '#6a6f73', display: 'block', marginBottom: 16, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
              By signing up, you agree to our <a href="#" style={{ color: '#a435f0', textDecoration: 'underline' }}>Terms of Use</a> and <a href="#" style={{ color: '#a435f0', textDecoration: 'underline' }}>Privacy Policy</a>.
            </Text>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Text style={{ color: '#6a6f73', fontSize: 14, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#a435f0', fontWeight: 700, textDecoration: 'underline' }}>
                Log in
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
