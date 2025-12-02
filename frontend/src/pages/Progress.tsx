import React, { useEffect, useState } from 'react'
import { List, Card, Progress, Spin, Alert, Empty, Typography } from 'antd'
import api from '../services/api'

const { Title, Text } = Typography

type ModuleWithProgress = {
  module_id: string
  title: string
  roadmap_title: string
  status: string
  completion_percentage: number
}

const ProgressPage: React.FC = () => {
  const [items, setItems] = useState<ModuleWithProgress[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      setError('Please login to view your progress')
      return
    }

    // Fetch roadmaps and show modules (progress tracking coming soon)
    setLoading(true)
    api
      .get('/api/roadmaps')
      .then(async (res) => {
        const roadmaps = res.data?.data || res.data || []
        const modulesWithProgress: ModuleWithProgress[] = []
        
        // Get first 3 roadmaps
        for (const roadmap of roadmaps.slice(0, 3)) {
          try {
            const roadmapRes = await api.get(`/api/roadmaps/${roadmap.roadmap_id}`)
            const modules = roadmapRes.data?.data?.modules || []
            
            // Show first 3 modules of each roadmap with placeholder progress
            for (const module of modules.slice(0, 3)) {
              modulesWithProgress.push({
                module_id: module.module_id,
                title: module.title,
                roadmap_title: roadmap.title,
                status: 'not_started',
                completion_percentage: 0
              })
            }
          } catch (err) {
            console.error('Error fetching roadmap:', err)
          }
        }
        
        setItems(modulesWithProgress)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load modules')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spin style={{ display: 'block', margin: '48px auto' }} />
  if (error) return <Alert type="warning" message={error} showIcon style={{ margin: '24px' }} />

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>📊 My Learning Progress</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Track your progress across different courses and modules
      </Text>
      
      {items.length === 0 ? (
        <Empty description="No modules found. Start learning to track your progress!" />
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3 }}
          dataSource={items}
          renderItem={(item) => (
            <List.Item>
              <Card 
                title={item.title}
                extra={<Text type="secondary">{item.roadmap_title}</Text>}
              >
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Status: </Text>
                  <Text type={item.status === 'completed' ? 'success' : 'secondary'}>
                    {item.status}
                  </Text>
                </div>
                <Progress 
                  percent={Number(item.completion_percentage)} 
                  status={item.completion_percentage === 100 ? 'success' : 'active'}
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  )
}

export default ProgressPage
