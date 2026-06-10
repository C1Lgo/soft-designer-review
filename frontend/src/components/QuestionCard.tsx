/**
 * 题目卡片组件
 * 显示题型标签和题目文字
 */
import type { Question } from '@/types'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
}

/** 题型标签映射 */
const typeLabels: Record<string, string> = {
  single: '单选题',
  multiple: '多选题',
  judge: '判断题',
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* 题号和题型标签 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-bold text-gray-400">
          {questionNumber}/{totalQuestions}
        </span>
        <span className="px-2 py-0.5 bg-[#58CC02]/10 text-[#58CC02] text-xs font-bold rounded-full">
          {typeLabels[question.type] || '选择题'}
        </span>
      </div>

      {/* 题目文字 */}
      <p className="text-base font-medium text-gray-800 leading-relaxed">
        {question.text}
      </p>
    </div>
  )
}
