/**
 * 答题页面
 * 顶部进度条 + 题号，题目卡片，选项列表，底部按钮
 * 数据来源：本地题库 allQuestions
 */
import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '@/store/useStore'
import QuestionCard from '@/components/QuestionCard'
import OptionItem from '@/components/OptionItem'
import { allQuestions } from '@/data/questions'
import type { Question } from '@/types'

/** 随机抽取指定数量的题目 */
function getRandomQuestions(questions: Question[], count: number): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export default function Quiz() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { currentQuiz, startQuiz, answerQuestion, finishQuiz, addWrongQuestion } =
    useStore()

  // 从 URL 参数获取章节 ID
  const chapterId = searchParams.get('chapter') || ''

  // 根据章节筛选题目，如果没有指定章节则随机抽取5道题
  const filteredQuestions = useMemo(() => {
    if (chapterId) {
      const chapterQuestions = allQuestions.filter(
        (q) => q.chapterId === chapterId
      )
      return chapterQuestions.length > 0
        ? chapterQuestions
        : getRandomQuestions(allQuestions, 5)
    }
    return getRandomQuestions(allQuestions, 5)
  }, [chapterId])

  // 如果没有开始答题，使用筛选后的真实题目
  const questions = currentQuiz.questions.length > 0
    ? currentQuiz.questions
    : filteredQuestions

  const currentIndex = currentQuiz.currentIndex
  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length

  // 当前选中的答案
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  // 是否已提交当前题目
  const [isSubmitted, setIsSubmitted] = useState(false)

  /** 选择答案 */
  const handleSelectOption = (label: string) => {
    if (isSubmitted) return
    setSelectedAnswer(label)
  }

  /** 提交当前题目 */
  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return

    setIsSubmitted(true)
    answerQuestion(currentQuestion.id, selectedAnswer)

    // 如果答错，加入错题本
    if (selectedAnswer !== currentQuestion.answer) {
      addWrongQuestion(currentQuestion, selectedAnswer)
    }
  }

  /** 下一题 */
  const handleNext = () => {
    if (currentIndex + 1 >= totalQuestions) {
      // 最后一题，完成答题
      finishQuiz()
      navigate('/quiz/result')
    } else {
      // 下一题
      setSelectedAnswer(null)
      setIsSubmitted(false)
      useStore.setState((s) => ({
        currentQuiz: { ...s.currentQuiz, currentIndex: currentIndex + 1 },
      }))
    }
  }

  // 初始化答题（仅在首次进入时，使用筛选后的真实题目）
  if (currentQuiz.questions.length === 0) {
    startQuiz(filteredQuestions)
  }

  if (!currentQuestion) return null

  // 进度百分比
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-[#131f24]">
      <div className="max-w-[430px] mx-auto px-5 pt-8 pb-6">
        {/* 顶部进度条 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => navigate('/')}
              className="text-white/60 hover:text-white text-sm"
            >
              ✕ 退出
            </button>
            <span className="text-white/60 text-sm font-medium">
              {currentIndex + 1}/{totalQuestions}
            </span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-[#58CC02] rounded-full transition-all duration-500"
            />
          </div>
        </div>

        {/* 题目卡片 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={totalQuestions}
            />

            {/* 选项列表 */}
            <div className="mt-4 space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.label
                const isCorrectAnswer =
                  isSubmitted && option.label === currentQuestion.answer
                const isWrongAnswer =
                  isSubmitted && isSelected && option.label !== currentQuestion.answer

                return (
                  <OptionItem
                    key={option.label}
                    label={option.label}
                    text={option.text}
                    selected={isSelected}
                    correct={isCorrectAnswer}
                    wrong={isWrongAnswer}
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(option.label)}
                  />
                )
              })}
            </div>

            {/* 解析（答题后显示） */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100"
              >
                <p className="text-sm font-bold text-blue-600 mb-1">解析</p>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 底部按钮 */}
        <div className="mt-6">
          {!isSubmitted ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`w-full py-4 rounded-2xl text-base font-bold transition-all ${
                selectedAnswer
                  ? 'bg-[#58CC02] text-white shadow-lg shadow-[#58CC02]/30 active:bg-[#46a302]'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              确认答案
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="w-full py-4 rounded-2xl text-base font-bold bg-[#58CC02] text-white shadow-lg shadow-[#58CC02]/30 active:bg-[#46a302]"
            >
              {currentIndex + 1 >= totalQuestions ? '查看结果' : '下一题'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
