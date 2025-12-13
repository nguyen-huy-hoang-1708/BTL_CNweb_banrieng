import React, { useEffect, useState } from 'react'
import { Button, Spin, Alert, Typography } from 'antd'
import { DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

const { Title, Text } = Typography

type Certificate = {
  certificate_id: string
  certificate_name: string
  issued_date: string
  roadmap_title?: string
  user_name?: string
  organization?: string
}

const CertificateDetail: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>()
  const navigate = useNavigate()
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      setError('Please login to view certificate')
      setLoading(false)
      return
    }

    // Fetch user and certificate data
    Promise.all([
      api.get(`/api/auth/users/${userId}`),
      api.get(`/api/certificates/${certificateId}`).catch(() => null)
    ])
      .then(([userRes, certRes]) => {
        const userData = userRes.data?.data || userRes.data
        setUser(userData)
        
        if (certRes) {
          const certData = certRes.data?.data || certRes.data
          setCertificate({
            ...certData,
            user_name: userData.full_name,
            organization: 'SkillSync Learning Platform'
          })
        } else {
          // Dữ liệu mẫu nếu không tìm thấy
          setCertificate({
            certificate_id: certificateId || '1',
            certificate_name: 'Hoàn Thành Khóa Học',
            issued_date: new Date().toISOString(),
            roadmap_title: 'Kỹ năng thiết kế và giao tiếp với khách hàng',
            user_name: userData.full_name,
            organization: 'SkillSync Learning Platform'
          })
        }
      })
      .catch((err) => {
        console.error(err)
        setError('Failed to load certificate')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [certificateId])

  const handleDownload = () => {
    // Trigger print dialog for PDF download
    window.print()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error || !certificate) {
    return (
      <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
        <Alert type="error" message={error || 'Certificate not found'} showIcon />
        <Button 
          type="primary" 
          onClick={() => navigate('/certificates')}
          style={{ marginTop: 16 }}
        >
          Quay lại
        </Button>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '40px 20px' }}>
      {/* Action Buttons */}
      <div className="no-print" style={{ maxWidth: 1200, margin: '0 auto 24px', display: 'flex', gap: 12 }}>
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/certificates')}
          size="large"
        >
          Quay lại
        </Button>
        <Button 
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          size="large"
        >
          Tải xuống PDF
        </Button>
      </div>

      {/* Certificate */}
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto',
        background: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {/* Certificate Content */}
        <div style={{
          position: 'relative',
          padding: '80px 100px',
          background: 'linear-gradient(135deg, #fff9f0 0%, #ffffff 100%)',
          border: '16px solid transparent',
          borderImage: 'linear-gradient(135deg, #d4a574 0%, #f4e4c1 50%, #d4a574 100%) 1',
          minHeight: 700
        }}>
          {/* Decorative corners */}
          <div style={{
            position: 'absolute',
            top: 30,
            left: 30,
            width: 60,
            height: 60,
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cpath d=\'M0,0 Q30,0 50,20 Q70,0 100,0 L100,100 Q70,70 50,50 Q30,70 0,100 Z\' fill=\'%23d4a574\' opacity=\'0.3\'/%3E%3C/svg%3E")',
            backgroundSize: 'contain'
          }} />
          <div style={{
            position: 'absolute',
            top: 30,
            right: 30,
            width: 60,
            height: 60,
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cpath d=\'M0,0 Q30,0 50,20 Q70,0 100,0 L100,100 Q70,70 50,50 Q30,70 0,100 Z\' fill=\'%23d4a574\' opacity=\'0.3\'/%3E%3C/svg%3E")',
            backgroundSize: 'contain',
            transform: 'rotate(90deg)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: 30,
            left: 30,
            width: 60,
            height: 60,
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cpath d=\'M0,0 Q30,0 50,20 Q70,0 100,0 L100,100 Q70,70 50,50 Q30,70 0,100 Z\' fill=\'%23d4a574\' opacity=\'0.3\'/%3E%3C/svg%3E")',
            backgroundSize: 'contain',
            transform: 'rotate(-90deg)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: 30,
            right: 30,
            width: 60,
            height: 60,
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cpath d=\'M0,0 Q30,0 50,20 Q70,0 100,0 L100,100 Q70,70 50,50 Q30,70 0,100 Z\' fill=\'%23d4a574\' opacity=\'0.3\'/%3E%3C/svg%3E")',
            backgroundSize: 'contain',
            transform: 'rotate(180deg)'
          }} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Title level={1} style={{ 
              fontSize: 52,
              fontWeight: 800,
              color: '#d4a574',
              marginBottom: 24,
              letterSpacing: 4,
              textTransform: 'uppercase',
              fontFamily: "'Playfair Display', serif"
            }}>
              Giấy Chứng Nhận
            </Title>
            
            <div style={{
              display: 'inline-block',
              padding: '12px 40px',
              background: 'linear-gradient(135deg, #d4a574 0%, #f4e4c1 100%)',
              borderRadius: 50,
              marginBottom: 12
            }}>
              <Text style={{ 
                fontSize: 20,
                fontWeight: 700,
                color: 'white',
                letterSpacing: 2,
                textTransform: 'uppercase'
              }}>
                Hoàn Thành Khóa Học
              </Text>
            </div>
            
            <div>
              <Text style={{ 
                fontSize: 16,
                color: '#999',
                letterSpacing: 3,
                textTransform: 'uppercase'
              }}>
                Certificate of Achievement
              </Text>
            </div>
          </div>

          {/* Recipient */}
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <Text style={{ 
              display: 'block',
              fontSize: 16,
              color: '#666',
              marginBottom: 16,
              letterSpacing: 1
            }}>
              CẤP CHO ÔNG/BÀ
            </Text>
            <Text style={{ 
              display: 'block',
              fontSize: 16,
              color: '#999',
              marginBottom: 20,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}>
              CERTIFIES FOR MR./MRS
            </Text>
            
            <Title level={2} style={{ 
              fontSize: 48,
              fontWeight: 700,
              color: '#d4a574',
              marginBottom: 0,
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic'
            }}>
              {certificate.user_name}
            </Title>
          </div>

          {/* Details */}
          <div style={{ 
            maxWidth: 700,
            margin: '0 auto 50px',
            paddingLeft: 40
          }}>
            <div style={{ marginBottom: 24 }}>
              <Text style={{ 
                display: 'block',
                fontSize: 15,
                color: '#666',
                marginBottom: 6,
                fontWeight: 600
              }}>
                ĐƠN VỊ:
              </Text>
              <Text style={{ 
                display: 'block',
                fontSize: 15,
                color: '#999',
                marginBottom: 12
              }}>
                ORGANIZATION
              </Text>
              <Text style={{ 
                fontSize: 18,
                color: '#1a1a1a',
                fontWeight: 600
              }}>
                {certificate.organization?.toUpperCase()}
              </Text>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text style={{ 
                display: 'block',
                fontSize: 15,
                color: '#666',
                marginBottom: 6,
                fontWeight: 600
              }}>
                ĐÃ HOÀN THÀNH KHÓA HỌC:
              </Text>
              <Text style={{ 
                display: 'block',
                fontSize: 15,
                color: '#999',
                marginBottom: 12
              }}>
                ACCOMPLISHED THE COURSE OF
              </Text>
              <Text style={{ 
                fontSize: 18,
                color: '#1a1a1a',
                fontWeight: 600
              }}>
                {certificate.roadmap_title?.toUpperCase()}
              </Text>
            </div>

            <div>
              <Text style={{ 
                display: 'block',
                fontSize: 15,
                color: '#666',
                marginBottom: 6,
                fontWeight: 600
              }}>
                THỜI GIAN ĐÀO TẠO:
              </Text>
              <Text style={{ 
                display: 'block',
                fontSize: 15,
                color: '#999',
                marginBottom: 12
              }}>
                TRAINING TIME
              </Text>
              <Text style={{ 
                fontSize: 18,
                color: '#1a1a1a',
                fontWeight: 600
              }}>
                {formatDate(certificate.issued_date)}
              </Text>
            </div>
          </div>

          {/* Footer with signature */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 60
          }}>
            <div>
              <Text style={{ 
                display: 'block',
                fontSize: 14,
                color: '#666',
                marginBottom: 4
              }}>
                CHỨNG NHẬN SỐ {certificate.certificate_id.toUpperCase()}
              </Text>
              <Text style={{ 
                fontSize: 12,
                color: '#999'
              }}>
                ISSUE NUMBER
              </Text>
            </div>

            <div style={{ textAlign: 'right' }}>
              <Text style={{ 
                display: 'block',
                fontSize: 14,
                color: '#666',
                marginBottom: 8
              }}>
                TP.HCM, Ngày {formatDate(certificate.issued_date)}
              </Text>
              <Text style={{ 
                display: 'block',
                fontSize: 15,
                color: '#666',
                marginBottom: 16,
                fontWeight: 600
              }}>
                VIỆN PHÁT TRIỂN THIẾT KẾ
              </Text>
              <Text style={{ 
                display: 'block',
                fontSize: 13,
                color: '#999',
                marginBottom: 20
              }}>
                INSTITUTE OF DESIGN DEVELOPMENT
              </Text>
              
              {/* Signature */}
              <div style={{
                fontSize: 36,
                color: '#1890ff',
                fontFamily: "'Brush Script MT', cursive",
                marginBottom: 8
              }}>
                Admin
              </div>
              
              <Text style={{ 
                display: 'block',
                fontSize: 16,
                color: '#1a1a1a',
                fontWeight: 700,
                letterSpacing: 2
              }}>
                GIÁM ĐỐC
              </Text>
              <Text style={{ 
                fontSize: 12,
                color: '#999',
                textTransform: 'uppercase'
              }}>
                President
              </Text>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div style={{
          padding: '20px',
          background: 'linear-gradient(90deg, #d4a574 0%, #f4e4c1 50%, #d4a574 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 40
        }}>
          <Text style={{ color: 'white', fontSize: 13, opacity: 0.9 }}>
            🎓 SkillSync Learning Platform
          </Text>
          <Text style={{ color: 'white', fontSize: 13, opacity: 0.9 }}>
            📧 contact@skillsync.edu.vn
          </Text>
          <Text style={{ color: 'white', fontSize: 13, opacity: 0.9 }}>
            🌐 www.skillsync.edu.vn
          </Text>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default CertificateDetail
