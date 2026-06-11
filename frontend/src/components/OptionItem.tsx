/**
 * 选项组件
 * A/B/C/D 选项，支持选中、正确、错误状态
 * 悬停/点击：边框变绿色，背景变浅绿
 * 选中后：正确显示绿色，错误显示红色
 * 添加动画效果（framer-motion whileTap）
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
  // 根据状态确定边框、背景和标签样式
  let containerClass = 'border-gray-200 bg-white hover:border-[#58CC02] hover:bg-[#f1f8e9]'
  let labelClass = 'bg-gray-200 text-gray-600'
  let textClass = 'text-gray-700'
  let icon: React.ReactNode = null

  if (selected && !correct && !wrong) {
    // 已选中但未提交
    containerClass = 'border-[#58CC02] bg-[#f1f8e9]'
    labelClass = 'bg-[#58CC02] text-white'
  }

  if (correct) {
    // 正确答案
    containerClass = 'border-[#58CC02] bg-[#e8f5e9]'
    labelClass = 'bg-[#58CC02] text-white'
    textClass = 'text-[#2e7d32]'
    icon = (
      <span className="text-[#58CC02] text-xl font-bold flex items-center justify-center w-6 h-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </span>
    )
  }

  if (wrong) {
    // 错误答案
    containerClass = 'border-[#FF4B4B] bg-[#ffebee]'
    labelClass = 'bg-[#FF4B4B] text-white'
    textClass = 'text-[#c62828]'
    icon = (
      <span className="text-[#FF4B4B] text-xl font-bold flex items-center justify-center w-6 h-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </span>
    )
  }

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 py-[14px] px-4 rounded-xl border-2 transition-all duration-200 ${containerClass} ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      {/* 选项标签 A/B/C/D（圆形） */}
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors duration-200 ${labelClass}`}
      >
        {label}
      </span>

      {/* 选项文字 */}
      <span className={`text-sm font-medium text-left flex-1 transition-colors duration-200 ${textClass}`}>
        {text}
      </span>

      {/* 正确/错误图标 */}
      {icon}
    </motion.button>
  )
}
