import React, { useState, useEffect } from 'react'
import { Card, Button, Radio, Space, Progress, Typography, message } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

const { Title, Text } = Typography

type Question = {
  question_id: string
  question_text: string
  question_type: string
  options?: string[]
  correct_answer?: string
}

const ExerciseQuiz: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)

  // Dữ liệu mẫu 5 câu hỏi
  const sampleQuestions: Question[] = [
    {
      question_id: '1',
      question_text: 'Tag HTML nào dùng để đánh dấu phần header của trang?',
      question_type: 'multiple_choice',
      options: ['<head>', '<header>', '<h1>', '<top>'],
      correct_answer: '<header>'
    },
    {
      question_id: '2',
      question_text: 'Thuộc tính nào dùng để thêm class cho thẻ HTML?',
      question_type: 'multiple_choice',
      options: ['className', 'class', 'id', 'style'],
      correct_answer: 'class'
    },
    {
      question_id: '3',
      question_text: 'Tag nào dùng để tạo danh sách không có thứ tự?',
      question_type: 'multiple_choice',
      options: ['<ol>', '<ul>', '<li>', '<list>'],
      correct_answer: '<ul>'
    },
    {
      question_id: '4',
      question_text: 'Thuộc tính nào dùng để thêm ảnh vào HTML?',
      question_type: 'multiple_choice',
      options: ['href', 'link', 'src', 'url'],
      correct_answer: 'src'
    },
    {
      question_id: '5',
      question_text: 'Tag nào dùng để tạo liên kết trong HTML?',
      question_type: 'multiple_choice',
      options: ['<link>', '<a>', '<href>', '<url>'],
      correct_answer: '<a>'
    }
  ]

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!moduleId) {
        setQuestions(sampleQuestions)
        setLoading(false)
        return
      }

      try {
        const res = await api.get(`/api/exercises/module/${moduleId}`)
        const fetchedQuestions = res.data?.data || res.data || []
        // Giới hạn chỉ 5 câu
        if (fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions.slice(0, 5))
        } else {
          setQuestions(sampleQuestions)
        }
      } catch (err) {
        console.error('Failed to load questions:', err)
        setQuestions(sampleQuestions)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [moduleId])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleNext = () => {
    if (!selectedAnswer) {
      message.warning('Vui lòng chọn câu trả lời!')
      return
    }

    setAnswers({ ...answers, [currentQuestionIndex]: selectedAnswer })

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(answers[currentQuestionIndex + 1] || '')
    } else {
      calculateScore()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(answers[currentQuestionIndex - 1] || '')
    }
  }

  const calculateScore = () => {
    const finalAnswers = { ...answers, [currentQuestionIndex]: selectedAnswer }
    let correctCount = 0

    questions.forEach((q, index) => {
      if (finalAnswers[index] === q.correct_answer) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResult(true)
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setAnswers({})
    setShowResult(false)
    setScore(0)
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <Text>Đang tải...</Text>
      </div>
    )
  }

  if (showResult) {
    const percentage = (score / questions.length) * 100
    const passed = percentage >= 60

    return (
      <div style={{ 
        minHeight: 'calc(100vh - 64px)',
        background: '#f5f7fa',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Card style={{ borderRadius: 16, textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 72, marginBottom: 24 }}>
              {passed ? '🎉' : '📚'}
            </div>
            <Title level={2} style={{ marginBottom: 16 }}>
              {passed ? 'Chúc mừng!' : 'Cần cố gắng thêm!'}
            </Title>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: passed ? '#52c41a' : '#faad14', marginBottom: 8 }}>
                {score}/{questions.length}
              </div>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Điểm số của bạn: {percentage.toFixed(0)}%
              </Text>
            </div>

            <Space direction="vertical" size={16} style={{ width: '100%', marginBottom: 32 }}>
              {questions.map((q, index) => {
                const userAnswer = answers[index]
                const isCorrect = userAnswer === q.correct_answer

                return (
                  <Card 
                    key={q.question_id}
                    size="small"
                    style={{ 
                      textAlign: 'left',
                      border: isCorrect ? '2px solid #52c41a' : '2px solid #ff4d4f'
                    }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {isCorrect ? (
                          <CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                        ) : (
                          <CloseCircleOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
                        )}
                        <Text strong>Câu {index + 1}: {q.question_text}</Text>
                      </div>
                      <div style={{ paddingLeft: 28 }}>
                        <Text type="secondary">Câu trả lời của bạn: </Text>
                        <Text style={{ color: isCorrect ? '#52c41a' : '#ff4d4f' }}>
                          {userAnswer || 'Không trả lời'}
                        </Text>
                      </div>
                      {!isCorrect && (
                        <div style={{ paddingLeft: 28 }}>
                          <Text type="secondary">Đáp án đúng: </Text>
                          <Text style={{ color: '#52c41a' }}>{q.correct_answer}</Text>
                        </div>
                      )}
                    </Space>
                  </Card>
                )
              })}
            </Space>

            <Space size={16}>
              <Button 
                size="large"
                onClick={handleRestart}
                style={{ minWidth: 120 }}
              >
                Làm lại
              </Button>
              <Button 
                type="primary"
                size="large"
                onClick={() => navigate(-1)}
                style={{ minWidth: 120 }}
              >
                Quay lại
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 64px)',
      background: '#f5f7fa'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'white',
        borderBottom: '1px solid #e8e8e8',
        padding: '20px 24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Title level={3} style={{ margin: 0, flex: 1 }}>
              ✍️ Bài tập ôn tập
            </Title>
            <Text type="secondary">
              Điểm số hiện tại: {currentQuestionIndex}/{questions.length}
            </Text>
          </div>
          <Progress 
            percent={progress} 
            showInfo={false}
            strokeColor="#1890ff"
          />
        </div>
      </div>

      {/* Question Content */}
      <div style={{ 
        maxWidth: 900, 
        margin: '40px auto',
        padding: '0 24px'
      }}>
        <Card 
          style={{ 
            borderRadius: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
          bodyStyle={{ padding: 40 }}
        >
          <div style={{ marginBottom: 32 }}>
            <Text type="secondary" style={{ fontSize: 14, display: 'block', marginBottom: 16 }}>
              Câu {currentQuestionIndex + 1}: {currentQuestion.question_type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
              {' '}• easy
            </Text>
            <Title level={4} style={{ fontSize: 22, marginBottom: 0 }}>
              {currentQuestion.question_text}
            </Title>
          </div>

          {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
            <Radio.Group 
              value={selectedAnswer}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {currentQuestion.options.map((option, index) => (
                  <Radio 
                    key={index}
                    value={option}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: '2px solid #e8e8e8',
                      borderRadius: 12,
                      background: selectedAnswer === option ? '#e6f7ff' : 'white',
                      borderColor: selectedAnswer === option ? '#1890ff' : '#e8e8e8',
                      transition: 'all 0.3s'
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{option}</Text>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          )}

          <div style={{ 
            marginTop: 40,
            paddingTop: 24,
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Button
              size="large"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              style={{ minWidth: 120 }}
            >
              Câu trước
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleNext}
              disabled={!selectedAnswer}
              style={{ minWidth: 120 }}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ExerciseQuiz
