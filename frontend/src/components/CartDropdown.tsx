import React, { useState, useEffect } from 'react'
import { Badge, Dropdown, List, Button, Typography, Empty, message, Popconfirm } from 'antd'
import { ShoppingCartOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const { Text, Title } = Typography

type EnrolledCourse = {
  enrollment_id: string
  roadmap_id: string
  enrolled_at: string
  roadmap?: {
    roadmap_id: string
    title: string
    description?: string
    category?: string
  }
}

const CartDropdown: React.FC = () => {
  const navigate = useNavigate()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (dropdownOpen) {
      loadEnrolledCourses()
    }
  }, [dropdownOpen])

  useEffect(() => {
    // Listen for course enrollment events
    const handleCourseEnrolled = () => {
      loadEnrolledCourses()
    }
    window.addEventListener('courseEnrolled', handleCourseEnrolled)
    return () => window.removeEventListener('courseEnrolled', handleCourseEnrolled)
  }, [])

  const loadEnrolledCourses = async () => {
    setLoading(true)
    try {
      const userId = localStorage.getItem('user_id')
      if (!userId) {
        setEnrolledCourses([])
        return
      }

      // Get user progress which includes enrolled roadmaps
      const res = await api.get(`/api/progress/user/${userId}`)
      const progressData = res.data?.data || res.data || []
      
      // Get all roadmaps to get full details
      const roadmapsRes = await api.get('/api/roadmaps')
      const allRoadmaps = roadmapsRes.data?.data || roadmapsRes.data || []
      
      // Create enrollment objects from progress data
      const enrollments = progressData.map((progress: any) => {
        const roadmap = allRoadmaps.find((r: any) => r.roadmap_id === progress.roadmap_id)
        return {
          enrollment_id: progress.enrollment_id || progress.roadmap_id,
          roadmap_id: progress.roadmap_id,
          enrolled_at: progress.last_accessed_at || new Date().toISOString(),
          roadmap: roadmap
        }
      })
      
      setEnrolledCourses(enrollments)
    } catch (err: any) {
      console.error('Failed to load enrolled courses:', err)
      setEnrolledCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handleUnenroll = async (enrollmentId: string) => {
    try {
      await api.delete(`/api/roadmaps/enrollments/${enrollmentId}`)
      message.success('Course removed from your list')
      loadEnrolledCourses()
    } catch (err) {
      message.error('Failed to remove course')
    }
  }

  const handleViewCourse = (roadmapId: string) => {
    setDropdownOpen(false)
    navigate(`/roadmaps/${roadmapId}/modules/1`)
  }

  const dropdownContent = (
    <div style={{ 
      width: 380, 
      maxHeight: 500, 
      overflowY: 'auto',
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0',
        background: '#fafafa'
      }}>
        <Title level={5} style={{ margin: 0, fontSize: 16 }}>
          📚 My Enrolled Courses
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''}
        </Text>
      </div>

      {loading ? (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Text>Loading...</Text>
        </div>
      ) : enrolledCourses.length > 0 ? (
        <List
          dataSource={enrolledCourses}
          renderItem={(enrollment) => (
            <List.Item
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'flex-start'
              }}
              actions={[
                <Popconfirm
                  title="Remove course?"
                  description="Are you sure you want to remove this course from your list?"
                  onConfirm={() => handleUnenroll(enrollment.enrollment_id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button 
                    type="text" 
                    danger 
                    size="small"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={<BookOutlined style={{ fontSize: 20, color: '#a435f0' }} />}
                title={
                  <Text 
                    strong 
                    style={{ 
                      fontSize: 14,
                      cursor: 'pointer',
                      color: '#1890ff'
                    }}
                    onClick={() => handleViewCourse(enrollment.roadmap_id)}
                  >
                    {enrollment.roadmap?.title || 'Course'}
                  </Text>
                }
                description={
                  <div>
                    <Text ellipsis style={{ fontSize: 12, color: '#666' }}>
                      {enrollment.roadmap?.description || ''}
                    </Text>
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </Text>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <div style={{ padding: 24 }}>
          <Empty 
            description="No enrolled courses yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button 
              type="primary" 
              onClick={() => {
                setDropdownOpen(false)
                navigate('/courses')
              }}
            >
              Browse Courses
            </Button>
          </Empty>
        </div>
      )}

      {enrolledCourses.length > 0 && (
        <div style={{ 
          padding: '12px 16px', 
          borderTop: '1px solid #f0f0f0',
          background: '#fafafa'
        }}>
          <Button 
            type="primary" 
            block
            onClick={() => {
              setDropdownOpen(false)
              navigate('/progress')
            }}
          >
            View All Progress
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <Dropdown
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      placement="bottomRight"
    >
      <Badge count={enrolledCourses.length} offset={[-5, 5]}>
        <Button 
          type="text" 
          icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
          style={{ padding: '4px 8px' }}
        />
      </Badge>
    </Dropdown>
  )
}

export default CartDropdown
