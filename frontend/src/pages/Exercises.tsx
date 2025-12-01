import React, { useEffect, useState } from 'react'
import { List, Card, Tag, Spin, Alert, Select, Empty } from 'antd'
import api from '../services/api'

type Exercise = {
  exercise_id: string
  title: string
  description: string
  difficulty?: string
  module_id?: string
}

const Exercises: React.FC = () => {
  const [items, setItems] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [moduleId, setModuleId] = useState<string>('')

  const fetchExercises = async (mid?: string) => {
    setLoading(true)
    setError(null)
    try {
      const url = mid ? `/api/exercises?moduleId=${mid}` : '/api/exercises'
      const res = await api.get(url)
      const data = res.data?.data || res.data || []
      setItems(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load exercises')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExercises()
  }, [])

  if (loading) return <Spin style={{ display: 'block', margin: '48px auto' }} />
  if (error) return <Alert type="error" message={error} showIcon />

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filter by module"
          style={{ width: 200 }}
          onChange={(val) => {
            setModuleId(val)
            fetchExercises(val)
          }}
          allowClear
        >
          <Select.Option value="module1">Module 1</Select.Option>
          <Select.Option value="module2">Module 2</Select.Option>
        </Select>
      </div>
      {items.length === 0 ? (
        <Empty description="No exercises available" />
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={items}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={item.title}
                extra={<Tag color="blue">{item.difficulty || 'medium'}</Tag>}
              >
                <p>{item.description}</p>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  )
}

export default Exercises
