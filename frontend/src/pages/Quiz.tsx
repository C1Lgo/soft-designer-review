/**
 * 答题页面
 * 顶部进度条 + 题号，题目卡片，选项列表，底部按钮
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '@/store/useStore'
import QuestionCard from '@/components/QuestionCard'
import OptionItem from '@/components/OptionItem'
import type { Question } from '@/types'

/** 模拟题目数据 */
const mockQuestions: Question[] = [
  {
    id: 'q1',
    chapterId: 'ch02',
    type: 'single',
    text: '以下哪种数据结构遵循"先进后出"（FILO）的原则？',
    options: [
      { label: 'A', text: '队列' },
      { label: 'B', text: '栈' },
      { label: 'C', text: '链表' },
      { label: 'D', text: '哈希表' },
    ],
    answer: 'B',
    explanation: '栈（Stack）是一种后进先出（LIFO）的数据结构，最后压入的元素最先被弹出。',
  },
  {
    id: 'q2',
    chapterId: 'ch02',
    type: 'single',
    text: '二叉树中，每个节点最多有几个子节点？',
    options: [
      { label: 'A', text: '1个' },
      { label: 'B', text: '2个' },
      { label: 'C', text: '3个' },
      { label: 'D', text: '没有限制' },
    ],
    answer: 'B',
    explanation: '二叉树中每个节点最多有2个子节点，分别称为左子节点和右子节点。',
  },
  {
    id: 'q3',
    chapterId: 'ch02',
    type: 'single',
    text: '快速排序的平均时间复杂度是？',
    options: [
      { label: 'A', text: 'O(n)' },
      { label: 'B', text: 'O(n log n)' },
      { label: 'C', text: 'O(n²)' },
      { label: 'D', text: 'O(log n)' },
    ],
    answer: 'B',
    explanation: '快速排序的平均时间复杂度为 O(n log n)，是实践中最常用的排序算法之一。',
  },
  {
    id: 'q4',
    chapterId: 'ch02',
    type: 'judge',
    text: '数组在内存中的存储是连续的。',
    options: [
      { label: 'A', text: '正确' },
      { label: 'B', text: '错误' },
    ],
    answer: 'A',
    explanation: '数组在内存中占用一段连续的存储空间，这也是数组支持随机访问的原因。',
  },
  {
    id: 'q5',
    chapterId: 'ch02',
    type: 'single',
    text: '以下哪种算法不是图的最短路径算法？',
    options: [
      { label: 'A', text: 'Dijkstra算法' },
      { label: 'B', text: 'Floyd算法' },
      { label: 'C', text: 'Kruskal算法' },
      { label: 'D', text: 'Bellman-Ford算法' },
    ],
    answer: 'C',
    explanation: 'Kruskal算法是最小生成树算法，不是最短路径算法。',
  },
]

export default function Quiz() {
  const navigate = useNavigate()
  const { currentQuiz, startQuiz, answerQuestion, finishQuiz, addWrongQuestion } =
    useStore()

  // 如果没有开始答题，初始化模拟题目
  const questions = currentQuiz.questions.length > 0
    ? currentQuiz.questions
    : mockQuestions

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

  // 初始化答题（仅在首次进入时）
  if (currentQuiz.questions.length === 0) {
    startQuiz(mockQuestions)
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
