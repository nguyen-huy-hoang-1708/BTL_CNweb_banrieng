import React, { useEffect, useState } from 'react'
import { Tabs, Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Tag, Card, Typography } from 'antd'
import { UserOutlined, BookOutlined, EditOutlined, DeleteOutlined, PlusOutlined, CrownOutlined } from '@ant-design/icons'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

const { TabPane } = Tabs

type User = {
  user_id: string
  email: string
  full_name: string
  role: string
  current_level: string
  created_at: string
}

type Roadmap = {
  roadmap_id: string
  title: string
  description: string
  category: string
  image_url?: string
  modules: Array<{
    module_id: string
    title: string
    order_index: number
  }>
}

type Module = {
  module_id: string
  title: string
  description?: string
  content?: string
  order_index: number
}

const Admin: React.FC = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(false)
  const [userModalVisible, setUserModalVisible] = useState(false)
  const [roadmapModalVisible, setRoadmapModalVisible] = useState(false)
  const [moduleModalVisible, setModuleModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [currentRoadmapId, setCurrentRoadmapId] = useState<string>('')
  
  const [userForm] = Form.useForm()
  const [roadmapForm] = Form.useForm()
  const [moduleForm] = Form.useForm()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      message.error('Please login first')
      navigate('/login')
      return
    }

    try {
      const res = await api.get(`/api/auth/users/${userId}`)
      const user = res.data?.data
      if (user?.role !== 'admin') {
        message.error('Access denied. Admin role required.')
        navigate('/')
        return
      }
      loadData()
    } catch (err) {
      message.error('Failed to verify admin access')
      navigate('/')
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, roadmapsRes] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/roadmaps'),
      ])
      setUsers(usersRes.data?.data || [])
      setRoadmaps(roadmapsRes.data?.data || [])
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // User Management
  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role })
      message.success('User role updated successfully')
      loadData()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to update role')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/api/admin/users/${userId}`)
      message.success('User deleted successfully')
      loadData()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to delete user')
    }
  }

  // Roadmap Management
  const handleCreateRoadmap = async (values: any) => {
    try {
      await api.post('/api/admin/roadmaps', values)
      message.success('Roadmap created successfully')
      setRoadmapModalVisible(false)
      roadmapForm.resetFields()
      loadData()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to create roadmap')
    }
  }

  const handleUpdateRoadmap = async (values: any) => {
    if (!selectedRoadmap) return
    try {
      await api.patch(`/api/admin/roadmaps/${selectedRoadmap.roadmap_id}`, values)
      message.success('Roadmap updated successfully')
      setRoadmapModalVisible(false)
      setSelectedRoadmap(null)
      roadmapForm.resetFields()
      loadData()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to update roadmap')
    }
  }

  const handleDeleteRoadmap = async (roadmapId: string) => {
    try {
      await api.delete(`/api/admin/roadmaps/${roadmapId}`)
      message.success('Roadmap deleted successfully')
      loadData()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to delete roadmap')
    }
  }

  // Module Management
  const handleCreateModule = async (values: any) => {
    try {
      await api.post(`/api/admin/roadmaps/${currentRoadmapId}/modules`, values)
      message.success('Module created successfully')
      setModuleModalVisible(false)
      moduleForm.resetFields()
      loadData()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to create module')
    }
  }

  const handleUpdateModule = async (values: any) => {
    if (!selectedModule) return
    try {
      await api.patch(`/api/admin/modules/${selectedModule.module_id}`, values)
      message.success('Module updated successfully')
      setModuleModalVisible(false)
      setSelectedModule(null)
      moduleForm.resetFields()
      loadData()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to update module')
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    try {
      await api.delete(`/api/admin/modules/${moduleId}`)
      message.success('Module deleted successfully')
      loadData()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to delete module')
    }
  }

  const userColumns = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record: User) => (
        <Select
          value={role}
          style={{ width: 120, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}
          onChange={(value) => handleUpdateUserRole(record.user_id, value)}
          size="middle"
        >
          <Select.Option value="user">👤 User</Select.Option>
          <Select.Option value="admin">👑 Admin</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'current_level',
      key: 'current_level',
      render: (level: string) => {
        const colorMap: Record<string, string> = {
          beginner: 'green',
          intermediate: 'blue',
          advanced: 'purple'
        }
        return (
          <Tag 
            color={colorMap[level] || 'default'} 
            style={{ 
              borderRadius: 12, 
              padding: '4px 12px', 
              fontWeight: 500,
              border: 'none',
              fontSize: 13,
              fontFamily: "'Segoe UI', 'Roboto', sans-serif"
            }}
          >
            {level}
          </Tag>
        )
      },
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Popconfirm
          title="Delete this user?"
          onConfirm={() => handleDeleteUser(record.user_id)}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            style={{ 
              borderRadius: 8,
              fontFamily: "'Segoe UI', 'Roboto', sans-serif"
            }}
          />
        </Popconfirm>
      ),
    },
  ]

  const roadmapColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Difficulty',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const categoryColors: Record<string, string> = {
          'Web': '#1890ff',
          'Data': '#722ed1',
          'AI': '#eb2f96',
          'Mobile': '#52c41a',
          'Cloud': '#13c2c2',
          'Game': '#fa8c16',
          'Design': '#f759ab',
          'Security': '#fa541c'
        }
        const colorKey = Object.keys(categoryColors).find(k => category.toLowerCase().includes(k.toLowerCase()))
        const color = colorKey ? categoryColors[colorKey] : '#1890ff'
        
        return (
          <Tag 
            color={color} 
            style={{ 
              borderRadius: 12, 
              padding: '4px 12px', 
              fontWeight: 500,
              border: 'none',
              fontSize: 13,
              fontFamily: "'Segoe UI', 'Roboto', sans-serif"
            }}
          >
            {category}
          </Tag>
        )
      },
    },
    {
      title: 'Modules',
      dataIndex: 'modules',
      key: 'modules',
      render: (modules: any[]) => modules?.length || 0,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Roadmap) => (
        <Space>
          <Button
            icon={<PlusOutlined />}
            size="middle"
            onClick={() => {
              setCurrentRoadmapId(record.roadmap_id)
              setSelectedModule(null)
              moduleForm.resetFields()
              setModuleModalVisible(true)
            }}
            style={{ 
              borderRadius: 8, 
              fontWeight: 500,
              fontFamily: "'Segoe UI', 'Roboto', sans-serif"
            }}
          >
            Add Module
          </Button>
          <Button
            icon={<EditOutlined />}
            size="middle"
            onClick={() => {
              setSelectedRoadmap(record)
              roadmapForm.setFieldsValue(record)
              setRoadmapModalVisible(true)
            }}
            style={{ 
              borderRadius: 8,
              fontFamily: "'Segoe UI', 'Roboto', sans-serif"
            }}
          />
          <Popconfirm
            title="Delete this roadmap?"
            onConfirm={() => handleDeleteRoadmap(record.roadmap_id)}
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="middle" 
              style={{ 
                borderRadius: 8,
                fontFamily: "'Segoe UI', 'Roboto', sans-serif"
              }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '40px 60px', maxWidth: 1600, margin: '0 auto', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={1} style={{ 
          fontSize: 38, 
          fontWeight: 700, 
          marginBottom: 12,
          fontFamily: "'Segoe UI', 'Roboto', sans-serif",
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <CrownOutlined style={{ color: '#faad14', fontSize: 38 }} />
          Admin Panel
        </Title>
        <Typography.Paragraph style={{ fontSize: 16, color: '#666', marginBottom: 0 }}>
          Manage users, roadmaps, and modules
        </Typography.Paragraph>
      </div>
      <Card style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} bodyStyle={{ padding: '32px' }}>
        <Tabs defaultActiveKey="users" size="large">
          <TabPane 
            tab={
              <span style={{ fontSize: 15, fontWeight: 500, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
                <UserOutlined style={{ marginRight: 8 }} /> Users
              </span>
            } 
            key="users"
          >
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="user_id"
              loading={loading}
              pagination={{ pageSize: 10, showSizeChanger: true }}
              style={{ marginTop: 16 }}
            />
          </TabPane>
          
          <TabPane 
            tab={
              <span style={{ fontSize: 15, fontWeight: 500, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
                <BookOutlined style={{ marginRight: 8 }} /> Roadmaps & Modules
              </span>
            } 
            key="roadmaps"
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedRoadmap(null)
                roadmapForm.resetFields()
                setRoadmapModalVisible(true)
              }}
              size="large"
              style={{ 
                marginBottom: 24, 
                marginTop: 8,
                height: 44, 
                borderRadius: 10, 
                fontSize: 15,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
                fontFamily: "'Segoe UI', 'Roboto', sans-serif"
              }}
            >
              Create Roadmap
            </Button>
            <Table
              columns={roadmapColumns}
              dataSource={roadmaps}
              rowKey="roadmap_id"
              loading={loading}
              expandable={{
                expandedRowRender: (record) => (
                  <Table
                    size="small"
                    columns={[
                      { title: 'Order', dataIndex: 'order_index', key: 'order_index', width: 80 },
                      { title: 'Module Title', dataIndex: 'title', key: 'title' },
                      {
                        title: 'Actions',
                        key: 'actions',
                        render: (_: any, module: any) => (
                          <Space>
                            <Button
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => {
                                setSelectedModule(module)
                                moduleForm.setFieldsValue(module)
                                setModuleModalVisible(true)
                              }}
                            />
                            <Popconfirm
                              title="Delete this module?"
                              onConfirm={() => handleDeleteModule(module.module_id)}
                            >
                              <Button danger size="small" icon={<DeleteOutlined />} />
                            </Popconfirm>
                          </Space>
                        ),
                      },
                    ]}
                    dataSource={record.modules}
                    rowKey="module_id"
                    pagination={false}
                  />
                ),
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Roadmap Modal */}
      <Modal
        title={
          <div style={{ fontSize: 20, fontWeight: 600, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
            {selectedRoadmap ? '✏️ Edit Roadmap' : '➕ Create Roadmap'}
          </div>
        }
        open={roadmapModalVisible}
        onCancel={() => {
          setRoadmapModalVisible(false)
          setSelectedRoadmap(null)
          roadmapForm.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={roadmapForm}
          layout="vertical"
          onFinish={selectedRoadmap ? handleUpdateRoadmap : handleCreateRoadmap}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input size="large" style={{ borderRadius: 8, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }} />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} style={{ borderRadius: 8, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }} />
          </Form.Item>
          <Form.Item name="image_url" label="Image URL">
            <Input size="large" style={{ borderRadius: 8, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }} />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select size="large" style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
              <Select.Option value="Web">🌐 Web</Select.Option>
              <Select.Option value="Data">📊 Data</Select.Option>
              <Select.Option value="Mobile">📱 Mobile</Select.Option>
              <Select.Option value="AI">🤖 AI</Select.Option>
              <Select.Option value="Cloud">☁️ Cloud</Select.Option>
              <Select.Option value="Game">🎮 Game</Select.Option>
              <Select.Option value="Design">🎨 Design</Select.Option>
              <Select.Option value="Security">🔒 Security</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setRoadmapModalVisible(false)}
                size="large"
                style={{ 
                  borderRadius: 8, 
                  height: 44,
                  fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                size="large"
                style={{ 
                  borderRadius: 8, 
                  height: 44, 
                  fontWeight: 600,
                  fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                }}
              >
                {selectedRoadmap ? '✅ Update' : '➕ Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Module Modal */}
      <Modal
        title={
          <div style={{ fontSize: 20, fontWeight: 600, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
            {selectedModule ? '✏️ Edit Module' : '➕ Create Module'}
          </div>
        }
        open={moduleModalVisible}
        onCancel={() => {
          setModuleModalVisible(false)
          setSelectedModule(null)
          moduleForm.resetFields()
        }}
        footer={null}
        width={800}
      >
        <Form
          form={moduleForm}
          layout="vertical"
          onFinish={selectedModule ? handleUpdateModule : handleCreateModule}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input size="large" style={{ borderRadius: 8, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} style={{ borderRadius: 8, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }} />
          </Form.Item>
          <Form.Item name="content" label="Content">
            <Input.TextArea rows={6} style={{ borderRadius: 8, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }} />
          </Form.Item>
          <Form.Item name="order_index" label="Order" rules={[{ required: true }]}>
            <Input type="number" size="large" style={{ borderRadius: 8, fontFamily: "'Segoe UI', 'Roboto', sans-serif" }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setModuleModalVisible(false)}
                size="large"
                style={{ 
                  borderRadius: 8, 
                  height: 44,
                  fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                size="large"
                style={{ 
                  borderRadius: 8, 
                  height: 44, 
                  fontWeight: 600,
                  fontFamily: "'Segoe UI', 'Roboto', sans-serif"
                }}
              >
                {selectedModule ? '✅ Update' : '➕ Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Admin
