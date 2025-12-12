import React, { useEffect, useState } from 'react'
import { Calendar as AntCalendar, Badge, Modal, Form, Input, DatePicker, Button, message, Typography, Space, Card, List, Select, InputNumber } from 'antd'
import { CalendarOutlined, PlusOutlined, ClockCircleOutlined, BellOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import api from '../services/api'

const { Title, Paragraph, Text } = Typography

type LearningEvent = {
  event_id: string
  title: string
  description?: string
  start_utc: string
  end_utc: string
  status?: string
  color?: string
  reminder_minutes?: number
  module_id?: string
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<LearningEvent[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [modules, setModules] = useState<any[]>([])
  const [form] = Form.useForm()

  const fetchModules = async () => {
    try {
      const res = await api.get('/api/roadmaps')
      const roadmaps = res.data?.data || []
      const allModules: any[] = []
      
      for (const roadmap of roadmaps.slice(0, 3)) {
        const detailRes = await api.get(`/api/roadmaps/${roadmap.roadmap_id}`)
        const roadmapModules = detailRes.data?.data?.modules || []
        allModules.push(...roadmapModules.map((m: any) => ({
          ...m,
          roadmap_title: roadmap.title
        })))
      }
      
      setModules(allModules)
    } catch (err) {
      console.error('Failed to load modules:', err)
    }
  }

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/calendar/events')
      const data = res.data?.data || res.data || []
      setEvents(Array.isArray(data) ? data : [])
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to load events')
      setEvents([])
    }
  }

  useEffect(() => {
    fetchEvents()
    fetchModules()
  }, [])

  const onCreateEvent = async (values: any) => {
    try {
      await api.post('/api/calendar/events', {
        title: values.title,
        description: values.description,
        start_utc: values.start_utc.toISOString(),
        end_utc: values.end_utc.toISOString(),
        module_id: values.module_id,
        reminder_minutes: values.reminder_minutes,
        status: 'planned'
      })
      message.success('Sự kiện đã được tạo và nhắc nhở đã được đặt!')
      setModalVisible(false)
      form.resetFields()
      fetchEvents()
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Failed to create event')
    }
  }

  const dateCellRender = (value: Dayjs) => {
    const listData = events.filter((e) =>
      dayjs(e.start_utc).isSame(value, 'day')
    )
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item) => (
          <li key={item.event_id} style={{ marginBottom: 4 }}>
            <Badge 
              status={item.status === 'done' ? 'success' : item.status === 'missed' ? 'error' : 'processing'} 
              text={<Text ellipsis style={{ fontSize: 12 }}>{item.title}</Text>} 
            />
          </li>
        ))}
      </ul>
    )
  }

  const upcomingEvents = events
    .filter(e => dayjs(e.start_utc).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.start_utc).valueOf() - dayjs(b.start_utc).valueOf())
    .slice(0, 5)

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 128px)', background: '#fff' }}>
      {/* Left Sidebar - Mini Calendar & Upcoming Events */}
      <div style={{ 
        width: 320, 
        background: 'white', 
        borderRight: '1px solid #e8e8e8',
        padding: '24px 16px',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: 32 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            block
            onClick={() => setModalVisible(true)}
            style={{ height: 48, fontSize: 16, fontWeight: 600, borderRadius: 24, marginBottom: 24 }}
          >
            Tạo sự kiện
          </Button>
        </div>

        {/* Mini Calendar */}
        <Card 
          size="small" 
          style={{ marginBottom: 24, border: 'none', background: '#fafafa' }}
          bodyStyle={{ padding: 12 }}
        >
          <AntCalendar 
            fullscreen={false} 
            onSelect={(date) => setSelectedDate(date)}
            headerRender={({ value, onChange }) => {
              const month = value.format('MMMM')
              const year = value.format('YYYY')
              return (
                <div style={{ padding: '12px 8px', textAlign: 'center' }}>
                  <Text strong style={{ fontSize: 16 }}>{month} {year}</Text>
                </div>
              )
            }}
          />
        </Card>

        {/* Upcoming Events List */}
        {upcomingEvents.length > 0 && (
          <div>
            <Title level={5} style={{ fontSize: 16, marginBottom: 16 }}>
              <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              Sự kiện sắp tới
            </Title>
            <List
              size="small"
              dataSource={upcomingEvents}
              renderItem={(item) => (
                <Card 
                  size="small" 
                  style={{ 
                    marginBottom: 12, 
                    borderRadius: 8,
                    borderLeft: `4px solid ${item.status === 'done' ? '#52c41a' : '#1890ff'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  bodyStyle={{ padding: 12 }}
                  hoverable
                >
                  <div>
                    <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>
                      {item.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {dayjs(item.start_utc).format('MMM DD, HH:mm')}
                    </Text>
                    {item.reminder_minutes && (
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          <BellOutlined style={{ marginRight: 4, color: '#faad14' }} />
                          Nhắc {item.reminder_minutes}p trước
                        </Text>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            />
          </div>
        )}
      </div>

      {/* Main Calendar Area */}
      <div style={{ 
        flex: 1, 
        padding: '32px 40px',
        overflowY: 'auto',
        background: '#fafafa'
      }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2} style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            <CalendarOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            Lịch học tập
          </Title>
          <Paragraph style={{ fontSize: 16, color: '#666' }}>
            {dayjs().format('dddd, MMMM DD, YYYY')}
          </Paragraph>
        </div>

        <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <AntCalendar 
            cellRender={dateCellRender} 
            onSelect={(date) => setSelectedDate(date)}
            headerRender={({ value, type, onChange, onTypeChange }) => {
              const month = value.month()
              const year = value.year()
              const monthOptions = []
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

              for (let i = 0; i < 12; i++) {
                monthOptions.push(
                  <Select.Option key={i} value={i}>
                    {months[i]}
                  </Select.Option>
                )
              }

              const yearOptions = []
              for (let i = year - 10; i < year + 10; i++) {
                yearOptions.push(
                  <Select.Option key={i} value={i}>
                    {i}
                  </Select.Option>
                )
              }

              return (
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                  <Space size="middle">
                    <Select
                      size="large"
                      value={month}
                      onChange={(newMonth) => {
                        const now = value.clone().month(newMonth)
                        onChange(now)
                      }}
                      style={{ width: 120 }}
                    >
                      {monthOptions}
                    </Select>
                    <Select
                      size="large"
                      value={year}
                      onChange={(newYear) => {
                        const now = value.clone().year(newYear)
                        onChange(now)
                      }}
                      style={{ width: 100 }}
                    >
                      {yearOptions}
                    </Select>
                    <Button
                      onClick={() => {
                        const now = dayjs()
                        onChange(now)
                      }}
                    >
                      Hôm nay
                    </Button>
                  </Space>
                </div>
              )
            }}
          />
        </Card>
      </div>

      <Modal
        title={
          <Space>
            <CalendarOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>Tạo sự kiện học tập</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onCreateEvent} style={{ marginTop: 24 }}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
            <Input size="large" placeholder="Ví dụ: Học React Hooks" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea size="large" rows={3} placeholder="Mô tả chi tiết về buổi học..." />
          </Form.Item>

          <Form.Item name="module_id" label="Bài học liên quan">
            <Select
              size="large"
              placeholder="Chọn bài học (tùy chọn)"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {modules.map(m => (
                <Select.Option key={m.module_id} value={m.module_id}>
                  {m.title} ({m.roadmap_title})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="start_utc"
            label="Thời gian bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
          >
            <DatePicker 
              size="large"
              showTime 
              format="DD/MM/YYYY HH:mm"
              style={{ width: '100%' }}
              placeholder="Chọn ngày giờ bắt đầu"
            />
          </Form.Item>

          <Form.Item
            name="end_utc"
            label="Thời gian kết thúc"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
          >
            <DatePicker 
              size="large"
              showTime 
              format="DD/MM/YYYY HH:mm"
              style={{ width: '100%' }}
              placeholder="Chọn ngày giờ kết thúc"
            />
          </Form.Item>

          <Form.Item 
            name="reminder_minutes" 
            label={<><BellOutlined style={{ color: '#faad14' }} /> Nhắc nhở trước (phút)</>}
            initialValue={15}
          >
            <Select size="large">
              <Select.Option value={5}>⏰ 5 phút trước</Select.Option>
              <Select.Option value={15}>⏰ 15 phút trước</Select.Option>
              <Select.Option value={30}>⏰ 30 phút trước</Select.Option>
              <Select.Option value={60}>⏰ 1 giờ trước</Select.Option>
              <Select.Option value={120}>⏰ 2 giờ trước</Select.Option>
              <Select.Option value={1440}>⏰ 1 ngày trước</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }} size="middle">
              <Button size="large" onClick={() => setModalVisible(false)} style={{ height: 44, padding: '0 24px' }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" size="large" style={{ height: 44, padding: '0 32px', fontWeight: 600 }}>
                Tạo sự kiện
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
  }

export default Calendar
