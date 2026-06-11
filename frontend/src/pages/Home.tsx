/**
 * 首页 - 学习路径
 * 顶部绿色渐变 header，显示用户头像、连胜天数、宝石
 * 学习路径列表，底部导航栏
 * 章节进度根据用户答题记录动态计算
 */
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import { chapters } from '@/data/chapters'
import { allQuestions } from '@/data/questions'
import PathNode from '@/components/PathNode'
import BottomNav from '@/components/BottomNav'

export default function Home() {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)
  const wrongQuestions = useStore((s) => s.wrongQuestions)

  // 根据用户答题记录动态计算各章节进度
  const chaptersWithProgress = useMemo(() => {
    // 收集所有已答过的题目 ID（来自错题记录中的题目）
    const answeredIds = new Set(wrongQuestions.map((wq) => wq.question.id))

    return chapters.map((chapter) => {
      // 该章节在题库中的总题数
      const totalInBank = allQuestions.filter(
        (q) => q.chapterId === chapter.id
      ).length
      // 已答题数（基于错题记录推算）
      const answered = allQuestions.filter(
        (q) => q.chapterId === chapter.id && answeredIds.has(q.id)
      ).length

      // 动态计算进度和状态
      const progress = totalInBank > 0 ? Math.round((answered / totalInBank) * 100) : 0
      const status: 'completed' | 'current' | 'locked' =
        progress >= 100
          ? 'completed'
          : progress > 0
            ? 'current'
            : chapter.status === 'completed'
              ? 'completed'
              : chapter.status

      return {
        ...chapter,
        totalQuestions: totalInBank,
        completedQuestions: answered,
        progress,
        status,
      }
    })
  }, [wrongQuestions])

  /** 点击章节节点，跳转到对应章节的答题页面 */
  const handleChapterClick = (chapterId: string) => {
    navigate(`/quiz?chapter=${chapterId}`)
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
            {chaptersWithProgress.map((chapter, index) => (
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
