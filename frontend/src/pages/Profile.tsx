/**
 * 个人中心页面
 * 蓝色渐变 header，统计卡片，菜单列表
 */
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import StatCard from '@/components/StatCard'
import BottomNav from '@/components/BottomNav'

/** 菜单项配置 */
const menuItems = [
  { icon: '📊', label: '学习统计', path: '/profile' },
  { icon: '🏅', label: '成就徽章', path: '/profile' },
  { icon: '❌', label: '错题本', path: '/review' },
  { icon: '⏰', label: '学习提醒', path: '/profile' },
  { icon: '⚙️', label: '设置', path: '/profile' },
]

export default function Profile() {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)

  return (
    <div className="min-h-screen bg-[#131f24] pb-20">
      <div className="max-w-[430px] mx-auto">
        {/* 蓝色渐变 Header */}
        <div className="bg-gradient-to-b from-[#1CB0F6] to-[#0d8fd6] px-5 pt-12 pb-10 rounded-b-3xl text-center">
          {/* 头像 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl mx-auto mb-3 border-3 border-white/40"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>😊</span>
            )}
          </motion.div>
          <h1 className="text-white text-xl font-bold">{user.username}</h1>
          <p className="text-white/70 text-sm mt-0.5">Lv.{user.level}</p>
        </div>

        {/* 统计卡片 */}
        <div className="px-5 -mt-6">
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              label="连胜天数"
              value={`${user.streak}`}
              icon="🔥"
              delay={0.2}
            />
            <StatCard
              label="总答题数"
              value={`${user.totalQuestions}`}
              icon="📝"
              delay={0.3}
            />
            <StatCard
              label="正确率"
              value={`${Math.round(user.correctRate * 100)}%`}
              icon="🎯"
              delay={0.4}
            />
          </div>
        </div>

        {/* 经验值进度 */}
        <div className="px-5 mt-5">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">
                等级 {user.level}
              </span>
              <span className="text-xs text-gray-400">
                {user.xp}/{user.xpToNextLevel} XP
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(user.xp / user.xpToNextLevel) * 100}%`,
                }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-[#1CB0F6] to-[#0d8fd6] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* 菜单列表 */}
        <div className="px-5 mt-5">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1 text-sm font-medium text-gray-700 text-left">
                  {item.label}
                </span>
                <span className="text-gray-300 text-lg">›</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* 底部导航栏 */}
      <BottomNav />
    </div>
  )
}
