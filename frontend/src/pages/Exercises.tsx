import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Tag, Spin, Alert, Empty, Button, Radio, Space, Typography, message, Modal } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, TrophyOutlined } from '@ant-design/icons'
import api from '../services/api'

const { Title, Paragraph, Text } = Typography

type Exercise = {
  exercise_id: string
  title: string
  description: string
  difficulty?: string
  module_id?: string
  examples?: {
    question?: string
    image_url?: string
    code?: string
    choices?: Array<{ id: string; text: string }>
    correct_answer?: string
    explanation?: string
  }
}

const Exercises: React.FC = () => {
  const [items, setItems] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState<Record<string, boolean>>({})
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  const fetchExercises = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/api/exercises')
      const data = res.data?.data || res.data || []
      const exercises = Array.isArray(data) ? data : []
      setItems(exercises)
      setTotal(exercises.filter(ex => ex.examples?.correct_answer).length)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load exercises')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExercises()
  }, [])

  const handleAnswerSelect = (exerciseId: string, answerId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: answerId }))
  }

  const handleSubmit = (exercise: Exercise) => {
    const userAnswer = selectedAnswers[exercise.exercise_id]
    const correctAnswer = exercise.examples?.correct_answer

    if (!userAnswer) {
      message.warning('Vui lòng chọn đáp án!')
      return
    }

    setShowResults(prev => ({ ...prev, [exercise.exercise_id]: true }))

    if (userAnswer === correctAnswer) {
      setScore(prev => prev + 1)
      message.success('Chính xác! 🎉')
    } else {
      message.error('Sai rồi! Hãy xem giải thích bên dưới.')
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'green'
      case 'medium': return 'orange'
      case 'hard': return 'red'
      default: return 'blue'
    }
  }

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '48px auto' }} />
  if (error) return <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2}>📝 Bài tập trắc nghiệm</Title>
          <Paragraph>Kiểm tra kiến thức của bạn với các câu hỏi có ảnh minh họa</Paragraph>
        </div>
        {total > 0 && (
          <Card size="small" style={{ background: '#f0f5ff' }}>
            <Space>
              <TrophyOutlined style={{ fontSize: 20, color: '#1890ff' }} />
              <Text strong>Điểm: {score}/{total}</Text>
            </Space>
          </Card>
        )}
      </div>

      {items.length === 0 ? (
        <Empty description="Chưa có bài tập nào" />
      ) : (
        <Row gutter={[24, 24]}>
          {items.map((item, index) => {
            const quiz = item.examples
            const userAnswer = selectedAnswers[item.exercise_id]
            const showResult = showResults[item.exercise_id]
            const isCorrect = userAnswer === quiz?.correct_answer

            return (
              <Col xs={24} key={item.exercise_id}>
                <Card
                  title={
                    <Space>
                      <Text strong>Câu {index + 1}:</Text>
                      <Text>{item.title}</Text>
                      <Tag color={getDifficultyColor(item.difficulty)}>
                        {item.difficulty || 'medium'}
                      </Tag>
                    </Space>
                  }
                  bordered
                  hoverable={!showResult}
                >
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Question */}
                    <div>
                      <Paragraph strong style={{ fontSize: 16 }}>
                        {quiz?.question || item.description}
                      </Paragraph>
                    </div>

                    {/* Image */}
                    {quiz?.image_url && (
                      <img
                        src={quiz.image_url}
                        alt={item.title}
                        style={{
                          width: '100%',
                          maxHeight: 400,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid #f0f0f0'
                        }}
                      />
                    )}

                    {/* Code snippet */}
                    {quiz?.code && (
                      <Card size="small" style={{ background: '#f5f5f5' }}>
                        <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 14 }}>
                          {quiz.code}
                        </pre>
                      </Card>
                    )}

                    {/* Choices */}
                    {quiz?.choices && (
                      <Radio.Group
                        value={userAnswer}
                        onChange={(e) => handleAnswerSelect(item.exercise_id, e.target.value)}
                        disabled={showResult}
                        style={{ width: '100%' }}
                      >
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {quiz.choices.map((choice) => (
                            <Radio
                              key={choice.id}
                              value={choice.id}
                              style={{
                                display: 'block',
                                padding: '12px 16px',
                                border: '1px solid #d9d9d9',
                                borderRadius: 8,
                                background: showResult
                                  ? choice.id === quiz.correct_answer
                                    ? '#f6ffed'
                                    : choice.id === userAnswer
                                    ? '#fff2e8'
                                    : 'white'
                                  : 'white',
                                borderColor: showResult
                                  ? choice.id === quiz.correct_answer
                                    ? '#52c41a'
                                    : choice.id === userAnswer
                                    ? '#fa8c16'
                                    : '#d9d9d9'
                                  : '#d9d9d9'
                              }}
                            >
                              <Space>
                                <Text strong>{choice.id}.</Text>
                                <Text>{choice.text}</Text>
                                {showResult && choice.id === quiz.correct_answer && (
                                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                )}
                                {showResult && choice.id === userAnswer && choice.id !== quiz.correct_answer && (
                                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                                )}
                              </Space>
                            </Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                    )}

                    {/* Submit button */}
                    {!showResult && quiz?.choices && (
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => handleSubmit(item)}
                        disabled={!userAnswer}
                        style={{ width: 200 }}
                      >
                        Kiểm tra đáp án
                      </Button>
                    )}

                    {/* Explanation */}
                    {showResult && quiz?.explanation && (
                      <Alert
                        message={isCorrect ? 'Chính xác! 🎉' : 'Giải thích'}
                        description={quiz.explanation}
                        type={isCorrect ? 'success' : 'info'}
                        showIcon
                      />
                    )}
                  </Space>
                </Card>
              </Col>
            )
          })}
        </Row>
      )}
    </div>
  )
}

export default Exercises
