/**
 * 答题结果页面
 * 绿色渐变 header，统计卡片，经验值进度条，操作按钮
 */
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import StatCard from '@/components/StatCard'

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

  return (
    <div className="min-h-screen bg-[#131f24]">
      <div className="max-w-[430px] mx-auto">
        {/* 绿色渐变 Header */}
        <div className="bg-gradient-to-b from-[#58CC02] to-[#46a302] px-5 pt-12 pb-10 rounded-b-3xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="text-6xl mb-3"
          >
            🎉
          </motion.div>
          <h1 className="text-white text-2xl font-bold mb-1">答题完成！</h1>
          <p className="text-white/80 text-sm">
            获得 <span className="font-bold text-yellow-200">+{xpGained} XP</span>
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="px-5 -mt-6">
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              label="正确率"
              value={`${accuracy}%`}
              icon="🎯"
              delay={0.3}
            />
            <StatCard
              label="正确数"
              value={`${correctCount}/${totalQuestions}`}
              icon="✅"
              delay={0.4}
            />
            <StatCard
              label="最大连对"
              value={`${maxStreak}`}
              icon="🔥"
              delay={0.5}
            />
          </div>
        </div>

        {/* 经验值进度 */}
        <div className="px-5 mt-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">
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
                transition={{ duration: 1.5, delay: 0.6 }}
                className="h-full bg-gradient-to-r from-[#58CC02] to-[#46a302] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="px-5 mt-6 space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl text-base font-bold bg-[#58CC02] text-white shadow-lg shadow-[#58CC02]/30 active:bg-[#46a302]"
          >
            继续学习
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleReview}
            className="w-full py-4 rounded-2xl text-base font-bold bg-white text-[#58CC02] border-2 border-[#58CC02] active:bg-gray-50"
          >
            查看解析
          </motion.button>
        </div>
      </div>
    </div>
  )
}
