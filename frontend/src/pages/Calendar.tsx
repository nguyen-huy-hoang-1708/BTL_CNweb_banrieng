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
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Learning Calendar</Title>
        <Paragraph>Schedule and track your learning events</Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
              Tạo sự kiện
            </Button>
          }
        >
          <AntCalendar cellRender={dateCellRender} onSelect={(date) => setSelectedDate(date)} />
        </Card>

        {upcomingEvents.length > 0 && (
          <Card title={<><ClockCircleOutlined /> Upcoming Events</>}>
            <List
              dataSource={upcomingEvents}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={`${dayjs(item.start_utc).format('MMM DD, YYYY HH:mm')} - ${dayjs(item.end_utc).format('HH:mm')}`}
                  />
                  <Badge 
                    status={item.status === 'planned' ? 'processing' : 'default'} 
                    text={item.status || 'planned'} 
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
      </Space>

      <Modal
        title="Tạo sự kiện học tập"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onCreateEvent}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
            <Input placeholder="Ví dụ: Học React Hooks" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết về buổi học..." />
          </Form.Item>

          <Form.Item name="module_id" label="Bài học liên quan">
            <Select
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
              showTime 
              format="DD/MM/YYYY HH:mm"
              style={{ width: '100%' }}
              placeholder="Chọn ngày giờ kết thúc"
            />
          </Form.Item>

          <Form.Item 
            name="reminder_minutes" 
            label={<><BellOutlined /> Nhắc nhở trước (phút)</>}
            initialValue={15}
          >
            <Select>
              <Select.Option value={5}>5 phút trước</Select.Option>
              <Select.Option value={15}>15 phút trước</Select.Option>
              <Select.Option value={30}>30 phút trước</Select.Option>
              <Select.Option value={60}>1 giờ trước</Select.Option>
              <Select.Option value={120}>2 giờ trước</Select.Option>
              <Select.Option value={1440}>1 ngày trước</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Tạo sự kiện
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* Floating action button for mobile/desktop discoverability */}
      <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1200 }}>
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          title="Tạo sự kiện"
        />
      </div>
</div>
  )
  }

export default Calendar
