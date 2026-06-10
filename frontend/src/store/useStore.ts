/**
 * Zustand 全局状态管理
 */
import { create } from 'zustand'
import type { User, Question, QuizState, WrongQuestion } from '@/types'

/** Store 状态类型 */
interface StoreState {
  /** 用户信息 */
  user: User
  /** 当前答题状态 */
  currentQuiz: QuizState
  /** 错题列表 */
  wrongQuestions: WrongQuestion[]

  // ---- Actions ----
  /** 设置用户信息 */
  setUser: (user: Partial<User>) => void
  /** 开始答题 */
  startQuiz: (questions: Question[]) => void
  /** 提交答案 */
  answerQuestion: (questionId: string, answer: string) => void
  /** 完成答题 */
  finishQuiz: () => void
  /** 添加错题 */
  addWrongQuestion: (question: Question, userAnswer: string) => void
  /** 移除错题（已掌握） */
  removeWrongQuestion: (questionId: string) => void
  /** 重置答题状态 */
  resetQuiz: () => void
}

/** 初始答题状态 */
const initialQuizState: QuizState = {
  questions: [],
  currentIndex: 0,
  answers: {},
  score: 0,
  correctCount: 0,
  streak: 0,
  maxStreak: 0,
  isFinished: false,
  xpGained: 0,
}

/** 默认用户信息 */
const defaultUser: User = {
  id: 'user001',
  username: '学习者',
  level: 5,
  xp: 320,
  xpToNextLevel: 500,
  streak: 12,
  gems: 85,
  totalQuestions: 156,
  correctRate: 0.82,
}

const useStore = create<StoreState>((set) => ({
  user: defaultUser,
  currentQuiz: initialQuizState,
  wrongQuestions: [],

  setUser: (userData) =>
    set((state) => ({
      user: { ...state.user, ...userData },
    })),

  startQuiz: (questions) =>
    set({
      currentQuiz: {
        ...initialQuizState,
        questions,
      },
    }),

  answerQuestion: (questionId, answer) =>
    set((state) => {
      const question = state.currentQuiz.questions.find(
        (q) => q.id === questionId
      )
      if (!question) return state

      const isCorrect = answer === question.answer
      const newStreak = isCorrect
        ? state.currentQuiz.streak + 1
        : 0
      const newMaxStreak = Math.max(
        newStreak,
        state.currentQuiz.maxStreak
      )
      const newCorrectCount = isCorrect
        ? state.currentQuiz.correctCount + 1
        : state.currentQuiz.correctCount

      return {
        currentQuiz: {
          ...state.currentQuiz,
          answers: {
            ...state.currentQuiz.answers,
            [questionId]: answer,
          },
          correctCount: newCorrectCount,
          streak: newStreak,
          maxStreak: newMaxStreak,
        },
      }
    }),

  finishQuiz: () =>
    set((state) => {
      const { correctCount, questions, maxStreak } = state.currentQuiz
      const total = questions.length
      const xpGained = correctCount * 10 + maxStreak * 5

      return {
        currentQuiz: {
          ...state.currentQuiz,
          isFinished: true,
          score: correctCount,
          xpGained,
        },
        user: {
          ...state.user,
          xp: state.user.xp + xpGained,
          totalQuestions: state.user.totalQuestions + total,
          correctRate:
            (state.user.totalQuestions * state.user.correctRate +
              correctCount) /
            (state.user.totalQuestions + total),
        },
      }
    }),

  addWrongQuestion: (question, userAnswer) =>
    set((state) => {
      // 避免重复添加
      const exists = state.wrongQuestions.find(
        (wq) => wq.question.id === question.id
      )
      if (exists) return state

      const newWrong: WrongQuestion = {
        id: `wq_${Date.now()}`,
        question,
        userAnswer,
        correctAnswer: question.answer,
        createdAt: new Date().toISOString(),
        reviewCount: 0,
        mastered: false,
      }

      return {
        wrongQuestions: [newWrong, ...state.wrongQuestions],
      }
    }),

  removeWrongQuestion: (questionId) =>
    set((state) => ({
      wrongQuestions: state.wrongQuestions.filter(
        (wq) => wq.question.id !== questionId
      ),
    })),

  resetQuiz: () =>
    set({
      currentQuiz: initialQuizState,
    }),
}))

export default useStore
