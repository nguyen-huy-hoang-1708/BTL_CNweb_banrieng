import React, { useEffect, useState } from 'react'
import { Badge, Dropdown, List, Button, Empty, Typography } from 'antd'
import { BellOutlined, CheckOutlined } from '@ant-design/icons'
import api from '../services/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
dayjs.locale('vi')

const { Text } = Typography

type Notification = {
  notification_id: string
  title: string
  message: string
  type: 'reminder' | 'info' | 'warning'
  is_read: boolean
  created_at: string
  related_event_id?: string
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  console.log('🔔 NotificationBell component rendered, notifications count:', notifications.length)

  const fetchNotifications = async () => {
    try {
      console.log('🔔 Fetching notifications from /api/notifications...')
      const res = await api.get('/api/notifications', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      console.log('📦 Raw response:', res)
      console.log('📊 Response data:', res.data)
      const notifs = res.data?.data || []
      console.log('✅ Notifications fetched:', notifs.length, 'total,', notifs.filter(n => !n.is_read).length, 'unread')
      if (notifs.length > 0) {
        console.log('📝 First notification:', notifs[0])
      }
      setNotifications(notifs)
    } catch (err) {
      console.error('❌ Failed to load notifications:', err)
      console.error('Error details:', err.response?.data || err.message)
    }
  }

  useEffect(() => {
    console.log('🎯 useEffect triggered - fetching notifications immediately')
    fetchNotifications()
    
    // Poll for new notifications every minute
    console.log('⏰ Setting up 60-second polling interval')
    const interval = setInterval(() => {
      console.log('🔄 Polling interval triggered - fetching notifications')
      fetchNotifications()
    }, 60000)
    
    return () => {
      console.log('🛑 Cleaning up notification polling interval')
      clearInterval(interval)
    }
  }, [])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`)
      setNotifications(prev =>
        prev.map(n => n.notification_id === notificationId ? { ...n, is_read: true } : n)
      )
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    setLoading(true)
    try {
      await api.post('/api/notifications/mark-all-read')
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder': return '#1890ff'
      case 'warning': return '#faad14'
      case 'info': return '#52c41a'
      default: return '#d9d9d9'
    }
  }

  const menuContent = (
    <div style={{ width: 380, maxHeight: 500, overflow: 'auto', backgroundColor: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong>Thông báo</Text>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            type="link" 
            size="small" 
            onClick={() => {
              console.log('🔄 Manual fetch triggered')
              fetchNotifications()
            }}
          >
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button 
              type="link" 
              size="small" 
              onClick={handleMarkAllAsRead}
              loading={loading}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <div style={{ padding: 40 }}>
          <Empty description="Không có thông báo" />
        </div>
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '12px 16px',
                backgroundColor: item.is_read ? 'white' : '#e6f7ff',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0'
              }}
              onClick={() => !item.is_read && handleMarkAsRead(item.notification_id)}
            >
              <List.Item.Meta
                avatar={
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: item.is_read ? '#d9d9d9' : getNotificationColor(item.type),
                    marginTop: 8
                  }} />
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong={!item.is_read}>{item.title}</Text>
                    {!item.is_read && (
                      <CheckOutlined style={{ color: '#1890ff', fontSize: 12 }} />
                    )}
                  </div>
                }
                description={
                  <>
                    <div style={{ marginBottom: 4 }}>{item.message}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(item.created_at).fromNow()}
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  )

  return (
    <Dropdown
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      dropdownRender={() => menuContent}
      trigger={['click']}
      placement="bottomRight"
    >
      <Badge count={unreadCount} offset={[-5, 5]} size="small">
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 18 }} />}
          style={{ padding: '4px 8px' }}
        />
      </Badge>
    </Dropdown>
  )
}

export default NotificationBell
