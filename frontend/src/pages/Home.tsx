/**
 * 首页 - 学习路径
 * 顶部绿色渐变 header，显示用户头像、连胜天数、宝石
 * 学习路径列表，底部导航栏
 */
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import { chapters } from '@/data/chapters'
import PathNode from '@/components/PathNode'
import BottomNav from '@/components/BottomNav'

export default function Home() {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)

  /** 点击章节节点 */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChapterClick = (_chapterId: string) => {
    navigate('/quiz')
  }

  return (
    <div className="min-h-screen bg-[#131f24] pb-20">
      <div className="max-w-[430px] mx-auto">
        {/* 顶部绿色渐变 Header */}
        <div className="bg-gradient-to-b from-[#58CC02] to-[#46a302] px-5 pt-12 pb-8 rounded-b-3xl">
          {/* 用户信息栏 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* 头像 */}
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl border-2 border-white/40">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>😊</span>
                )}
              </div>
              <div>
                <p className="text-white font-bold text-base">{user.username}</p>
                <p className="text-white/70 text-xs">Lv.{user.level}</p>
              </div>
            </div>

            {/* 连胜和宝石 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1.5">
                <span className="text-base">🔥</span>
                <span className="text-white font-bold text-sm">{user.streak}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1.5">
                <span className="text-base">💎</span>
                <span className="text-white font-bold text-sm">{user.gems}</span>
              </div>
            </div>
          </div>

          {/* 经验值进度条 */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(user.xp / user.xpToNextLevel) * 100}%`,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <p className="text-white/70 text-xs mt-1 text-right">
            {user.xp}/{user.xpToNextLevel} XP
          </p>
        </div>

        {/* 学习路径列表 */}
        <div className="px-5 pt-6 space-y-6">
          <h2 className="text-white font-bold text-lg">学习路径</h2>
          <div className="space-y-3">
            {chapters.map((chapter, index) => (
              <PathNode
                key={chapter.id}
                chapter={chapter}
                index={index}
                onClick={() => handleChapterClick(chapter.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 底部导航栏 */}
      <BottomNav />
    </div>
  )
}
