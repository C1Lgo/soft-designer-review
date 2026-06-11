/**
 * 首页 - 学习路径
 * 重新设计的首页，包含绿色渐变 Header、学习路径列表、底部导航栏
 * Web 端在手机框架内显示，移动端全屏显示
 */
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* 可滚动内容区域 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {/* 顶部绿色渐变 Header */}
        <div className="bg-gradient-to-b from-[#58CC02] to-[#45a501] px-4 pt-6 pb-6 rounded-b-3xl">
          {/* 第一行：用户头像、连胜天数、宝石数量 */}
          <div className="flex items-center justify-between mb-4">
            {/* 用户头像 - SVG user circle 图标 */}
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#58CC02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>

            {/* 连胜和宝石 - 白色背景 + 彩色文字 + 阴影 */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white rounded-lg px-2.5 py-1 shadow-sm">
                <span className="text-sm">🔥</span>
                <span className="text-[#FF9600] font-bold text-xs">{user.streak || 12}天</span>
              </div>
              <div className="flex items-center gap-1 bg-white rounded-lg px-2.5 py-1 shadow-sm">
                <span className="text-sm">💎</span>
                <span className="text-[#1CB0F6] font-bold text-xs">{user.gems || 258}</span>
              </div>
            </div>
          </div>

          {/* 第二行：大标题和副标题 */}
          <div className="text-center">
            <h1 className="text-white font-bold text-[26px] tracking-wide mb-1">软件设计师</h1>
            <p className="text-white/60 text-sm">今日已学习 15 分钟</p>
          </div>
        </div>

        {/* 学习路径区域 */}
        <div className="bg-white px-4 py-5">
          <h2 className="text-gray-800 font-bold text-base mb-4">学习路径</h2>
          <div className="space-y-0">
            {chaptersWithProgress.map((chapter, index) => (
              <PathNode
                key={chapter.id}
                chapter={chapter}
                index={index}
                isLast={index === chaptersWithProgress.length - 1}
                onClick={() => handleChapterClick(chapter.id)}
              />
            ))}
          </div>
        </div>

        {/* 底部留白，避免内容被导航栏遮挡 */}
        <div className="h-20" />
      </div>

      {/* 底部导航栏 */}
      <BottomNav />
    </div>
  )
}
