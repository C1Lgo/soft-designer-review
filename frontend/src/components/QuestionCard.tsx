/**
 * 题目卡片组件
 * 显示题型标签和题目文字
 * 白色背景卡片，圆角 16px，阴影
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
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
      {/* 题型标签 */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 bg-[#e3f2fd] text-[#1976d2] text-xs font-bold rounded-full">
          {typeLabels[question.type] || '选择题'}
        </span>
      </div>

      {/* 题目文字 */}
      <p className="text-base font-medium text-gray-800 leading-[1.6]">
        {question.text}
      </p>
    </div>
  )
}
