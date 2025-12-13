import React, { useEffect, useState } from 'react'
import { Card, Avatar, Spin, Alert, Button, Typography, Space, Modal, Form, Input, message, Tabs, Badge, Progress } from 'antd'
import { UserOutlined, MailOutlined, CalendarOutlined, EditOutlined, LockOutlined, BookOutlined, TrophyOutlined, LineChartOutlined, SafetyCertificateOutlined, ClockCircleOutlined, RocketOutlined } from '@ant-design/icons'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography
const { TabPane } = Tabs

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
  const [progressData, setProgressData] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [editForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const navigate = useNavigate()

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      setError('Please login to view account information')
      setLoading(false)
      return
    }

    // Fetch user info, progress, and certificates
    Promise.all([
      api.get(`/api/auth/users/${userId}`),
      api.get(`/api/progress/user/${userId}`).catch(() => ({ data: [] })),
      api.get(`/api/certificates/user/${userId}`).catch(() => ({ data: [] }))
    ])
      .then(([userRes, progressRes, certsRes]) => {
        setUser(userRes.data?.data || userRes.data)
        setProgressData(progressRes.data?.data || progressRes.data || [])
        setCertificates(certsRes.data?.data || certsRes.data || [])
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
    <>
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#f0f2f5' }}>
      {/* Left Sidebar */}
      <div style={{ 
        width: 280, 
        background: 'white', 
        borderRight: '1px solid #e8e8e8',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: 'calc(100vh - 64px)',
        overflowY: 'auto'
      }}>
        {/* Avatar Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 16,
          padding: '32px 20px',
          textAlign: 'center',
          marginBottom: 24
        }}>
          <Avatar 
            size={100} 
            icon={<UserOutlined />} 
            src={user?.avatar_url}
            style={{ 
              backgroundColor: 'white', 
              marginBottom: 16,
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }} 
          />
          <div style={{ 
            color: 'white', 
            fontSize: 18, 
            fontWeight: 700, 
            marginBottom: 6,
            fontFamily: "'Poppins', sans-serif"
          }}>
            {user?.full_name || 'User'}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 12 }}>
            {user?.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
          </div>
          <Badge 
            status="success" 
            text={<span style={{ color: 'white', fontSize: 12 }}>{user?.user_id?.substring(0, 8)}</span>} 
          />
          <div style={{ marginTop: 12, color: 'white', fontSize: 13 }}>
            <span style={{ 
              padding: '4px 12px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 12,
              textTransform: 'uppercase',
              fontWeight: 600
            }}>
              {user?.current_level || 'Beginner'}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <Card 
          size="small" 
          style={{ marginBottom: 16, borderRadius: 12 }}
          bodyStyle={{ padding: 12 }}
        >
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MailOutlined style={{ color: '#1890ff' }} />
              <Text style={{ fontSize: 13 }} ellipsis>{user?.email}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarOutlined style={{ color: '#52c41a' }} />
              <Text style={{ fontSize: 13 }}>
                Tham gia: {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOutlined style={{ color: '#faad14' }} />
              <Text style={{ fontSize: 13 }}>
                {progressData.length} khóa học
              </Text>
            </div>
          </Space>
        </Card>

        {/* Quick Stats */}
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, display: 'block' }}>Thống kê nhanh</Text>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <div style={{ 
              padding: 12, 
              background: '#e6f7ff', 
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={{ fontSize: 13 }}>Khóa học đang học</Text>
              <Text strong style={{ fontSize: 16, color: '#1890ff' }}>{progressData.length}</Text>
            </div>
            <div style={{ 
              padding: 12, 
              background: '#f6ffed', 
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={{ fontSize: 13 }}>Chứng chỉ đạt được</Text>
              <Text strong style={{ fontSize: 16, color: '#52c41a' }}>{certificates.length}</Text>
            </div>
          </Space>
        </div>

        {/* Navigation Menu */}
        <div style={{ flex: 1 }}>
          <div style={{ 
            padding: '12px 16px',
            cursor: 'pointer',
            fontSize: 14,
            color: '#1890ff',
            background: '#e6f7ff',
            borderLeft: '3px solid #1890ff',
            borderRadius: 8,
            marginBottom: 8,
            fontWeight: 600
          }}>
            👤 Thông tin cá nhân
          </div>
          <div 
            onClick={() => navigate('/progress')}
            style={{ 
              padding: '12px 16px',
              cursor: 'pointer',
              fontSize: 14,
              color: '#666',
              marginBottom: 8,
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            📊 Tiến độ học tập
          </div>
          <div 
            onClick={() => navigate('/certificates')}
            style={{ 
              padding: '12px 16px',
              cursor: 'pointer',
              fontSize: 14,
              color: '#666',
              marginBottom: 8,
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            🎓 Chứng chỉ
          </div>
          <div 
            onClick={() => navigate('/roadmaps')}
            style={{ 
              padding: '12px 16px',
              cursor: 'pointer',
              fontSize: 14,
              color: '#666',
              marginBottom: 8,
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            🗺️ Lộ trình học
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2} style={{ 
            fontSize: 28, 
            fontWeight: 800, 
            marginBottom: 24,
            fontFamily: "'Poppins', 'Segoe UI', 'Roboto', sans-serif"
          }}>
            Thông tin cá nhân
          </Title>

          {/* Tabs Section */}
          <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <Tabs defaultActiveKey="1" size="large">
              <TabPane 
                tab={
                  <Space>
                    <UserOutlined style={{ color: '#1890ff' }} />
                    <span>THÔNG TIN CƠ BẢN</span>
                  </Space>
                } 
                key="1"
              >
                <div style={{ padding: '24px 0' }}>
                  <div style={{ 
                    color: '#1890ff', 
                    fontSize: 18, 
                    fontWeight: 700, 
                    marginBottom: 24,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <UserOutlined />
                    THÔNG TIN CÁ NHÂN
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 13 }}>Họ và tên</Text>
                      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{user?.full_name}</div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 13 }}>Email</Text>
                      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{user?.email}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 13 }}>Trình độ hiện tại</Text>
                      <div style={{ marginTop: 4 }}>
                        <span style={{ 
                          padding: '6px 16px',
                          background: user?.current_level === 'advanced' ? '#f6ffed' : user?.current_level === 'intermediate' ? '#fff7e6' : '#e6f7ff',
                          color: user?.current_level === 'advanced' ? '#52c41a' : user?.current_level === 'intermediate' ? '#faad14' : '#1890ff',
                          borderRadius: 8,
                          fontSize: '14px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          display: 'inline-block'
                        }}>
                          {user?.current_level || 'Beginner'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 13 }}>Vai trò</Text>
                      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4, textTransform: 'capitalize' }}>
                        {user?.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 13 }}>User ID</Text>
                      <div style={{ marginTop: 4 }}>
                        <code style={{ 
                          background: '#f5f5f5', 
                          padding: '6px 12px', 
                          borderRadius: 6,
                          fontSize: '13px',
                          fontFamily: 'monospace'
                        }}>
                          {user?.user_id}
                        </code>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 13 }}>Ngày tham gia</Text>
                      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {user?.avatar_url && (
                    <div style={{ marginTop: 24 }}>
                      <Text type="secondary" style={{ fontSize: 13 }}>Avatar URL</Text>
                      <div style={{ marginTop: 4 }}>
                        <a href={user.avatar_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#1890ff', wordBreak: 'break-all' }}>
                          {user.avatar_url}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </TabPane>

              <TabPane 
                tab={
                  <Space>
                    <BookOutlined />
                    <span>KHÓA HỌC CỦA TÔI</span>
                  </Space>
                } 
                key="2"
              >
                <div style={{ padding: '24px 0' }}>
                  <div style={{ 
                    color: '#1890ff', 
                    fontSize: 18, 
                    fontWeight: 700, 
                    marginBottom: 24,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <BookOutlined />
                    DANH SÁCH KHÓA HỌC
                  </div>
                  
                  {progressData.length > 0 ? (
                    <Space direction="vertical" style={{ width: '100%' }} size={16}>
                      {progressData.slice(0, 5).map((course: any, idx: number) => (
                        <Card 
                          key={idx}
                          size="small"
                          hoverable
                          onClick={() => navigate('/progress')}
                          style={{ borderRadius: 12 }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div>
                              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                                {course.roadmap_title || `Khóa học ${idx + 1}`}
                              </div>
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                {course.modules_count || 0} modules • Đang học
                              </Text>
                            </div>
                            <RocketOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                          </div>
                          <Progress 
                            percent={Math.round((course.completed_count / (course.modules_count || 1)) * 100)} 
                            strokeColor={{
                              '0%': '#667eea',
                              '100%': '#764ba2',
                            }}
                          />
                        </Card>
                      ))}
                    </Space>
                  ) : (
                    <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
                      <BookOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                      <div>Bạn chưa đăng ký khóa học nào</div>
                    </div>
                  )}
                </div>
              </TabPane>

              <TabPane 
                tab={
                  <Space>
                    <TrophyOutlined />
                    <span>CHỨNG CHỈ</span>
                  </Space>
                } 
                key="3"
              >
                <div style={{ padding: '24px 0' }}>
                  <div style={{ 
                    color: '#1890ff', 
                    fontSize: 18, 
                    fontWeight: 700, 
                    marginBottom: 24,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <SafetyCertificateOutlined />
                    CHỨNG CHỈ ĐÃ ĐẠT ĐƯỢC
                  </div>
                  
                  {certificates.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                      {certificates.map((cert: any, idx: number) => (
                        <Card 
                          key={idx}
                          size="small"
                          hoverable
                          style={{ 
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, #f6f9fc 0%, #fff 100%)',
                            border: '2px solid #e8e8e8'
                          }}
                        >
                          <div style={{ textAlign: 'center', padding: '12px 0' }}>
                            <TrophyOutlined style={{ fontSize: 36, color: '#faad14', marginBottom: 12 }} />
                            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
                              {cert.certificate_name || cert.roadmap_title}
                            </div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Hoàn thành: {cert.issued_date ? new Date(cert.issued_date).toLocaleDateString('vi-VN') : 'N/A'}
                            </Text>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
                      <SafetyCertificateOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                      <div>Chưa có chứng chỉ nào</div>
                      <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/roadmaps')}>
                        Khám phá khóa học
                      </Button>
                    </div>
                  )}
                </div>
              </TabPane>

              <TabPane 
                tab={
                  <Space>
                    <LineChartOutlined />
                    <span>HOẠT ĐỘNG</span>
                  </Space>
                } 
                key="4"
              >
                <div style={{ padding: '24px 0' }}>
                  <div style={{ 
                    color: '#1890ff', 
                    fontSize: 18, 
                    fontWeight: 700, 
                    marginBottom: 24,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <LineChartOutlined />
                    LỊCH SỬ HOẠT ĐỘNG
                  </div>
                  
                  <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
                    <ClockCircleOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                    <div>Chức năng đang được phát triển</div>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Card>

          {/* Action Buttons */}
          <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={openEditModal}
              size="large"
              style={{
                borderRadius: 8,
                fontWeight: 600,
                height: 48
              }}
            >
              Chỉnh sửa thông tin
            </Button>
            <Button 
              icon={<LockOutlined />} 
              onClick={() => setPasswordModalVisible(true)}
              size="large"
              style={{
                borderRadius: 8,
                fontWeight: 600,
                height: 48
              }}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Learning Stats */}
      <div style={{ 
        width: 320, 
        background: 'white', 
        borderLeft: '1px solid #e8e8e8',
        padding: 24,
        overflowY: 'auto'
      }}>
        <Title level={4} style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Thống kê học tập
        </Title>

        {/* Learning Progress */}
        <Card 
          size="small"
          style={{ 
            marginBottom: 16, 
            borderRadius: 12,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}
        >
          <div style={{ color: 'white', textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: 40, fontWeight: 800, marginBottom: 8 }}>
              {progressData.length}
            </div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>Khóa học đang theo học</div>
          </div>
        </Card>

        <Card 
          size="small"
          style={{ 
            marginBottom: 16, 
            borderRadius: 12,
            background: 'linear-gradient(135deg, #52c41a 0%, #237804 100%)',
            border: 'none'
          }}
        >
          <div style={{ color: 'white', textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: 40, fontWeight: 800, marginBottom: 8 }}>
              {certificates.length}
            </div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>Chứng chỉ đã đạt</div>
          </div>
        </Card>

        {/* Recent Courses */}
        <div style={{ marginTop: 24 }}>
          <Title level={5} style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            Khóa học gần đây
          </Title>
          
          {progressData.length > 0 ? (
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {progressData.slice(0, 4).map((course: any, idx: number) => (
                <div 
                  key={idx}
                  style={{ 
                    padding: 12,
                    background: '#fafafa',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => navigate('/progress')}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fafafa'}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: '#1a1a1a' }}>
                    {course.roadmap_title || `Khóa học ${idx + 1}`}
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    {course.modules_count || 0} modules
                  </div>
                  <Progress 
                    percent={Math.round((course.completed_count / (course.modules_count || 1)) * 100)} 
                    size="small"
                    strokeColor="#1890ff"
                  />
                </div>
              ))}
            </Space>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#999', fontSize: 13 }}>
              Chưa có khóa học nào
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: 24 }}>
          <Title level={5} style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            Hành động nhanh
          </Title>
          <Space direction="vertical" style={{ width: '100%' }} size={8}>
            <Button 
              block 
              onClick={() => navigate('/roadmaps')}
              style={{ 
                height: 40, 
                textAlign: 'left',
                border: '1px solid #d9d9d9'
              }}
            >
              🔍 Khám phá khóa học mới
            </Button>
            <Button 
              block 
              onClick={() => navigate('/progress')}
              style={{ 
                height: 40, 
                textAlign: 'left',
                border: '1px solid #d9d9d9'
              }}
            >
              📚 Tiếp tục học tập
            </Button>
            <Button 
              block 
              onClick={() => navigate('/certificates')}
              style={{ 
                height: 40, 
                textAlign: 'left',
                border: '1px solid #d9d9d9'
              }}
            >
              🏆 Xem chứng chỉ
            </Button>
          </Space>
        </div>
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
            <Input size="large" placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            label="Avatar URL"
            name="avatar_url"
          >
            <Input size="large" placeholder="https://..." />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button size="large" onClick={() => setEditModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting} size="large">
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
            <LockOutlined style={{ color: '#faad14', fontSize: 20 }} />
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
            <Input.Password size="large" placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
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
            <Input.Password size="large" placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button size="large" onClick={() => setPasswordModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting} size="large">
                Đổi mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Account
