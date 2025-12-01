import React, { useEffect, useState } from 'react'
import { List, Card, Progress, Spin, Alert, Empty } from 'antd'
import api from '../services/api'

type UserProgress = {
  progress_id: string
  module_id: string
  status: string
  completion_percentage: number
}

const ProgressPage: React.FC = () => {
  const [items, setItems] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch all modules with progress from the backend
    setLoading(true)
    api
      .get('/api/roadmaps')
      .then(async (res) => {
        const roadmaps = res.data?.data || res.data || []
        const allProgress: UserProgress[] = []
        
        // For each roadmap, try to fetch progress for its modules
        for (const roadmap of roadmaps.slice(0, 3)) {
          try {
            // Get roadmap details which includes modules
            const roadmapRes = await api.get(`/api/roadmaps/${roadmap.roadmap_id}`)
            const modules = roadmapRes.data?.data?.modules || []
            
            // Fetch progress for each module
            for (const module of modules.slice(0, 2)) {
              try {
                const progressRes = await api.get(`/api/progress/modules/${module.module_id}/progress`)
                const progress = progressRes.data?.data
                if (progress) {
                  allProgress.push(progress)
                }
              } catch (err) {
                // Module might not have progress yet, skip it
              }
            }
          } catch (err) {
            // Skip roadmap if error
          }
        }
        
        setItems(allProgress)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load progress')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spin style={{ display: 'block', margin: '48px auto' }} />
  if (error) return <Alert type="warning" message={error} showIcon style={{ marginBottom: 16 }} />

  return (
    <div>
      {items.length === 0 ? (
        <Empty description="No progress data available" />
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={items}
          renderItem={(item) => (
            <List.Item>
              <Card title={`Module: ${item.module_id}`}>
                <p>Status: {item.status}</p>
                <Progress percent={Number(item.completion_percentage)} />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  )
}

export default ProgressPage
