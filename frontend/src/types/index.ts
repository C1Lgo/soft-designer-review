/**
 * 共享类型定义
 */

/** 用户信息 */
export interface User {
  id: string
  username: string
  avatar?: string
  level: number
  xp: number
  xpToNextLevel: number
  streak: number
  gems: number
  totalQuestions: number
  correctRate: number
}

/** 题目选项 */
export interface Option {
  label: string      // A / B / C / D
  text: string       // 选项内容
}

/** 题目 */
export interface Question {
  id: string
  chapterId: string
  type: 'single' | 'multiple' | 'judge'  // 单选 / 多选 / 判断
  text: string       // 题目文字
  options: Option[]
  answer: string      // 正确答案（如 "A" 或 "A,B" 或 "true/false"）
  explanation: string // 解析
}

/** 答题状态 */
export interface QuizState {
  questions: Question[]
  currentIndex: number
  answers: Record<string, string>  // questionId -> 选择的答案
  score: number
  correctCount: number
  streak: number       // 连续正确数
  maxStreak: number    // 最大连续正确数
  isFinished: boolean
  xpGained: number
}

/** 错题记录 */
export interface WrongQuestion {
  id: string
  question: Question
  userAnswer: string
  correctAnswer: string
  createdAt: string
  reviewCount: number  // 复习次数
  mastered: boolean    // 是否已掌握
}

/** 知识卡片 */
export interface KnowledgeCard {
  id: string
  chapterId: string
  category: string     // 分类标签
  title: string
  content: string
  mastered: boolean
  reviewDate?: string
}

/** 章节 */
export interface Chapter {
  id: string
  title: string
  description: string
  icon: string         // emoji 图标
  status: 'completed' | 'current' | 'locked'
  progress: number     // 0-100
  totalQuestions: number
  completedQuestions: number
}

/** 排行榜用户 */
export interface LeaderboardUser {
  id: string
  username: string
  avatar?: string
  streak: number
  xp: number
  rank: number
}

/** 成就徽章 */
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

/** API 响应通用格式 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
