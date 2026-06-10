// ========================================
// 题库相关 API 路由
// 包含题目查询、随机出题、答案提交等功能
// ========================================

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Question, SubmitAnswerRequest, SubmitAnswerResponse } from '../types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// 读取题库数据
const questionsDataPath = path.join(__dirname, '../data/questions.json');
let questions: Question[] = [];

/** 加载题库数据 */
function loadQuestions(): Question[] {
  try {
    const data = fs.readFileSync(questionsDataPath, 'utf-8');
    return JSON.parse(data) as Question[];
  } catch (err) {
    console.error('读取题库数据失败:', err);
    return [];
  }
}

// 初始化加载题库
questions = loadQuestions();

// ========================================
// GET /api/questions - 获取所有题目
// 查询参数: chapter - 按章节筛选
// ========================================
router.get('/', (req: Request, res: Response) => {
  const { chapter } = req.query;

  let result = [...questions];

  // 按章节筛选
  if (chapter && typeof chapter === 'string') {
    result = result.filter(q => q.chapter === chapter);
  }

  res.json({
    success: true,
    data: {
      total: result.length,
      questions: result,
    },
  });
});

// ========================================
// GET /api/questions/random - 随机获取题目
// 查询参数: count - 获取数量（默认5）
//           chapter - 按章节筛选
// 注意：此路由必须在 /:id 之前注册，否则 "random" 会被当作 id 参数
// ========================================
router.get('/random', (req: Request, res: Response) => {
  const count = parseInt(req.query.count as string) || 5;
  const { chapter } = req.query;

  let pool = [...questions];

  // 按章节筛选
  if (chapter && typeof chapter === 'string') {
    pool = pool.filter(q => q.chapter === chapter);
  }

  // 随机抽取题目
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, pool.length));

  res.json({
    success: true,
    data: {
      total: selected.length,
      questions: selected,
    },
  });
});

// ========================================
// GET /api/questions/:id - 获取单题详情
// ========================================
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const question = questions.find(q => q.id === id);

  if (!question) {
    res.status(404).json({ success: false, message: '题目不存在' });
    return;
  }

  res.json({ success: true, data: question });
});

// ========================================
// POST /api/questions/submit - 提交答案
// 请求体: { questionId, userAnswer }
// 返回: 对错结果和解析
// ========================================
router.post('/submit', (req: Request, res: Response) => {
  const { questionId, userAnswer } = req.body as SubmitAnswerRequest;

  if (!questionId || !userAnswer) {
    res.status(400).json({ success: false, message: '缺少必要参数' });
    return;
  }

  const question = questions.find(q => q.id === questionId);
  if (!question) {
    res.status(404).json({ success: false, message: '题目不存在' });
    return;
  }

  // 判断答案是否正确（忽略大小写和空格）
  const isCorrect = userAnswer.trim().toUpperCase() === question.answer.trim().toUpperCase();

  const response: SubmitAnswerResponse = {
    correct: isCorrect,
    correctAnswer: question.answer,
    explanation: question.explanation,
  };

  res.json({ success: true, data: response });
});

export { router as questionsRouter };
