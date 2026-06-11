/**
 * 复习页面
 * 顶部标签切换：错题本 / 知识卡片
 */
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '@/store/useStore'
import BottomNav from '@/components/BottomNav'
import type { KnowledgeCard } from '@/types'

/** 模拟知识卡片数据 */
const mockKnowledgeCards: KnowledgeCard[] = [
  {
    id: 'kc1',
    chapterId: 'ch02',
    category: '数据结构',
    title: '栈的基本操作',
    content: '栈是一种后进先出（LIFO）的线性表，只允许在表尾进行插入和删除操作。基本操作包括：push（入栈）、pop（出栈）、peek（查看栈顶）、isEmpty（判空）。',
    mastered: true,
  },
  {
    id: 'kc2',
    chapterId: 'ch02',
    category: '数据结构',
    title: '队列的循环实现',
    content: '循环队列通过取模运算实现队列头尾的循环连接，有效利用数组空间。关键在于区分队空和队满的条件。',
    mastered: false,
    reviewDate: '2024-01-15',
  },
  {
    id: 'kc3',
    chapterId: 'ch02',
    category: '算法',
    title: '快速排序原理',
    content: '快速排序采用分治策略，选取一个基准元素，将数组分为小于和大于基准的两部分，递归排序。平均时间复杂度 O(n log n)。',
    mastered: false,
    reviewDate: '2024-01-14',
  },
  {
    id: 'kc4',
    chapterId: 'ch02',
    category: '算法',
    title: '二叉树遍历方式',
    content: '二叉树遍历分为：前序遍历（根-左-右）、中序遍历（左-根-右）、后序遍历（左-右-根）、层序遍历（逐层从左到右）。',
    mastered: true,
  },
]

/** 错题筛选标签 */
const filterTags = ['全部', '数据结构', '操作系统', '软件工程', '数据库', '网络基础']

/** 标签页类型 */
type TabType = 'wrong' | 'knowledge'

export default function Review() {
  const [activeTab, setActiveTab] = useState<TabType>('wrong')
  const [activeFilter, setActiveFilter] = useState('全部')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const { wrongQuestions } = useStore()

  /** 重新练习错题 */
  const handleRepractice = () => {
    window.location.href = '/quiz'
  }

  /** 去答题 */
  const handleGoQuiz = () => {
    window.location.href = '/quiz'
  }

  /** 筛选后的错题 */
  const filteredWrongQuestions = activeFilter === '全部'
    ? wrongQuestions
    : wrongQuestions.filter((wq) => wq.question.category === activeFilter)

  /** 切换到下一张知识卡片 */
  const handleNextCard = useCallback(() => {
    setCurrentCardIndex((prev) => (prev + 1) % mockKnowledgeCards.length)
  }, [])

  /** 切换到上一张知识卡片 */
  const handlePrevCard = useCallback(() => {
    setCurrentCardIndex((prev) => (prev - 1 + mockKnowledgeCards.length) % mockKnowledgeCards.length)
  }, [])

  /** 触摸滑动相关 */
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextCard()
      } else {
        handlePrevCard()
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">
      <div className="max-w-[430px] mx-auto">
        {/* 顶部标题 */}
        <div className="px-5 pt-12 pb-4 text-center">
          <h1 className="text-gray-800 text-2xl font-bold">复习</h1>
        </div>

        {/* 标签切换 */}
        <div className="px-5 mb-4">
          <div className="flex bg-gray-200 rounded-[20px] p-1">
            <button
              onClick={() => setActiveTab('wrong')}
              className={`flex-1 py-2.5 rounded-[20px] text-sm font-bold transition-all ${
                activeTab === 'wrong'
                  ? 'bg-[#58CC02] text-white shadow-lg'
                  : 'bg-transparent text-gray-500'
              }`}
            >
              错题本 ({wrongQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex-1 py-2.5 rounded-[20px] text-sm font-bold transition-all ${
                activeTab === 'knowledge'
                  ? 'bg-[#58CC02] text-white shadow-lg'
                  : 'bg-transparent text-gray-500'
              }`}
            >
              知识卡片
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="px-5">
          <AnimatePresence mode="wait">
            {activeTab === 'wrong' ? (
              <motion.div
                key="wrong"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                {/* 筛选标签 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {filterTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveFilter(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        activeFilter === tag
                          ? 'bg-[#58CC02] text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {filteredWrongQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-5xl block mb-3">🎉</span>
                    <p className="text-gray-500 text-sm mb-4">
                      暂无错题，快去答题吧！
                    </p>
                    <button
                      onClick={handleGoQuiz}
                      className="px-6 py-2.5 bg-[#58CC02] text-white text-sm font-bold rounded-lg shadow-md active:scale-95 transition-transform"
                    >
                      去答题
                    </button>
                  </div>
                ) : (
                  filteredWrongQuestions.map((wq) => (
                    <div
                      key={wq.id}
                      className="bg-white rounded-xl p-4 shadow-md"
                    >
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                        {wq.question.text}
                      </p>
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[#FF4B4B] text-xs font-bold">
                            ❌ 你的答案：
                          </span>
                          <span className="text-sm text-gray-600">
                            {wq.userAnswer}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#58CC02] text-xs font-bold">
                            ✓ 正确答案：
                          </span>
                          <span className="text-sm text-gray-600">
                            {wq.correctAnswer}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleRepractice}
                        className="w-full py-2.5 rounded-lg text-sm font-bold bg-[#58CC02] text-white shadow-md active:scale-95 transition-transform"
                      >
                        重新练习
                      </button>
                    </div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="knowledge"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                {/* 卡片堆叠区域 */}
                <div
                  className="relative h-[360px]"
                  style={{ perspective: '1000px' }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentCardIndex}
                      initial={{ opacity: 0, rotateY: 90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: -90 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-white rounded-[20px] shadow-lg p-5 flex flex-col"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* 分类标签 */}
                      <span className="inline-block self-start px-3 py-1 bg-[#fff3e0] text-[#ff9800] text-xs font-bold rounded-xl mb-3">
                        {mockKnowledgeCards[currentCardIndex].category}
                      </span>

                      {/* 标题 */}
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {mockKnowledgeCards[currentCardIndex].title}
                      </h3>

                      {/* 内容 */}
                      <p className="text-[15px] text-gray-600 leading-[1.8] flex-1 overflow-y-auto">
                        {mockKnowledgeCards[currentCardIndex].content}
                      </p>

                      {/* 底部操作区 */}
                      <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                        <button className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#fff3e0] text-[#ff9800] active:scale-95 transition-transform">
                          需复习
                        </button>
                        <button className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#e8f5e9] text-[#58CC02] active:scale-95 transition-transform">
                          已掌握
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* 底部提示和指示器 */}
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-400 mb-2">左右滑动切换卡片</p>
                  <div className="flex justify-center gap-1.5">
                    {mockKnowledgeCards.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentCardIndex
                            ? 'bg-[#58CC02] w-4'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 底部导航栏 */}
      <BottomNav />
    </div>
  )
}
