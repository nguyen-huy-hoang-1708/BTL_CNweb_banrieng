import React, { useEffect, useState } from 'react'
import { Button, Spin, Alert, Typography, Space, Divider } from 'antd'
import { DownloadOutlined, ArrowLeftOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GithubOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

const { Title, Text, Paragraph } = Typography

type CV = {
  cv_id: string
  cv_name: string
  created_at: string
  template_style?: string
  personal_info?: any
  skills?: string
  experience?: string
  education?: string
  user_name?: string
}

const CVDetail: React.FC = () => {
  const { cvId } = useParams<{ cvId: string }>()
  const navigate = useNavigate()
  const [cv, setCV] = useState<CV | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      setError('Please login to view CV')
      setLoading(false)
      return
    }

    Promise.all([
      api.get(`/api/auth/users/${userId}`),
      api.get(`/api/cvs/${cvId}`).catch(() => null)
    ])
      .then(([userRes, cvRes]) => {
        const userData = userRes.data?.data || userRes.data
        setUser(userData)
        
        if (cvRes) {
          const cvData = cvRes.data?.data || cvRes.data
          setCV({
            ...cvData,
            user_name: userData.full_name
          })
        } else {
          // Dữ liệu mẫu
          setCV({
            cv_id: cvId || '1',
            cv_name: 'Frontend Developer CV',
            created_at: new Date().toISOString(),
            template_style: 'Modern Professional',
            user_name: userData.full_name,
            personal_info: {
              email: userData.email,
              phone: '+84 123 456 789',
              location: 'Ho Chi Minh City, Vietnam',
              linkedin: 'linkedin.com/in/yourprofile',
              github: 'github.com/yourprofile',
              summary: 'Passionate Frontend Developer with 3+ years of experience in building responsive and user-friendly web applications using React, TypeScript, and modern web technologies. Strong focus on clean code, performance optimization, and delivering exceptional user experiences.'
            },
            skills: 'React.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Ant Design, Redux, React Router, Git, RESTful APIs, Responsive Design, Performance Optimization',
            experience: JSON.stringify([
              {
                title: 'Senior Frontend Developer',
                company: 'Tech Solutions Inc.',
                period: '2022 - Present',
                responsibilities: [
                  'Led development of customer-facing web applications using React and TypeScript',
                  'Improved application performance by 40% through code optimization',
                  'Mentored junior developers and conducted code reviews',
                  'Collaborated with UX designers to implement pixel-perfect interfaces'
                ]
              },
              {
                title: 'Frontend Developer',
                company: 'Digital Agency Co.',
                period: '2020 - 2022',
                responsibilities: [
                  'Developed responsive web applications for various clients',
                  'Implemented reusable component libraries',
                  'Integrated RESTful APIs and handled state management with Redux',
                  'Participated in agile development processes'
                ]
              }
            ]),
            education: JSON.stringify([
              {
                degree: 'Bachelor of Computer Science',
                school: 'University of Technology',
                period: '2016 - 2020',
                description: 'Focus on Software Engineering and Web Development'
              }
            ])
          })
        }
      })
      .catch((err) => {
        console.error(err)
        setError('Failed to load CV')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [cvId])

  const handleDownload = () => {
    window.print()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error || !cv) {
    return (
      <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
        <Alert type="error" message={error || 'CV not found'} showIcon />
        <Button 
          type="primary" 
          onClick={() => navigate('/cvs')}
          style={{ marginTop: 16 }}
        >
          Quay lại
        </Button>
      </div>
    )
  }

  const parseExperience = () => {
    try {
      return JSON.parse(cv.experience || '[]')
    } catch {
      return []
    }
  }

  const parseEducation = () => {
    try {
      return JSON.parse(cv.education || '[]')
    } catch {
      return []
    }
  }

  const personalInfo = cv.personal_info || {}
  const experiences = parseExperience()
  const education = parseEducation()

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '40px 20px' }}>
      {/* Action Buttons */}
      <div className="no-print" style={{ maxWidth: 900, margin: '0 auto 24px', display: 'flex', gap: 12 }}>
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/cvs')}
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

      {/* CV Content */}
      <div style={{ 
        maxWidth: 900, 
        margin: '0 auto',
        background: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ padding: '48px 60px' }}>
          {/* Header - Name & Contact */}
          <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '3px solid #1890ff' }}>
            <Title level={1} style={{ 
              fontSize: 42,
              fontWeight: 800,
              marginBottom: 8,
              color: '#1890ff'
            }}>
              {cv.user_name}
            </Title>
            <Text style={{ 
              fontSize: 18,
              color: '#666',
              fontWeight: 500
            }}>
              {cv.template_style || 'Frontend Developer'}
            </Text>
            
            <div style={{ marginTop: 16 }}>
              <Space size={24} wrap style={{ justifyContent: 'center' }}>
                {personalInfo.email && (
                  <Space size={6}>
                    <MailOutlined style={{ color: '#1890ff' }} />
                    <Text style={{ fontSize: 14 }}>{personalInfo.email}</Text>
                  </Space>
                )}
                {personalInfo.phone && (
                  <Space size={6}>
                    <PhoneOutlined style={{ color: '#1890ff' }} />
                    <Text style={{ fontSize: 14 }}>{personalInfo.phone}</Text>
                  </Space>
                )}
                {personalInfo.location && (
                  <Space size={6}>
                    <EnvironmentOutlined style={{ color: '#1890ff' }} />
                    <Text style={{ fontSize: 14 }}>{personalInfo.location}</Text>
                  </Space>
                )}
              </Space>
            </div>
            
            {(personalInfo.linkedin || personalInfo.github) && (
              <div style={{ marginTop: 12 }}>
                <Space size={20}>
                  {personalInfo.linkedin && (
                    <Space size={6}>
                      <LinkedinOutlined style={{ color: '#1890ff', fontSize: 16 }} />
                      <Text style={{ fontSize: 13, color: '#666' }}>{personalInfo.linkedin}</Text>
                    </Space>
                  )}
                  {personalInfo.github && (
                    <Space size={6}>
                      <GithubOutlined style={{ color: '#1890ff', fontSize: 16 }} />
                      <Text style={{ fontSize: 13, color: '#666' }}>{personalInfo.github}</Text>
                    </Space>
                  )}
                </Space>
              </div>
            )}
          </div>

          {/* Professional Summary */}
          {personalInfo.summary && (
            <div style={{ marginBottom: 32 }}>
              <Title level={3} style={{ 
                fontSize: 20,
                fontWeight: 700,
                color: '#1890ff',
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                Professional Summary
              </Title>
              <Paragraph style={{ 
                fontSize: 15,
                lineHeight: 1.8,
                color: '#595959',
                textAlign: 'justify'
              }}>
                {personalInfo.summary}
              </Paragraph>
            </div>
          )}

          {/* Skills */}
          {cv.skills && (
            <div style={{ marginBottom: 32 }}>
              <Title level={3} style={{ 
                fontSize: 20,
                fontWeight: 700,
                color: '#1890ff',
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                Technical Skills
              </Title>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8
              }}>
                {cv.skills.split(',').map((skill, index) => (
                  <span 
                    key={index}
                    style={{
                      padding: '6px 16px',
                      background: '#e6f7ff',
                      color: '#1890ff',
                      borderRadius: 20,
                      fontSize: 14,
                      fontWeight: 500
                    }}
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <Title level={3} style={{ 
                fontSize: 20,
                fontWeight: 700,
                color: '#1890ff',
                marginBottom: 16,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                Work Experience
              </Title>
              <Space direction="vertical" size={24} style={{ width: '100%' }}>
                {experiences.map((exp: any, index: number) => (
                  <div key={index}>
                    <div style={{ marginBottom: 12 }}>
                      <Title level={4} style={{ 
                        fontSize: 17,
                        fontWeight: 600,
                        marginBottom: 4,
                        color: '#1a1a1a'
                      }}>
                        {exp.title}
                      </Title>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: 15, color: '#666' }}>
                          {exp.company}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#999' }}>
                          {exp.period}
                        </Text>
                      </div>
                    </div>
                    <ul style={{ 
                      margin: 0,
                      paddingLeft: 20,
                      color: '#595959'
                    }}>
                      {exp.responsibilities?.map((resp: string, idx: number) => (
                        <li key={idx} style={{ 
                          marginBottom: 6,
                          fontSize: 14,
                          lineHeight: 1.6
                        }}>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Space>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <Title level={3} style={{ 
                fontSize: 20,
                fontWeight: 700,
                color: '#1890ff',
                marginBottom: 16,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                Education
              </Title>
              <Space direction="vertical" size={20} style={{ width: '100%' }}>
                {education.map((edu: any, index: number) => (
                  <div key={index}>
                    <Title level={4} style={{ 
                      fontSize: 17,
                      fontWeight: 600,
                      marginBottom: 4,
                      color: '#1a1a1a'
                    }}>
                      {edu.degree}
                    </Title>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Text strong style={{ fontSize: 15, color: '#666' }}>
                        {edu.school}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#999' }}>
                        {edu.period}
                      </Text>
                    </div>
                    {edu.description && (
                      <Text style={{ fontSize: 14, color: '#595959' }}>
                        {edu.description}
                      </Text>
                    )}
                  </div>
                ))}
              </Space>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 60px',
          background: '#fafafa',
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <Text style={{ fontSize: 12, color: '#999' }}>
            This CV was created using SkillSync Learning Platform • {new Date().getFullYear()}
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
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default CVDetail
