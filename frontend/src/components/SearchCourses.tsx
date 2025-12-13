import React, { useState, useEffect } from 'react'
import { Input, Dropdown, List, Typography, Tag, Spin, Empty } from 'antd'
import { SearchOutlined, BookOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const { Text } = Typography

type Course = {
  roadmap_id: string
  title: string
  description?: string
  category?: string
}

const SearchCourses: React.FC = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    if (searchText.trim()) {
      const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(searchText.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchText.toLowerCase())
      )
      setFilteredCourses(filtered)
      setDropdownOpen(true)
    } else {
      setFilteredCourses([])
      setDropdownOpen(false)
    }
  }, [searchText, courses])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/roadmaps')
      const data = res.data?.data || res.data || []
      setCourses(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCourseClick = (courseId: string) => {
    setSearchText('')
    setDropdownOpen(false)
    navigate(`/courses`)
    // Có thể thêm scroll to course hoặc highlight course
  }

  const dropdownContent = (
    <div style={{ 
      width: 750, 
      maxHeight: 400, 
      overflowY: 'auto',
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      {loading ? (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Spin />
        </div>
      ) : filteredCourses.length > 0 ? (
        <List
          dataSource={filteredCourses}
          renderItem={(course) => (
            <List.Item
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              onClick={() => handleCourseClick(course.roadmap_id)}
            >
              <List.Item.Meta
                avatar={<BookOutlined style={{ fontSize: 24, color: '#a435f0' }} />}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text strong style={{ fontSize: 14 }}>{course.title}</Text>
                    {course.category && (
                      <Tag color="blue" style={{ fontSize: 11 }}>{course.category}</Tag>
                    )}
                  </div>
                }
                description={
                  <Text ellipsis style={{ fontSize: 13, color: '#666' }}>
                    {course.description || 'Comprehensive online course'}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <div style={{ padding: 24 }}>
          <Empty 
            description={`No courses found for "${searchText}"`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
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
      placement="bottomLeft"
    >
      <Input
        placeholder="Search for anything"
        prefix={<SearchOutlined style={{ color: '#6a6f73', fontSize: 16 }} />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => searchText && setDropdownOpen(true)}
        style={{
          flex: 1,
          maxWidth: 750,
          height: 48,
          borderRadius: 50,
          fontSize: 14,
          border: '1px solid #1c1d1f',
          fontFamily: "'Segoe UI', 'Roboto', sans-serif"
        }}
      />
    </Dropdown>
  )
}

export default SearchCourses
