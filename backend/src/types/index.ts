// ========================================
// TypeScript 类型定义
// 软件设计师刷题系统后端接口类型
// ========================================

/** 题目类型 */
export type QuestionType = '单选' | '多选' | '判断';

/** 题目接口 */
export interface Question {
  /** 题目唯一标识 */
  id: string;
  /** 所属章节 */
  chapter: string;
  /** 题目类型：单选、多选、判断 */
  type: QuestionType;
  /** 题目内容 */
  question: string;
  /** 选项列表 */
  options: string[];
  /** 正确答案 */
  answer: string;
  /** 答案解析 */
  explanation: string;
}

/** 用户接口 */
export interface User {
  /** 用户唯一标识 */
  id: string;
  /** 用户名 */
  username: string;
  /** 密码（简单存储，实际项目应加密） */
  password: string;
  /** 昵称 */
  nickname?: string;
  /** 头像URL */
  avatar?: string;
  /** 注册时间 */
  createdAt: string;
  /** 最后登录时间 */
  lastLoginAt?: string;
}

/** 用户公开信息（不包含密码） */
export interface UserProfile extends Omit<User, 'password'> {}

/** 单个章节的学习进度 */
export interface ChapterProgress {
  /** 章节名称 */
  chapter: string;
  /** 总题数 */
  total: number;
  /** 已做题数 */
  completed: number;
  /** 正确数 */
  correct: number;
  /** 正确率 */
  accuracy: number;
}

/** 用户学习进度 */
export interface UserProgress {
  /** 用户ID */
  userId: string;
  /** 总做题数 */
  totalQuestions: number;
  /** 总正确数 */
  totalCorrect: number;
  /** 总正确率 */
  overallAccuracy: number;
  /** 经验值 */
  experience: number;
  /** 等级 */
  level: number;
  /** 各章节进度 */
  chapters: ChapterProgress[];
  /** 连续打卡天数 */
  streakDays: number;
  /** 最后做题日期 */
  lastPracticeDate?: string;
}

/** 错题记录 */
export interface WrongQuestion {
  /** 题目ID */
  questionId: string;
  /** 用户提交的错误答案 */
  userAnswer: string;
  /** 做错的次数 */
  wrongCount: number;
  /** 最后做错的时间 */
  lastWrongAt: string;
  /** 是否已掌握 */
  mastered: boolean;
}

/** 答题提交请求 */
export interface SubmitAnswerRequest {
  /** 题目ID */
  questionId: string;
  /** 用户提交的答案 */
  userAnswer: string;
}

/** 答题提交响应 */
export interface SubmitAnswerResponse {
  /** 是否正确 */
  correct: boolean;
  /** 正确答案 */
  correctAnswer: string;
  /** 答案解析 */
  explanation: string;
}

/** 答题结果提交请求 */
export interface QuizResultRequest {
  /** 答题记录列表 */
  answers: SubmitAnswerRequest[];
  /** 用时（秒） */
  duration?: number;
}

/** 答题结果响应 */
export interface QuizResultResponse {
  /** 总题数 */
  total: number;
  /** 正确数 */
  correct: number;
  /** 正确率 */
  accuracy: number;
  /** 获得经验值 */
  experienceGained: number;
  /** 当前总经验值 */
  totalExperience: number;
  /** 当前等级 */
  level: number;
  /** 各题详情 */
  details: SubmitAnswerResponse[];
}

/** 排行榜条目 */
export interface LeaderboardEntry {
  /** 排名 */
  rank: number;
  /** 用户ID */
  userId: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname?: string;
  /** 经验值 */
  experience: number;
  /** 等级 */
  level: number;
  /** 做题总数 */
  totalQuestions: number;
  /** 正确率 */
  accuracy: number;
}

/** 排行榜类型 */
export type LeaderboardType = 'weekly' | 'monthly' | 'all';

/** 注册请求 */
export interface RegisterRequest {
  username: string;
  password: string;
  nickname?: string;
}

/** 登录请求 */
export interface LoginRequest {
  username: string;
  password: string;
}

/** 登录响应 */
export interface LoginResponse {
  token: string;
  user: UserProfile;
}

/** 通用API响应 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

/** JWT载荷 */
export interface JwtPayload {
  userId: string;
  username: string;
}
