/**
 * 选项组件
 * A/B/C/D 选项，支持选中、正确、错误状态
 */
import { motion } from 'framer-motion'

interface OptionItemProps {
  label: string       // A / B / C / D
  text: string        // 选项内容
  selected: boolean   // 是否被选中
  correct?: boolean   // 是否为正确答案（答题后显示）
  wrong?: boolean     // 是否为错误选择（答题后显示）
  disabled: boolean   // 是否禁用交互
  onClick: () => void
}

export default function OptionItem({
  label,
  text,
  selected,
  correct,
  wrong,
  disabled,
  onClick,
}: OptionItemProps) {
  // 根据状态确定边框和背景色
  let borderClass = 'border-gray-200 bg-white hover:border-[#58CC02]/50'
  let labelClass = 'bg-gray-100 text-gray-500'

  if (selected && !correct && !wrong) {
    borderClass = 'border-[#1CB0F6] bg-[#1CB0F6]/5'
    labelClass = 'bg-[#1CB0F6] text-white'
  }
  if (correct) {
    borderClass = 'border-[#58CC02] bg-[#58CC02]/10'
    labelClass = 'bg-[#58CC02] text-white'
  }
  if (wrong) {
    borderClass = 'border-[#FF4B4B] bg-[#FF4B4B]/10'
    labelClass = 'bg-[#FF4B4B] text-white'
  }

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${borderClass} ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      {/* 选项标签 A/B/C/D */}
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${labelClass}`}
      >
        {label}
      </span>

      {/* 选项文字 */}
      <span className="text-sm font-medium text-gray-700 text-left flex-1">
        {text}
      </span>

      {/* 正确/错误图标 */}
      {correct && (
        <span className="text-[#58CC02] text-lg font-bold">✓</span>
      )}
      {wrong && (
        <span className="text-[#FF4B4B] text-lg font-bold">✗</span>
      )}
    </motion.button>
  )
}
