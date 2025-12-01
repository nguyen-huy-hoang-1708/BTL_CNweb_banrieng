import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Spin, Alert, Empty, Typography, Space } from 'antd'
import { TrophyOutlined, DownloadOutlined } from '@ant-design/icons'
import api from '../services/api'

const { Title, Paragraph, Text } = Typography

type Certificate = {
  certificate_id: string
  certificate_name: string
  issue_date: string
  pdf_url?: string
  roadmap_id?: string
}

const Certificates: React.FC = () => {
  const [items, setItems] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCertificates()
  }, [])

  const loadCertificates = () => {
    setLoading(true)
    api
      .get('/api/certificates')
      .then((res) => {
        const data = res.data?.data || res.data || []
        setItems(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load certificates')
        setItems([])
      })
      .finally(() => setLoading(false))
  }

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '48px auto' }} />
  if (error) return <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>My Certificates</Title>
        <Paragraph>Your achievements and completed learning paths</Paragraph>
      </div>

      {items.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No certificates earned yet. Complete roadmaps to earn certificates!"
        />
      ) : (
        <Row gutter={[16, 16]}>
          {items.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.certificate_id}>
              <Card
                hoverable
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}
                actions={[
                  item.pdf_url ? (
                    <Button 
                      type="link" 
                      icon={<DownloadOutlined />} 
                      href={item.pdf_url} 
                      target="_blank"
                      style={{ color: 'white' }}
                    >
                      Download
                    </Button>
                  ) : (
                    <Button type="link" disabled style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Not Available
                    </Button>
                  ),
                ]}
              >
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                  <TrophyOutlined style={{ fontSize: 48, color: '#ffd700' }} />
                  <Title level={4} style={{ color: 'white', margin: 0 }}>
                    {item.certificate_name}
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Issued: {new Date(item.issue_date).toLocaleDateString()}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default Certificates
