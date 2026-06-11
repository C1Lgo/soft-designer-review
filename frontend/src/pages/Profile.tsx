/**
 * 个人中心页面
 * 蓝色渐变 header，统计卡片，菜单列表
 */
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import BottomNav from '@/components/BottomNav'

/** 菜单分组配置 */
const menuGroups = [
  {
    title: '学习数据',
    items: [
      {
        icon: '📊',
        label: '学习统计',
        path: '/profile',
        bgColor: 'bg-[#e8f5e9]',
      },
      {
        icon: '🏅',
        label: '成就徽章',
        path: '/profile',
        bgColor: 'bg-[#fff3e0]',
      },
      {
        icon: '❌',
        label: '错题本',
        path: '/review',
        bgColor: 'bg-[#e3f2fd]',
      },
    ],
  },
  {
    title: '设置',
    items: [
      {
        icon: '⏰',
        label: '学习提醒',
        path: '/profile',
        bgColor: 'bg-[#f3e5f5]',
      },
      {
        icon: '⚙️',
        label: '通用设置',
        path: '/profile',
        bgColor: 'bg-[#e8f5e9]',
      },
    ],
  },
]

export default function Profile() {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">
      <div className="max-w-[430px] mx-auto">
        {/* 蓝色渐变 Header */}
        <div className="bg-gradient-to-b from-[#1CB0F6] to-[#1976d2] px-5 pt-12 pb-10 rounded-b-3xl text-center">
          {/* 用户头像 - 80px圆形，白色背景，👨‍💻 emoji，阴影 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl mx-auto mb-3 shadow-lg"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>👨‍💻</span>
            )}
          </motion.div>

          {/* 昵称 - 20px粗体，白色 */}
          <h1 className="text-white text-xl font-bold">{user.username}</h1>

          {/* 等级 - 14px，白色半透明 */}
          <p className="text-white/70 text-sm mt-0.5">Lv.{user.level}</p>
        </div>

        {/* 统计卡片区域 - 3个卡片横向排列 */}
        <div className="px-5 -mt-6">
          <div className="grid grid-cols-3 gap-3">
            {/* 连胜天数 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-4 text-center"
            >
              <p className="text-2xl font-bold text-[#58CC02]">{user.streak}</p>
              <p className="text-xs text-gray-400 mt-1">连胜天数</p>
            </motion.div>

            {/* 总题数 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-4 text-center"
            >
              <p className="text-2xl font-bold text-[#58CC02]">{user.totalQuestions}</p>
              <p className="text-xs text-gray-400 mt-1">总题数</p>
            </motion.div>

            {/* 正确率 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-4 text-center"
            >
              <p className="text-2xl font-bold text-[#58CC02]">
                {Math.round(user.correctRate * 100)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">正确率</p>
            </motion.div>
          </div>
        </div>

        {/* 经验值进度 */}
        <div className="px-5 mt-5">
          <div className="bg-white rounded-xl p-4 shadow-md">
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
                className="h-full bg-gradient-to-r from-[#1CB0F6] to-[#1976d2] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* 菜单列表区域 */}
        <div className="px-5 mt-5 space-y-4">
          {menuGroups.map((group, groupIndex) => (
            <div key={group.title}>
              {/* 分组标题 */}
              <h2 className="text-sm font-bold text-gray-500 mb-2 px-1">
                {group.title}
              </h2>

              {/* 菜单项容器 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {group.items.map((item, itemIndex) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + groupIndex * 0.1 + itemIndex * 0.05 }}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                      itemIndex < group.items.length - 1
                        ? 'border-b border-gray-100'
                        : ''
                    }`}
                  >
                    {/* 左侧图标 - 36px方形圆角，不同颜色背景 */}
                    <div
                      className={`w-9 h-9 rounded-lg ${item.bgColor} flex items-center justify-center text-lg shrink-0`}
                    >
                      {item.icon}
                    </div>

                    {/* 中间文字 - 15px，深灰色 */}
                    <span className="flex-1 text-[15px] text-gray-700 text-left font-medium">
                      {item.label}
                    </span>

                    {/* 右侧箭头 - 灰色 */}
                    <span className="text-gray-400 text-lg">›</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部导航栏 */}
      <BottomNav />
    </div>
  )
}
