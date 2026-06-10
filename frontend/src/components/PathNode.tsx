/**
 * 学习路径节点组件
 * 显示章节图标、标题、进度条
 */
import { motion } from 'framer-motion'
import type { Chapter } from '@/types'

interface PathNodeProps {
  chapter: Chapter
  index: number
  onClick: () => void
}

export default function PathNode({ chapter, index, onClick }: PathNodeProps) {
  const isLocked = chapter.status === 'locked'
  const isCompleted = chapter.status === 'completed'
  const isCurrent = chapter.status === 'current'

  // 节点图标样式
  let nodeStyle = 'bg-gray-200 text-gray-400'
  let iconExtra = ''
  if (isCompleted) {
    nodeStyle = 'bg-[#58CC02] text-white'
    iconExtra = '✓'
  } else if (isCurrent) {
    nodeStyle = 'bg-[#FF9600] text-white animate-pulse'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* 连接线 */}
      {index > 0 && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-200" />
      )}

      <button
        onClick={onClick}
        disabled={isLocked}
        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
          isLocked
            ? 'bg-gray-50 opacity-60 cursor-not-allowed'
            : isCurrent
            ? 'bg-white shadow-md border-2 border-[#FF9600]/30 cursor-pointer hover:shadow-lg'
            : 'bg-white shadow-sm border border-gray-100 cursor-pointer hover:shadow-md'
        }`}
      >
        {/* 章节图标 */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${nodeStyle}`}
        >
          {isCompleted ? iconExtra : isLocked ? '🔒' : chapter.icon}
        </div>

        {/* 章节信息 */}
        <div className="flex-1 text-left">
          <h3
            className={`text-sm font-bold mb-0.5 ${
              isLocked ? 'text-gray-400' : 'text-gray-800'
            }`}
          >
            {chapter.title}
          </h3>
          <p className="text-xs text-gray-400 mb-2">{chapter.description}</p>

          {/* 进度条 */}
          {!isLocked && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted
                      ? 'bg-[#58CC02]'
                      : 'bg-[#FF9600]'
                  }`}
                  style={{ width: `${chapter.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {chapter.completedQuestions}/{chapter.totalQuestions}
              </span>
            </div>
          )}
        </div>

        {/* 右侧箭头 */}
        {!isLocked && (
          <span className="text-gray-300 text-lg">›</span>
        )}
      </button>
    </motion.div>
  )
}
