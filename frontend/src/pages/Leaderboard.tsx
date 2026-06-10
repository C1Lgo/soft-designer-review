/**
 * 排行榜页面
 * 橙色渐变 header，标签切换，排名列表
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from '@/components/BottomNav'
import type { LeaderboardUser } from '@/types'

/** 模拟排行榜数据 */
const mockLeaderboard: Record<string, LeaderboardUser[]> = {
  friends: [
    { id: '1', username: '学霸小明', streak: 30, xp: 5800, rank: 1 },
    { id: '2', username: '努力的小红', streak: 25, xp: 5200, rank: 2 },
    { id: '3', username: '学习者', streak: 12, xp: 3200, rank: 3 },
    { id: '4', username: '坚持到底', streak: 8, xp: 2800, rank: 4 },
    { id: '5', username: '天天向上', streak: 5, xp: 2100, rank: 5 },
  ],
  national: [
    { id: '10', username: '清华学霸', streak: 120, xp: 28000, rank: 1 },
    { id: '11', username: '北大才子', streak: 98, xp: 25000, rank: 2 },
    { id: '12', username: '浙大精英', streak: 85, xp: 22000, rank: 3 },
    { id: '13', username: '上交大神', streak: 72, xp: 19500, rank: 4 },
    { id: '14', username: '复旦之星', streak: 60, xp: 18000, rank: 5 },
  ],
  weekly: [
    { id: '20', username: '本周之星', streak: 7, xp: 1200, rank: 1 },
    { id: '21', username: '冲刺达人', streak: 7, xp: 1100, rank: 2 },
    { id: '22', username: '学习者', streak: 5, xp: 980, rank: 3 },
    { id: '23', username: '进步飞快', streak: 4, xp: 850, rank: 4 },
    { id: '24', username: '新手上路', streak: 3, xp: 600, rank: 5 },
  ],
}

/** 标签页类型 */
type TabType = 'friends' | 'national' | 'weekly'

const tabs: { key: TabType; label: string }[] = [
  { key: 'friends', label: '好友' },
  { key: 'national', label: '全国' },
  { key: 'weekly', label: '周榜' },
]

/** 奖牌映射 */
const medalMap: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
}

/** 头像颜色映射 */
const avatarColors = [
  'bg-[#FF9600]',
  'bg-[#1CB0F6]',
  'bg-[#CE82FF]',
  'bg-[#58CC02]',
  'bg-[#FF4B4B]',
]

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<TabType>('friends')
  const users = mockLeaderboard[activeTab]

  return (
    <div className="min-h-screen bg-[#131f24] pb-20">
      <div className="max-w-[430px] mx-auto">
        {/* 橙色渐变 Header */}
        <div className="bg-gradient-to-b from-[#FF9600] to-[#e08600] px-5 pt-12 pb-8 rounded-b-3xl text-center">
          <h1 className="text-white text-2xl font-bold mb-1">排行榜</h1>
          <p className="text-white/80 text-sm">与小伙伴们一较高下</p>
        </div>

        {/* 标签切换 */}
        <div className="px-5 -mt-4 mb-4">
          <div className="flex bg-gray-800 rounded-xl p-1 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#FF9600] text-white shadow-lg'
                    : 'text-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 排名列表 */}
        <div className="px-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={`flex items-center gap-3 p-4 rounded-2xl ${
                    user.rank <= 3
                      ? 'bg-white shadow-md'
                      : 'bg-gray-800/50'
                  }`}
                >
                  {/* 排名/奖牌 */}
                  <div className="w-10 text-center">
                    {medalMap[user.rank] ? (
                      <span className="text-2xl">{medalMap[user.rank]}</span>
                    ) : (
                      <span className="text-lg font-bold text-gray-400">
                        {user.rank}
                      </span>
                    )}
                  </div>

                  {/* 头像 */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                      avatarColors[index % avatarColors.length]
                    }`}
                  >
                    {user.username[0]}
                  </div>

                  {/* 用户信息 */}
                  <div className="flex-1">
                    <p
                      className={`text-sm font-bold ${
                        user.rank <= 3 ? 'text-gray-800' : 'text-gray-300'
                      }`}
                    >
                      {user.username}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">
                        🔥 {user.streak}天
                      </span>
                    </div>
                  </div>

                  {/* XP 分数 */}
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        user.rank <= 3 ? 'text-[#FF9600]' : 'text-gray-400'
                      }`}
                    >
                      {user.xp.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">XP</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 底部导航栏 */}
      <BottomNav />
    </div>
  )
}
