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
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Avatar 
            size={100} 
            icon={<UserOutlined />} 
            src={user?.avatar_url}
            style={{ backgroundColor: '#1890ff', marginBottom: 16 }} 
          />
          <Title level={3} style={{ margin: 0 }}>
            {user?.full_name || 'User'}
          </Title>
          {user?.role && (
            <div style={{ marginTop: 8 }}>
              <span style={{ 
                padding: '4px 12px', 
                background: '#e6f7ff', 
                color: '#1890ff',
                borderRadius: 12,
                fontSize: '12px',
                fontWeight: 600
              }}>
                {user.role.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <Descriptions 
          title="Thông tin tài khoản" 
          bordered 
          column={1}
          labelStyle={{ fontWeight: 600, width: '200px' }}
        >
          <Descriptions.Item label={<><UserOutlined /> Họ và tên</>}>
            {user?.full_name}
          </Descriptions.Item>
          <Descriptions.Item label={<><MailOutlined /> Email</>}>
            {user?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Trình độ hiện tại">
            <span style={{ 
              padding: '2px 8px', 
              background: user?.current_level === 'advanced' ? '#52c41a' : user?.current_level === 'intermediate' ? '#faad14' : '#1890ff',
              color: 'white',
              borderRadius: 4,
              fontSize: '12px',
              fontWeight: 600
            }}>
              {user?.current_level || 'beginner'}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={<><CalendarOutlined /> Ngày tạo</>}>
            {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="User ID">
            <code style={{ 
              background: '#f5f5f5', 
              padding: '2px 8px', 
              borderRadius: 4,
              fontSize: '12px'
            }}>
              {user?.user_id}
            </code>
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Space>
            <Button type="primary" icon={<EditOutlined />} onClick={openEditModal}>
              Chỉnh sửa thông tin
            </Button>
            <Button icon={<LockOutlined />} onClick={() => setPasswordModalVisible(true)}>
              Đổi mật khẩu
            </Button>
          </Space>
        </div>
      </Card>

      {/* Edit Profile Modal */}
      <Modal
        title="Chỉnh sửa thông tin"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditProfile}
        >
          <Form.Item
            label="Họ và tên"
            name="full_name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            label="Avatar URL"
            name="avatar_url"
          >
            <Input placeholder="https://example.com/avatar.jpg" />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setEditModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Lưu thay đổi
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title="Đổi mật khẩu"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
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
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setPasswordModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
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
