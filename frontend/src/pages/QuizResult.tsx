/**
 * 答题结果页面
 * 绿色渐变 header，统计卡片，经验值进度条，操作按钮
 */
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useStore from '@/store/useStore'

export default function QuizResult() {
  const navigate = useNavigate()
  const { currentQuiz, user, resetQuiz } = useStore()

  const { correctCount, questions, maxStreak, xpGained } = currentQuiz
  const totalQuestions = questions.length
  const accuracy = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0

  /** 继续学习 */
  const handleContinue = () => {
    resetQuiz()
    navigate('/')
  }

  /** 查看解析 */
  const handleReview = () => {
    navigate('/review')
  }

  /** 分享成绩 */
  const handleShare = () => {
    // 复制成绩到剪贴板
    const shareText = `我在SOLO完成了${totalQuestions}道题目，正确率${accuracy}%，获得了+${xpGained} XP！`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('成绩已复制到剪贴板！')
      })
    } else {
      alert(shareText)
    }
  }

  // 升级所需 XP
  const xpNeeded = user.xpToNextLevel - user.xp

  return (
    <div className="h-full flex flex-col bg-[#f5f5f5]">
      <div className="flex-1 overflow-y-auto">
        {/* 顶部庆祝区域：绿色渐变背景 */}
        <div className="bg-gradient-to-b from-[#58CC02] to-[#45a501] px-5 pt-12 pb-12 rounded-b-[32px] text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="text-6xl mb-3"
          >
            🎉
          </motion.div>
          <h1 className="text-white text-2xl font-bold mb-2">练习完成！</h1>
          <p className="text-white/90 text-base">
            获得 <span className="font-bold text-yellow-200 text-lg">+{xpGained} XP</span>
          </p>
        </div>

        {/* 统计卡片区域：3个卡片横向排列 */}
        <div className="px-5 -mt-8">
          <div className="grid grid-cols-3 gap-3">
            {/* 正确数 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 shadow-md text-center"
            >
              <p className="text-2xl font-bold text-[#58CC02] mb-1">
                {correctCount}/{totalQuestions}
              </p>
              <p className="text-xs text-gray-400">正确率</p>
            </motion.div>

            {/* 准确率 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-4 shadow-md text-center"
            >
              <p className="text-2xl font-bold text-[#58CC02] mb-1">
                {accuracy}%
              </p>
              <p className="text-xs text-gray-400">准确率</p>
            </motion.div>

            {/* 连对数 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-4 shadow-md text-center"
            >
              <p className="text-2xl font-bold text-[#58CC02] mb-1">
                {maxStreak}
              </p>
              <p className="text-xs text-gray-400">连对数</p>
            </motion.div>
          </div>
        </div>

        {/* XP 进度区域 */}
        <div className="px-5 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-5 shadow-md"
          >
            <p className="text-sm font-bold text-gray-700 mb-3">经验值进度</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[#58CC02]">
                Lv.{user.level}
              </span>
              <span className="text-sm text-gray-400">
                {user.xp}/{user.xpToNextLevel} XP
              </span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(user.xp / user.xpToNextLevel) * 100}%`,
                }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="h-full bg-gradient-to-r from-[#58CC02] to-[#45a501] rounded-full"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              距离升级还需 {xpNeeded} XP
            </p>
          </motion.div>
        </div>

        {/* 操作按钮区域 - 固定在底部不随内容滚动 */}
        <div className="shrink-0 px-5 mt-6 space-y-3 pb-8">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl text-base font-bold bg-[#58CC02] text-white shadow-lg shadow-[#58CC02]/30 active:bg-[#45a501]"
          >
            继续学习
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleReview}
            className="w-full py-4 rounded-2xl text-base font-bold bg-white text-gray-700 border-2 border-gray-200 active:bg-gray-50"
          >
            查看解析
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="w-full py-4 rounded-2xl text-base font-bold bg-white text-gray-700 border-2 border-gray-200 active:bg-gray-50"
          >
            分享成绩
          </motion.button>
        </div>
      </div>
    </div>
  )
}
