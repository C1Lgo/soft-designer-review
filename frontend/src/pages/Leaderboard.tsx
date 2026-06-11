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

/** 当前用户ID（用于高亮显示） */
const CURRENT_USER_ID = '3'

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

/** 头像渐变色映射 */
const avatarGradients = [
  'from-[#FF9600] to-[#f57c00]',
  'from-[#1CB0F6] to-[#1976d2]',
  'from-[#CE82FF] to-[#9c27b0]',
  'from-[#58CC02] to-[#388e3c]',
  'from-[#FF4B4B] to-[#d32f2f]',
]

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<TabType>('friends')
  const users = mockLeaderboard[activeTab]

  return (
    <div className="h-full flex flex-col bg-[#f5f5f5]">
      <div className="flex-1 overflow-y-auto">
        {/* 橙色渐变 Header */}
        <div className="bg-gradient-to-b from-[#FF9600] to-[#f57c00] px-5 pt-12 pb-8 rounded-b-3xl text-center">
          <h1 className="text-white text-2xl font-bold mb-1">🏆 排行榜</h1>
          <p className="text-white/80 text-sm">本周学习达人</p>
        </div>

        {/* 标签切换区域 - 白色卡片容器 */}
        <div className="px-5 -mt-4 mb-4">
          <div className="bg-white rounded-xl shadow-md p-1.5">
            <div className="flex bg-gray-100 rounded-[10px] p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2.5 rounded-[10px] text-sm font-bold transition-all ${
                    activeTab === tab.key
                      ? 'bg-[#FF9600] text-white shadow-lg'
                      : 'bg-transparent text-gray-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
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
                  className={`flex items-center gap-3 p-4 rounded-xl ${
                    user.id === CURRENT_USER_ID
                      ? 'bg-[#fffde7] shadow-sm'
                      : 'bg-white shadow-sm'
                  }`}
                >
                  {/* 排名/奖牌 */}
                  <div className="w-10 text-center shrink-0">
                    {medalMap[user.rank] ? (
                      <span className="text-2xl">{medalMap[user.rank]}</span>
                    ) : (
                      <span className="text-lg font-bold text-gray-400">
                        {user.rank}
                      </span>
                    )}
                  </div>

                  {/* 头像 - 40px圆形，渐变色背景，显示姓氏 */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 bg-gradient-to-br ${
                      avatarGradients[index % avatarGradients.length]
                    }`}
                  >
                    {user.username[0]}
                  </div>

                  {/* 用户信息 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-gray-800 truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      🔥 {user.streak}天连胜
                    </p>
                  </div>

                  {/* XP 分数 */}
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-[#FF9600]">
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
