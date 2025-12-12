import React, { useEffect, useState } from 'react'
import { Card, Descriptions, Avatar, Spin, Alert, Button, Typography, Space, Modal, Form, Input, message } from 'antd'
import { UserOutlined, MailOutlined, CalendarOutlined, EditOutlined, LockOutlined } from '@ant-design/icons'
import api from '../services/api'

const { Title } = Typography

type UserInfo = {
  user_id: string
  full_name: string
  email: string
  created_at: string
  current_level?: string
  role?: string
  avatar_url?: string
}

const Account: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editForm] = Form.useForm()
  const [passwordForm] = Form.useForm()

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      setError('Please login to view account information')
      setLoading(false)
      return
    }

    // Fetch user info
    api
      .get(`/api/auth/users/${userId}`)
      .then((res) => {
        setUser(res.data?.data || res.data)
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load account information')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleEditProfile = async (values: { full_name: string; avatar_url?: string }) => {
    const userId = localStorage.getItem('user_id')
    if (!userId) return

    setSubmitting(true)
    try {
      const res = await api.patch(`/api/auth/users/${userId}/profile`, values)
      setUser(res.data?.data || res.data)
      message.success('Cập nhật thông tin thành công!')
      setEditModalVisible(false)
      editForm.resetFields()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Cập nhật thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangePassword = async (values: { currentPassword: string; newPassword: string }) => {
    const userId = localStorage.getItem('user_id')
    if (!userId) return

    setSubmitting(true)
    try {
      await api.patch(`/api/auth/users/${userId}/password`, values)
      message.success('Đổi mật khẩu thành công!')
      setPasswordModalVisible(false)
      passwordForm.resetFields()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Đổi mật khẩu thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = () => {
    editForm.setFieldsValue({
      full_name: user?.full_name,
      avatar_url: user?.avatar_url
    })
    setEditModalVisible(true)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
        <Alert type="error" message={error} showIcon />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 128px)', background: '#f5f5f5' }}>
      {/* Left Sidebar - Profile Summary */}
      <div style={{ 
        width: 320, 
        background: 'white', 
        borderRight: '1px solid #e8e8e8',
        padding: '32px 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Avatar 
            size={120} 
            icon={<UserOutlined />} 
            src={user?.avatar_url}
            style={{ 
              backgroundColor: '#1890ff', 
              marginBottom: 16,
              border: '4px solid #f0f0f0'
            }} 
          />
          <Title level={3} style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            {user?.full_name || 'User'}
          </Title>
          <div style={{ color: '#666', fontSize: 14, marginTop: 8 }}>
            <MailOutlined style={{ marginRight: 6 }} />
            {user?.email}
          </div>
          {user?.role && (
            <div style={{ marginTop: 12 }}>
              <span style={{ 
                padding: '6px 16px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 16,
                fontSize: '13px',
                fontWeight: 600
              }}>
                {user.role.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div style={{ 
          padding: 16, 
          background: '#f0f5ff', 
          borderRadius: 12,
          marginBottom: 24
        }}>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>Trình độ hiện tại</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1890ff', textTransform: 'uppercase' }}>
            {user?.current_level || 'beginner'}
          </div>
        </div>

        <div style={{ 
          padding: 16, 
          background: '#fafafa', 
          borderRadius: 12,
          marginBottom: 24
        }}>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
            <CalendarOutlined style={{ marginRight: 6 }} />
            Tham gia từ
          </div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'N/A'}
          </div>
        </div>

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={openEditModal}
            block
            size="large"
            style={{ height: 44, fontSize: 15, fontWeight: 600, borderRadius: 8 }}
          >
            Chỉnh sửa thông tin
          </Button>
          <Button 
            icon={<LockOutlined />} 
            onClick={() => setPasswordModalVisible(true)}
            block
            size="large"
            style={{ height: 44, fontSize: 15, borderRadius: 8 }}
          >
            Đổi mật khẩu
          </Button>
        </Space>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        padding: '40px 60px',
        overflowY: 'auto'
      }}>
        <div style={{ maxWidth: 900 }}>
          <Title level={2} style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>
            Personal details
          </Title>

          {/* Personal Information Card */}
          <Card 
            title={
              <Space>
                <UserOutlined style={{ color: '#1890ff', fontSize: 20 }} />
                <span style={{ fontSize: 18, fontWeight: 600 }}>Thông tin cá nhân</span>
              </Space>
            }
            style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <Descriptions 
              column={1}
              labelStyle={{ fontWeight: 600, width: '180px', fontSize: 15 }}
              contentStyle={{ fontSize: 15 }}
            >
              <Descriptions.Item label="Họ và tên">
                {user?.full_name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Trình độ">
                <span style={{ 
                  padding: '4px 12px', 
                  background: user?.current_level === 'advanced' ? '#f6ffed' : user?.current_level === 'intermediate' ? '#fff7e6' : '#e6f7ff',
                  color: user?.current_level === 'advanced' ? '#52c41a' : user?.current_level === 'intermediate' ? '#faad14' : '#1890ff',
                  borderRadius: 8,
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}>
                  {user?.current_level || 'beginner'}
                </span>
              </Descriptions.Item>
              {user?.avatar_url && (
                <Descriptions.Item label="Avatar URL">
                  <a href={user.avatar_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14 }}>
                    {user.avatar_url}
                  </a>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Account Information Card */}
          <Card 
            title={
              <Space>
                <LockOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                <span style={{ fontSize: 18, fontWeight: 600 }}>Thông tin tài khoản</span>
              </Space>
            }
            style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <Descriptions 
              column={1}
              labelStyle={{ fontWeight: 600, width: '180px', fontSize: 15 }}
              contentStyle={{ fontSize: 15 }}
            >
              <Descriptions.Item label="User ID">
                <code style={{ 
                  background: '#f5f5f5', 
                  padding: '6px 12px', 
                  borderRadius: 6,
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }}>
                  {user?.user_id}
                </code>
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                {user?.role || 'user'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Additional Info Placeholder */}
          <Card 
            title={
              <Space>
                <CalendarOutlined style={{ color: '#faad14', fontSize: 20 }} />
                <span style={{ fontSize: 18, fontWeight: 600 }}>Work preferences</span>
              </Space>
            }
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#999' }}>
              <UserOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
              <div style={{ fontSize: 16 }}>Phần này có thể thêm thông tin về sở thích học tập, mục tiêu nghề nghiệp...</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>Chỉnh sửa thông tin</span>
          </Space>
        }
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditProfile}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Họ và tên"
            name="full_name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            label="Avatar URL"
            name="avatar_url"
          >
            <Input size="large" placeholder="https://example.com/avatar.jpg" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }} size="middle">
              <Button size="large" onClick={() => setEditModalVisible(false)} style={{ height: 44, padding: '0 24px' }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting} size="large" style={{ height: 44, padding: '0 32px', fontWeight: 600 }}>
                Lưu thay đổi
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title={
          <Space>
            <LockOutlined style={{ color: '#52c41a', fontSize: 20 }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>Đổi mật khẩu</span>
          </Space>
        }
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
                },
              }),
            ]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }} size="middle">
              <Button size="large" onClick={() => setPasswordModalVisible(false)} style={{ height: 44, padding: '0 24px' }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting} size="large" style={{ height: 44, padding: '0 32px', fontWeight: 600 }}>
                Đổi mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Account
