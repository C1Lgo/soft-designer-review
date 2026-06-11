/**
 * 学习路径节点组件
 * 显示章节图标、标题、进度条，支持三种状态：已完成、当前进行中、未解锁
 * 当前进行中节点带脉冲动画效果
 * 使用内联 SVG 图标（stroke-based，currentColor）
 */
import { motion } from 'framer-motion'
import type { Chapter } from '@/types'

/** 已完成图标 - Checkmark */
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
)

/** 当前学习图标 - BookOpen */
const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
)

/** 锁定图标 - Lock */
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)

interface PathNodeProps {
  chapter: Chapter
  index: number
  isLast: boolean
  onClick: () => void
}

export default function PathNode({ chapter, index, isLast, onClick }: PathNodeProps) {
  const isLocked = chapter.status === 'locked'
  const isCompleted = chapter.status === 'completed'
  const isCurrent = chapter.status === 'current'

  // 根据状态获取图标组件和样式
  const getNodeInfo = () => {
    if (isCompleted) {
      return {
        Icon: CheckIcon,
        bgColor: 'bg-[#58CC02]',
        textColor: 'text-white',
      }
    } else if (isCurrent) {
      return {
        Icon: BookOpenIcon,
        bgColor: 'bg-[#FF9600]',
        textColor: 'text-white',
      }
    } else {
      return {
        Icon: LockIcon,
        bgColor: 'bg-[#e0e0e0]',
        textColor: 'text-[#9e9e9e]',
      }
    }
  }

  const { Icon, bgColor, textColor } = getNodeInfo()

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="relative"
    >
      {/* 节点之间的连接线 - 灰色竖线 */}
      {!isLast && (
        <div className="absolute left-[22px] top-[48px] w-[2px] h-[calc(100%-24px)] bg-[#e0e0e0]" />
      )}

      <button
        onClick={onClick}
        disabled={isLocked}
        className={`w-full flex items-start gap-3 py-3 transition-all ${
          isLocked
            ? 'opacity-60 cursor-not-allowed'
            : 'cursor-pointer hover:bg-gray-50/50'
        }`}
      >
        {/* 左侧圆形图标 */}
        <div className="relative shrink-0">
          {/* 脉冲动画环 - 仅当前进行中节点显示 */}
          {isCurrent && (
            <div className={`absolute inset-0 rounded-full ${bgColor} animate-pulse-ring opacity-30`} />
          )}

          {/* 图标容器 */}
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center ${bgColor} ${textColor} relative z-10 shadow-sm`}
          >
            <Icon />
          </div>
        </div>

        {/* 中间：章节信息 */}
        <div className="flex-1 pt-1 text-left">
          {/* 章节标题 */}
          <h3
            className={`text-[15px] font-bold mb-0.5 ${
              isLocked ? 'text-[#9e9e9e]' : 'text-gray-800'
            }`}
          >
            {chapter.title}
          </h3>

          {/* 章节描述 */}
          <p className={`text-xs mb-2 ${isLocked ? 'text-[#bdbdbd]' : 'text-gray-500'}`}>
            {chapter.description}
          </p>

          {/* 进度条 - 仅非锁定状态显示 */}
          {!isLocked && (
            <div className="flex items-center gap-2">
              {/* 进度条背景 */}
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                {/* 进度条填充 */}
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-[#58CC02]' : 'bg-[#58CC02]'
                  }`}
                  style={{ width: `${chapter.progress}%` }}
                />
              </div>
              {/* 进度文字 */}
              <span className="text-xs text-gray-400 font-medium">
                {chapter.completedQuestions}/{chapter.totalQuestions}
              </span>
            </div>
          )}
        </div>
      </button>
    </motion.div>
  )
}
