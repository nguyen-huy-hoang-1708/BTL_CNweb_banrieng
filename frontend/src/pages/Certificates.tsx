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
    <div style={{ padding: '40px 80px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <TrophyOutlined style={{ fontSize: 64, color: '#faad14', marginBottom: 16 }} />
        <Title level={1} style={{ fontSize: 42, fontWeight: 700, marginBottom: 16 }}>
          My Certificates
        </Title>
        <Paragraph style={{ fontSize: 18, color: '#666' }}>
          Your achievements and completed learning paths
        </Paragraph>
      </div>

      {items.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div style={{ fontSize: 16, color: '#666' }}>
              No certificates earned yet.<br />
              Complete roadmaps to earn certificates!
            </div>
          }
          style={{ padding: '80px 0' }}
        />
      ) : (
        <Row gutter={[32, 32]}>
          {items.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.certificate_id}>
              <Card
                hoverable
                style={{ 
                  background: 'white',
                  border: '2px solid #f0f0f0',
                  borderRadius: 16,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(102,126,234,0.25)'
                  e.currentTarget.style.borderColor = '#667eea'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                  e.currentTarget.style.borderColor = '#f0f0f0'
                }}
                bodyStyle={{ padding: 32, textAlign: 'center' }}
              >
                <Space direction="vertical" align="center" style={{ width: '100%' }} size="large">
                  <div style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}>
                    <TrophyOutlined style={{ fontSize: 56, color: '#ffd700' }} />
                  </div>
                  <Title level={3} style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#333', textAlign: 'center' }}>
                    {item.certificate_name}
                  </Title>
                  <Text style={{ fontSize: 15, color: '#666' }}>
                    📅 Issued: {new Date(item.issue_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Text>
                  {item.pdf_url ? (
                    <Button 
                      type="primary" 
                      icon={<DownloadOutlined />} 
                      href={item.pdf_url} 
                      target="_blank"
                      size="large"
                      block
                      style={{ 
                        height: 44, 
                        fontSize: 16, 
                        fontWeight: 600, 
                        borderRadius: 8,
                        marginTop: 8
                      }}
                    >
                      Download Certificate
                    </Button>
                  ) : (
                    <Button 
                      disabled 
                      block
                      size="large"
                      style={{ 
                        height: 44, 
                        fontSize: 16, 
                        borderRadius: 8,
                        marginTop: 8
                      }}
                    >
                      Not Available
                    </Button>
                  )}
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
