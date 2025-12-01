import React, { useEffect, useState } from 'react'
import { Calendar as AntCalendar, Badge, Modal, Form, Input, DatePicker, Button, message, Typography, Space, Card, List } from 'antd'
import { CalendarOutlined, PlusOutlined, ClockCircleOutlined } from '@ant-design/icons'
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
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<LearningEvent[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [form] = Form.useForm()

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
  }, [])

  const onCreateEvent = async (values: any) => {
    try {
      await api.post('/api/calendar/events', {
        title: values.title,
        description: values.description,
        start_utc: values.start_utc.toISOString(),
        end_utc: values.end_utc.toISOString(),
        status: 'planned'
      })
      message.success('Event created successfully!')
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
              Add Event
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
        title="Create Learning Event"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onCreateEvent}>
          <Form.Item label="Event Title" name="title" rules={[{ required: true, message: 'Please enter event title' }]}>
            <Input placeholder="e.g., Study React Hooks" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Add event description..." />
          </Form.Item>
          <Form.Item label="Start Time" name="start_utc" rules={[{ required: true, message: 'Please select start time' }]}>
            <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item label="End Time" name="end_utc" rules={[{ required: true, message: 'Please select end time' }]}>
            <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Calendar
