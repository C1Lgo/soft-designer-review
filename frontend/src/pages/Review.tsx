/**
 * 复习页面
 * 顶部标签切换：错题本 / 知识卡片
 */
import { useState } from 'react'
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

/** 标签页类型 */
type TabType = 'wrong' | 'knowledge'

export default function Review() {
  const [activeTab, setActiveTab] = useState<TabType>('wrong')
  const { wrongQuestions, removeWrongQuestion } = useStore()

  /** 重新练习错题 */
  const handleRepractice = () => {
    // 跳转到答题页面
    window.location.href = '/quiz'
  }

  return (
    <div className="min-h-screen bg-[#131f24] pb-20">
      <div className="max-w-[430px] mx-auto">
        {/* 顶部标题 */}
        <div className="px-5 pt-12 pb-4">
          <h1 className="text-white text-2xl font-bold">复习</h1>
        </div>

        {/* 标签切换 */}
        <div className="px-5 mb-4">
          <div className="flex bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('wrong')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'wrong'
                  ? 'bg-[#58CC02] text-white shadow-lg'
                  : 'text-gray-400'
              }`}
            >
              错题本 ({wrongQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'knowledge'
                  ? 'bg-[#58CC02] text-white shadow-lg'
                  : 'text-gray-400'
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
                {wrongQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-5xl block mb-3">🎉</span>
                    <p className="text-gray-400 text-sm">
                      暂无错题，继续保持！
                    </p>
                  </div>
                ) : (
                  wrongQuestions.map((wq) => (
                    <div
                      key={wq.id}
                      className="bg-white rounded-2xl p-4 shadow-sm"
                    >
                      <p className="text-sm font-medium text-gray-800 mb-3">
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => removeWrongQuestion(wq.question.id)}
                          className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#58CC02]/10 text-[#58CC02] active:bg-[#58CC02]/20"
                        >
                          已掌握
                        </button>
                        <button
                          onClick={handleRepractice}
                          className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#1CB0F6]/10 text-[#1CB0F6] active:bg-[#1CB0F6]/20"
                        >
                          重新练习
                        </button>
                      </div>
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
                {mockKnowledgeCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    {/* 分类标签 */}
                    <span className="inline-block px-2 py-0.5 bg-[#CE82FF]/10 text-[#CE82FF] text-xs font-bold rounded-full mb-2">
                      {card.category}
                    </span>
                    <h3 className="text-sm font-bold text-gray-800 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {card.content}
                    </p>
                    <div className="flex gap-2">
                      <button
                        className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                          card.mastered
                            ? 'bg-[#58CC02] text-white'
                            : 'bg-[#58CC02]/10 text-[#58CC02] active:bg-[#58CC02]/20'
                        }`}
                      >
                        {card.mastered ? '已掌握 ✓' : '标记已掌握'}
                      </button>
                      {!card.mastered && (
                        <button className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#FF9600]/10 text-[#FF9600] active:bg-[#FF9600]/20">
                          需要复习
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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
