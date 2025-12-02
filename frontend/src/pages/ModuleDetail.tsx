import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Spin, Alert, Typography, Space, Tag, Divider, Radio, message, Row, Col } from 'antd'
import { ArrowLeftOutlined, CheckCircleFilled, CloseCircleOutlined, BookOutlined } from '@ant-design/icons'
import api from '../services/api'

const { Title, Paragraph, Text } = Typography

type Module = {
  module_id: string
  title: string
  description?: string
  content?: string
  order_index: number
  estimated_hours?: number
}

type Exercise = {
  exercise_id: string
  title: string
  description: string
  difficulty?: string
  examples?: {
    question?: string
    image_url?: string
    code?: string
    choices?: Array<{ id: string; text: string }>
    correct_answer?: string
    explanation?: string
  }
}

const ModuleDetail: React.FC = () => {
  const { roadmapId, moduleId } = useParams<{ roadmapId: string; moduleId: string }>()
  const navigate = useNavigate()
  const [module, setModule] = useState<Module | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState<Record<string, boolean>>({})
  const [score, setScore] = useState(0)

  useEffect(() => {
    loadModuleData()
  }, [moduleId])

  const loadModuleData = async () => {
    try {
      setLoading(true)
      
      // Fetch modules to find the current one
      const modulesRes = await api.get(`/api/roadmaps/${roadmapId}/modules`)
      const modules = modulesRes.data?.data || modulesRes.data || []
      const currentModule = modules.find((m: Module) => m.module_id === moduleId)
      setModule(currentModule || null)

      // Fetch exercises for this module
      const exercisesRes = await api.get(`/api/exercises?moduleId=${moduleId}`)
      const exercisesData = exercisesRes.data?.data || exercisesRes.data || []
      setExercises(Array.isArray(exercisesData) ? exercisesData : [])
    } catch (err: any) {
      message.error('Không thể tải nội dung bài học')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (exerciseId: string, answerId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: answerId }))
  }

  const handleSubmitAnswer = (exercise: Exercise) => {
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
      message.error('Sai rồi! Xem giải thích bên dưới.')
    }
  }

  const calculateFinalScore = () => {
    const total = exercises.length
    const answered = Object.keys(showResults).length
    if (answered === total) {
      message.success(`Bạn đã hoàn thành! Điểm: ${score}/${total}`)
    }
  }

  useEffect(() => {
    if (showQuiz && Object.keys(showResults).length > 0) {
      calculateFinalScore()
    }
  }, [showResults])

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'green'
      case 'medium': return 'orange'
      case 'hard': return 'red'
      default: return 'blue'
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!module) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Alert message="Không tìm thấy bài học" type="error" showIcon />
        <Button type="primary" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
          Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Quay lại khóa học
      </Button>

      {/* Module Info */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <Space>
            <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <Title level={2} style={{ margin: 0 }}>{module.title}</Title>
          </Space>
          {module.estimated_hours && (
            <Tag color="purple" style={{ fontSize: 14 }}>
              ⏱️ Thời lượng: {module.estimated_hours} giờ
            </Tag>
          )}
        </Space>
      </Card>

      {/* Module Description */}
      {module.description && (
        <Card 
          title={<Text strong style={{ fontSize: 16 }}>📋 Mô tả bài học</Text>}
          style={{ marginBottom: 24 }}
        >
          <Paragraph style={{ fontSize: 15, lineHeight: 1.8 }}>
            {module.description}
          </Paragraph>
        </Card>
      )}

      {/* Module Content */}
      {module.content && (
        <Card 
          title={<Text strong style={{ fontSize: 16 }}>📖 Nội dung chi tiết</Text>}
          style={{ marginBottom: 24 }}
        >
          <Paragraph style={{ fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {module.content}
          </Paragraph>
        </Card>
      )}

      <Divider />

      {/* Quiz Section */}
      {exercises.length > 0 && (
        <Card>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ textAlign: 'center' }}>
              <Title level={3}>✍️ Bài tập ôn tập</Title>
              <Paragraph>
                Kiểm tra kiến thức của bạn với {exercises.length} câu hỏi trắc nghiệm
              </Paragraph>
              {!showQuiz && (
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => setShowQuiz(true)}
                >
                  Bắt đầu ôn tập
                </Button>
              )}
            </div>

            {showQuiz && (
              <>
                <Alert
                  message={`Điểm số hiện tại: ${score}/${exercises.length}`}
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  {exercises.map((exercise, index) => {
                    const quiz = exercise.examples
                    const userAnswer = selectedAnswers[exercise.exercise_id]
                    const showResult = showResults[exercise.exercise_id]
                    const isCorrect = userAnswer === quiz?.correct_answer

                    return (
                      <Card
                        key={exercise.exercise_id}
                        title={
                          <Space>
                            <Text strong style={{ fontSize: 16 }}>Câu {index + 1}:</Text>
                            <Text style={{ fontSize: 16 }}>{exercise.title}</Text>
                            <Tag color={getDifficultyColor(exercise.difficulty)}>
                              {exercise.difficulty}
                            </Tag>
                          </Space>
                        }
                        style={{ background: '#fafafa' }}
                      >
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                          {/* Question */}
                          <div>
                            <Text strong style={{ fontSize: 16 }}>
                              {quiz?.question || exercise.description}
                            </Text>
                          </div>

                          {/* Image */}
                          {quiz?.image_url && (
                            <img
                              src={quiz.image_url}
                              alt={exercise.title}
                              style={{
                                width: '100%',
                                maxHeight: 400,
                                objectFit: 'cover',
                                borderRadius: 8,
                                border: '1px solid #d9d9d9'
                              }}
                            />
                          )}

                          {/* Code */}
                          {quiz?.code && (
                            <Card size="small" style={{ background: '#f5f5f5' }}>
                              <pre style={{ margin: 0, fontSize: 14, fontFamily: 'monospace' }}>
                                {quiz.code}
                              </pre>
                            </Card>
                          )}

                          {/* Choices */}
                          {quiz?.choices && (
                            <Radio.Group
                              value={userAnswer}
                              onChange={(e) => handleAnswerSelect(exercise.exercise_id, e.target.value)}
                              disabled={showResult}
                              style={{ width: '100%' }}
                            >
                              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                {quiz.choices.map((choice) => (
                                  <Radio
                                    key={choice.id}
                                    value={choice.id}
                                    style={{
                                      display: 'block',
                                      padding: '16px',
                                      border: '2px solid',
                                      borderRadius: 8,
                                      fontSize: 15,
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
                                    <Space size="middle">
                                      <Text strong style={{ fontSize: 16 }}>{choice.id}.</Text>
                                      <Text style={{ fontSize: 15 }}>{choice.text}</Text>
                                      {showResult && choice.id === quiz.correct_answer && (
                                        <CheckCircleFilled style={{ color: '#52c41a', fontSize: 20 }} />
                                      )}
                                      {showResult && choice.id === userAnswer && choice.id !== quiz.correct_answer && (
                                        <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
                                      )}
                                    </Space>
                                  </Radio>
                                ))}
                              </Space>
                            </Radio.Group>
                          )}

                          {/* Submit Button */}
                          {!showResult && quiz?.choices && (
                            <Button
                              type="primary"
                              size="large"
                              onClick={() => handleSubmitAnswer(exercise)}
                              disabled={!userAnswer}
                              block
                            >
                              Kiểm tra đáp án
                            </Button>
                          )}

                          {/* Explanation */}
                          {showResult && quiz?.explanation && (
                            <Alert
                              message={isCorrect ? '✅ Chính xác!' : '❌ Chưa đúng'}
                              description={quiz.explanation}
                              type={isCorrect ? 'success' : 'info'}
                              showIcon
                            />
                          )}
                        </Space>
                      </Card>
                    )
                  })}
                </Space>

                {/* Final Score */}
                {Object.keys(showResults).length === exercises.length && (
                  <Card style={{ background: '#f0f5ff', textAlign: 'center' }}>
                    <Title level={3}>
                      🎉 Hoàn thành! Điểm số: {score}/{exercises.length}
                    </Title>
                    <Space>
                      <Button 
                        size="large"
                        onClick={() => {
                          setShowQuiz(false)
                          setSelectedAnswers({})
                          setShowResults({})
                          setScore(0)
                        }}
                      >
                        Làm lại
                      </Button>
                      <Button 
                        type="primary" 
                        size="large"
                        onClick={() => navigate(-1)}
                      >
                        Quay lại khóa học
                      </Button>
                    </Space>
                  </Card>
                )}
              </>
            )}
          </Space>
        </Card>
      )}
    </div>
  )
}

export default ModuleDetail
