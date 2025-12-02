import React, { useEffect, useState } from 'react'
import { Tabs, Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Tag, Card } from 'antd'
import { UserOutlined, BookOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

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
          style={{ width: 100 }}
          onChange={(value) => handleUpdateUserRole(record.user_id, value)}
        >
          <Select.Option value="user">User</Select.Option>
          <Select.Option value="admin">Admin</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'current_level',
      key: 'current_level',
      render: (level: string) => <Tag color="blue">{level}</Tag>,
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
          <Button type="text" danger icon={<DeleteOutlined />} />
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
      render: (category: string) => <Tag color="blue">{category}</Tag>,
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
            size="small"
            onClick={() => {
              setCurrentRoadmapId(record.roadmap_id)
              setSelectedModule(null)
              moduleForm.resetFields()
              setModuleModalVisible(true)
            }}
          >
            Add Module
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setSelectedRoadmap(record)
              roadmapForm.setFieldsValue(record)
              setRoadmapModalVisible(true)
            }}
          />
          <Popconfirm
            title="Delete this roadmap?"
            onConfirm={() => handleDeleteRoadmap(record.roadmap_id)}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      <Card>
        <h1>🔐 Admin Panel</h1>
        <Tabs defaultActiveKey="users">
          <TabPane tab={<span><UserOutlined /> Users</span>} key="users">
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="user_id"
              loading={loading}
            />
          </TabPane>
          
          <TabPane tab={<span><BookOutlined /> Roadmaps & Modules</span>} key="roadmaps">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedRoadmap(null)
                roadmapForm.resetFields()
                setRoadmapModalVisible(true)
              }}
              style={{ marginBottom: 16 }}
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
        title={selectedRoadmap ? 'Edit Roadmap' : 'Create Roadmap'}
        open={roadmapModalVisible}
        onCancel={() => {
          setRoadmapModalVisible(false)
          setSelectedRoadmap(null)
          roadmapForm.resetFields()
        }}
        footer={null}
      >
        <Form
          form={roadmapForm}
          layout="vertical"
          onFinish={selectedRoadmap ? handleUpdateRoadmap : handleCreateRoadmap}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="image_url" label="Image URL">
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="frontend">Frontend</Select.Option>
              <Select.Option value="backend">Backend</Select.Option>
              <Select.Option value="mobile">Mobile</Select.Option>
              <Select.Option value="data_science">Data Science</Select.Option>
              <Select.Option value="devops">DevOps</Select.Option>
              <Select.Option value="ai">AI/ML</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setRoadmapModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {selectedRoadmap ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Module Modal */}
      <Modal
        title={selectedModule ? 'Edit Module' : 'Create Module'}
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
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="content" label="Content">
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item name="order_index" label="Order" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModuleModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {selectedModule ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Admin
