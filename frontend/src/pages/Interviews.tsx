import React, { useState, useEffect } from 'react'
import { Input, Typography, Space, Card, Empty, Button } from 'antd'
import { SendOutlined, PlusOutlined, HistoryOutlined, BookOutlined, CodeOutlined, CompassOutlined } from '@ant-design/icons'
import api from '../services/api'

const { Title, Text } = Typography

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type UserInfo = {
  user_id: string
  full_name: string
  email: string
  avatar_url?: string
}

const Interviews: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (userId) {
      api.get(`/api/auth/users/${userId}`)
        .then((res) => {
          setUser(res.data?.data || res.data)
        })
        .catch((err) => {
          console.error('Failed to load user:', err)
        })
    }
  }, [])

  const samplePrompts = [
    'Viết nội dung câu lỏng',
    'Từ vị theo giỏ sinh',
    'Hướng dẫn về hình chiếu'
  ]

  const chatHistory = [
    'TTCS',
    'CV Quang',
    'Bài tập về nhà'
  ]

  const gptOptions = [
    { name: 'Khám phá', icon: <CompassOutlined /> },
    { name: 'Video AI by invideo', icon: <BookOutlined /> },
    { name: 'Canva', icon: <CodeOutlined /> },
    { name: 'Việt Nam GPT', icon: <HistoryOutlined /> }
  ]

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setInputValue('')
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Đây là câu trả lời mẫu cho câu hỏi phỏng vấn của bạn. Trong thực tế, đây sẽ được thay thế bằng AI response thực sự.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ 
      display: 'flex',
      height: 'calc(100vh - 64px)',
      background: '#f9f9f9'
    }}>
      {/* Left Sidebar */}
      <div style={{ 
        width: 260,
        background: '#f5f5f5',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 12px'
      }}>
        {/* New Chat Button */}
        <Button
          type="default"
          icon={<PlusOutlined />}
          size="large"
          block
          style={{
            marginBottom: 24,
            height: 44,
            borderRadius: 8,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          Đoạn chat mới
        </Button>

        {/* Search */}
        <Input
          placeholder="Tìm kiếm đoạn chat"
          style={{
            marginBottom: 16,
            borderRadius: 6
          }}
          prefix={<span style={{ color: '#999' }}>🔍</span>}
        />

        {/* Menu Items */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8, marginLeft: 8 }}>
            GPT
          </Text>
          
          <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 24 }}>
            {gptOptions.map((option, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 16 }}>{option.icon}</span>
                <Text style={{ fontSize: 14 }}>{option.name}</Text>
              </div>
            ))}
          </Space>

          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8, marginLeft: 8 }}>
            Dự án
          </Text>
          
          <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 24 }}>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 16 }}>📁</span>
              <Text style={{ fontSize: 14 }}>Dự án mới</Text>
            </div>
          </Space>

          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8, marginLeft: 8 }}>
            Các đoạn chat của bạn
          </Text>
          
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            {chatHistory.map((chat, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 16 }}>💬</span>
                <Text style={{ fontSize: 14 }}>{chat}</Text>
              </div>
            ))}
          </Space>
        </div>

        {/* User Profile at Bottom */}
        <div style={{
          marginTop: 'auto',
          padding: '12px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          borderRadius: 6
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#1890ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600
          }}>
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: 500, display: 'block' }}>
              {user?.full_name || 'User'}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>Plus</Text>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'white'
      }}>
        {/* Chat Messages */}
        <div style={{ 
          flex: 1,
          overflowY: 'auto',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {messages.length === 0 ? (
            <div style={{ 
              maxWidth: 800,
              width: '100%',
              textAlign: 'center',
              marginTop: '15vh'
            }}>
              <Title level={1} style={{ 
                fontSize: 42,
                fontWeight: 600,
                marginBottom: 48,
                color: '#1a1a1a'
              }}>
                Hôm nay bạn có ý tưởng gì?
              </Title>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                marginBottom: 32
              }}>
                {samplePrompts.map((prompt, idx) => (
                  <Card
                    key={idx}
                    hoverable
                    style={{
                      borderRadius: 12,
                      border: '1px solid #e8e8e8',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    bodyStyle={{ padding: '16px' }}
                    onClick={() => setInputValue(prompt)}
                  >
                    <Text style={{ fontSize: 14, color: '#595959' }}>
                      {prompt}
                    </Text>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 800, width: '100%' }}>
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  style={{ 
                    marginBottom: 24,
                    display: 'flex',
                    gap: 16
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: msg.role === 'user' ? '#1890ff' : '#52c41a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    {msg.role === 'user' ? (user?.full_name?.charAt(0).toUpperCase() || 'U') : 'AI'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, lineHeight: 1.6, color: '#1a1a1a' }}>
                      {msg.content}
                    </Text>
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ 
                  marginBottom: 24,
                  display: 'flex',
                  gap: 16
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#52c41a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    AI
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text type="secondary">Đang soạn câu trả lời...</Text>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{ 
          borderTop: '1px solid #e8e8e8',
          padding: '24px',
          background: 'white'
        }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#f5f5f5',
              borderRadius: 24,
              padding: '8px 16px',
              border: '1px solid #e0e0e0'
            }}>
              <Button
                type="text"
                icon={<PlusOutlined />}
                style={{ 
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
              <Input
                placeholder="Hỏi bất kỳ điều gì"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                bordered={false}
                style={{
                  flex: 1,
                  background: 'transparent',
                  fontSize: 15
                }}
              />
              <Button
                type="text"
                icon={<span style={{ fontSize: 18 }}>🎤</span>}
                style={{ 
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={!inputValue.trim()}
                style={{ 
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: inputValue.trim() ? '#1890ff' : '#d9d9d9',
                  border: 'none'
                }}
              />
            </div>
            <Text type="secondary" style={{ 
              fontSize: 11,
              display: 'block',
              textAlign: 'center',
              marginTop: 8
            }}>
              SkillSync AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Interviews
