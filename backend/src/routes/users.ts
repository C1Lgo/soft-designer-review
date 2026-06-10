// ========================================
// 用户相关 API 路由
// 包含注册、登录、用户信息、学习进度、错题本等功能
// ========================================

import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';
import type {
  User,
  UserProfile,
  UserProgress,
  ChapterProgress,
  WrongQuestion,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  QuizResultRequest,
  QuizResultResponse,
  SubmitAnswerResponse,
  JwtPayload,
} from '../types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// JWT密钥
const JWT_SECRET = 'soft-designer-secret-key';
const JWT_EXPIRES_IN = '7d'; // token有效期7天

// 数据文件路径
const dataDir = path.join(__dirname, '../data');
const usersFilePath = path.join(dataDir, 'users.json');
const progressFilePath = path.join(dataDir, 'progress.json');

// ========================================
// 数据读写工具函数
// ========================================

/** 读取用户数据 */
function readUsers(): User[] {
  try {
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, '[]', 'utf-8');
      return [];
    }
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data) as User[];
  } catch {
    return [];
  }
}

/** 写入用户数据 */
function writeUsers(users: User[]): void {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

/** 读取进度数据 */
function readProgress(): Record<string, UserProgress> {
  try {
    if (!fs.existsSync(progressFilePath)) {
      fs.writeFileSync(progressFilePath, '{}', 'utf-8');
      return {};
    }
    const data = fs.readFileSync(progressFilePath, 'utf-8');
    return JSON.parse(data) as Record<string, UserProgress>;
  } catch {
    return {};
  }
}

/** 写入进度数据 */
function writeProgress(progress: Record<string, UserProgress>): void {
  fs.writeFileSync(progressFilePath, JSON.stringify(progress, null, 2), 'utf-8');
}

/** 获取所有题目（用于统计进度） */
function loadAllQuestions() {
  const questionsPath = path.join(__dirname, '../data/questions.json');
  const data = fs.readFileSync(questionsPath, 'utf-8');
  return JSON.parse(data);
}

/** 计算等级（每100经验值升一级） */
function calculateLevel(experience: number): number {
  return Math.floor(experience / 100) + 1;
}

/** 将User对象转为UserProfile（去除密码） */
function toUserProfile(user: User): UserProfile {
  const { password: _password, ...profile } = user;
  return profile;
}

// ========================================
// JWT认证中间件
// ========================================

/** JWT认证中间件：验证token并将用户信息附加到请求上 */
function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: '未提供认证令牌' });
    return;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as Request & { user?: JwtPayload }).user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: '令牌无效或已过期' });
  }
}

// ========================================
// POST /api/users/register - 用户注册
// 请求体: { username, password, nickname? }
// ========================================
router.post('/register', (req: Request, res: Response) => {
  const { username, password, nickname } = req.body as RegisterRequest;

  // 参数校验
  if (!username || !password) {
    res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    return;
  }

  if (username.length < 3 || username.length > 20) {
    res.status(400).json({ success: false, message: '用户名长度应在3-20个字符之间' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ success: false, message: '密码长度不能少于6个字符' });
    return;
  }

  const users = readUsers();

  // 检查用户名是否已存在
  if (users.find(u => u.username === username)) {
    res.status(409).json({ success: false, message: '用户名已存在' });
    return;
  }

  // 创建新用户
  const newUser: User = {
    id: nanoid(),
    username,
    password, // 实际项目应使用bcrypt加密
    nickname: nickname || username,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  // 初始化用户进度
  const allProgress = readProgress();
  allProgress[newUser.id] = {
    userId: newUser.id,
    totalQuestions: 0,
    totalCorrect: 0,
    overallAccuracy: 0,
    experience: 0,
    level: 1,
    chapters: [],
    streakDays: 0,
  };
  writeProgress(allProgress);

  res.status(201).json({
    success: true,
    message: '注册成功',
    data: toUserProfile(newUser),
  });
});

// ========================================
// POST /api/users/login - 用户登录
// 请求体: { username, password }
// 返回: JWT token 和用户信息
// ========================================
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body as LoginRequest;

  if (!username || !password) {
    res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    return;
  }

  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user || user.password !== password) {
    res.status(401).json({ success: false, message: '用户名或密码错误' });
    return;
  }

  // 更新最后登录时间
  user.lastLoginAt = new Date().toISOString();
  writeUsers(users);

  // 生成JWT token
  const token = jwt.sign(
    { userId: user.id, username: user.username } as JwtPayload,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const response: LoginResponse = {
    token,
    user: toUserProfile(user),
  };

  res.json({ success: true, data: response });
});

// ========================================
// GET /api/users/profile - 获取用户信息（需要token）
// ========================================
router.get('/profile', authMiddleware, (req: Request, res: Response) => {
  const { userId } = (req as Request & { user: JwtPayload }).user;

  const users = readUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    res.status(404).json({ success: false, message: '用户不存在' });
    return;
  }

  res.json({ success: true, data: toUserProfile(user) });
});

// ========================================
// PUT /api/users/profile - 更新用户信息（需要token）
// 请求体: { nickname?, avatar? }
// ========================================
router.put('/profile', authMiddleware, (req: Request, res: Response) => {
  const { userId } = (req as Request & { user: JwtPayload }).user;
  const { nickname, avatar } = req.body;

  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    res.status(404).json({ success: false, message: '用户不存在' });
    return;
  }

  // 更新允许修改的字段
  if (nickname) users[userIndex].nickname = nickname;
  if (avatar) users[userIndex].avatar = avatar;

  writeUsers(users);

  res.json({
    success: true,
    message: '用户信息更新成功',
    data: toUserProfile(users[userIndex]),
  });
});

// ========================================
// GET /api/users/progress - 获取学习进度（需要token）
// ========================================
router.get('/progress', authMiddleware, (req: Request, res: Response) => {
  const { userId } = (req as Request & { user: JwtPayload }).user;

  const allProgress = readProgress();
  const progress = allProgress[userId];

  if (!progress) {
    res.status(404).json({ success: false, message: '暂无学习进度数据' });
    return;
  }

  res.json({ success: true, data: progress });
});

// ========================================
// GET /api/users/wrong-questions - 获取错题列表（需要token）
// ========================================
router.get('/wrong-questions', authMiddleware, (req: Request, res: Response) => {
  const { userId } = (req as Request & { user: JwtPayload }).user;

  const allProgress = readProgress();
  const progress = allProgress[userId];

  if (!progress) {
    res.json({ success: true, data: [] });
    return;
  }

  // 从进度数据中获取错题记录（存储在扩展字段中）
  const wrongQuestionsPath = path.join(dataDir, 'wrong-questions.json');
  let wrongQuestions: Record<string, WrongQuestion[]> = {};
  try {
    if (fs.existsSync(wrongQuestionsPath)) {
      const data = fs.readFileSync(wrongQuestionsPath, 'utf-8');
      wrongQuestions = JSON.parse(data);
    }
  } catch {
    // 忽略读取错误
  }

  const userWrongQuestions = wrongQuestions[userId] || [];

  // 加载题目详情
  const allQuestions = loadAllQuestions();
  const wrongQuestionsWithDetail = userWrongQuestions.map(wq => {
    const question = allQuestions.find((q: { id: string }) => q.id === wq.questionId);
    return {
      ...wq,
      question: question ? {
        id: question.id,
        chapter: question.chapter,
        type: question.type,
        question: question.question,
        options: question.options,
        answer: question.answer,
        explanation: question.explanation,
      } : null,
    };
  });

  res.json({
    success: true,
    data: {
      total: wrongQuestionsWithDetail.length,
      questions: wrongQuestionsWithDetail,
    },
  });
});

// ========================================
// POST /api/users/quiz-result - 提交答题结果（需要token）
// 请求体: { answers: [{questionId, userAnswer}], duration? }
// 返回: 答题统计和经验值变化
// ========================================
router.post('/quiz-result', authMiddleware, (req: Request, res: Response) => {
  const { userId } = (req as Request & { user: JwtPayload }).user;
  const { answers, duration } = req.body as QuizResultRequest;

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    res.status(400).json({ success: false, message: '答题记录不能为空' });
    return;
  }

  // 加载题目数据
  const allQuestions = loadAllQuestions();

  // 逐题判断对错
  const details: SubmitAnswerResponse[] = [];
  let correctCount = 0;

  for (const answer of answers) {
    const question = allQuestions.find((q: { id: string }) => q.id === answer.questionId);
    if (!question) continue;

    const isCorrect = answer.userAnswer.trim().toUpperCase() === question.answer.trim().toUpperCase();
    if (isCorrect) correctCount++;

    details.push({
      correct: isCorrect,
      correctAnswer: question.answer,
      explanation: question.explanation,
    });
  }

  const total = answers.length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // 计算获得的经验值（每答对一题得10分，全部答对额外奖励20分）
  let experienceGained = correctCount * 10;
  if (correctCount === total && total > 0) {
    experienceGained += 20; // 满分奖励
  }

  // 更新用户进度
  const allProgress = readProgress();
  let progress = allProgress[userId];

  if (!progress) {
    // 初始化进度
    progress = {
      userId,
      totalQuestions: 0,
      totalCorrect: 0,
      overallAccuracy: 0,
      experience: 0,
      level: 1,
      chapters: [],
      streakDays: 0,
    };
  }

  // 更新统计数据
  progress.totalQuestions += total;
  progress.totalCorrect += correctCount;
  progress.overallAccuracy = progress.totalQuestions > 0
    ? Math.round((progress.totalCorrect / progress.totalQuestions) * 100)
    : 0;
  progress.experience += experienceGained;
  progress.level = calculateLevel(progress.experience);
  progress.lastPracticeDate = new Date().toISOString();

  // 更新章节进度
  const chapterMap = new Map<string, ChapterProgress>();
  for (const cp of progress.chapters) {
    chapterMap.set(cp.chapter, cp);
  }

  for (const answer of answers) {
    const question = allQuestions.find((q: { id: string }) => q.id === answer.questionId);
    if (!question) continue;

    if (!chapterMap.has(question.chapter)) {
      // 初始化章节进度
      const chapterQuestions = allQuestions.filter((q: { chapter: string }) => q.chapter === question.chapter);
      chapterMap.set(question.chapter, {
        chapter: question.chapter,
        total: chapterQuestions.length,
        completed: 0,
        correct: 0,
        accuracy: 0,
      });
    }

    const cp = chapterMap.get(question.chapter)!;
    cp.completed++;
    const isCorrect = answer.userAnswer.trim().toUpperCase() === question.answer.trim().toUpperCase();
    if (isCorrect) cp.correct++;
    cp.accuracy = cp.completed > 0 ? Math.round((cp.correct / cp.completed) * 100) : 0;
  }

  progress.chapters = Array.from(chapterMap.values());

  // 更新错题记录
  const wrongQuestionsPath = path.join(dataDir, 'wrong-questions.json');
  let wrongQuestions: Record<string, WrongQuestion[]> = {};
  try {
    if (fs.existsSync(wrongQuestionsPath)) {
      const data = fs.readFileSync(wrongQuestionsPath, 'utf-8');
      wrongQuestions = JSON.parse(data);
    }
  } catch {
    // 忽略读取错误
  }

  if (!wrongQuestions[userId]) {
    wrongQuestions[userId] = [];
  }

  for (const answer of answers) {
    const question = allQuestions.find((q: { id: string }) => q.id === answer.questionId);
    if (!question) continue;

    const isCorrect = answer.userAnswer.trim().toUpperCase() === question.answer.trim().toUpperCase();
    if (!isCorrect) {
      // 查找是否已存在该错题
      const existingIndex = wrongQuestions[userId].findIndex(wq => wq.questionId === answer.questionId);
      if (existingIndex >= 0) {
        wrongQuestions[userId][existingIndex].wrongCount++;
        wrongQuestions[userId][existingIndex].lastWrongAt = new Date().toISOString();
        wrongQuestions[userId][existingIndex].mastered = false;
      } else {
        wrongQuestions[userId].push({
          questionId: answer.questionId,
          userAnswer: answer.userAnswer,
          wrongCount: 1,
          lastWrongAt: new Date().toISOString(),
          mastered: false,
        });
      }
    } else {
      // 答对了，标记为已掌握
      const existingIndex = wrongQuestions[userId].findIndex(wq => wq.questionId === answer.questionId);
      if (existingIndex >= 0) {
        wrongQuestions[userId][existingIndex].mastered = true;
      }
    }
  }

  fs.writeFileSync(wrongQuestionsPath, JSON.stringify(wrongQuestions, null, 2), 'utf-8');

  // 保存进度
  allProgress[userId] = progress;
  writeProgress(allProgress);

  const response: QuizResultResponse = {
    total,
    correct: correctCount,
    accuracy,
    experienceGained,
    totalExperience: progress.experience,
    level: progress.level,
    details,
  };

  res.json({ success: true, data: response });
});

export { router as usersRouter };
