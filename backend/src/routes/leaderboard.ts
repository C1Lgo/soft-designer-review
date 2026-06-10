// ========================================
// 排行榜 API 路由
// 包含周榜、月榜、总榜等功能
// ========================================

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { LeaderboardEntry, LeaderboardType, UserProgress } from '../types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// 数据文件路径
const dataDir = path.join(__dirname, '../data');
const usersFilePath = path.join(dataDir, 'users.json');
const progressFilePath = path.join(dataDir, 'progress.json');

/** 读取用户数据 */
function readUsers() {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/** 读取进度数据 */
function readProgress(): Record<string, UserProgress> {
  try {
    const data = fs.readFileSync(progressFilePath, 'utf-8');
    return JSON.parse(data) as Record<string, UserProgress>;
  } catch {
    return {};
  }
}

/** 根据排行榜类型筛选时间范围内的数据 */
function filterByTimeType(progress: UserProgress, type: LeaderboardType): UserProgress {
  if (type === 'all') return progress;

  const now = new Date();
  let startDate: Date;

  if (type === 'weekly') {
    // 本周一
    startDate = new Date(now);
    const dayOfWeek = now.getDay() || 7; // 周日为7
    startDate.setDate(now.getDate() - dayOfWeek + 1);
    startDate.setHours(0, 0, 0, 0);
  } else {
    // 本月1号
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  // 简化处理：由于JSON文件存储不记录历史数据，
  // 这里返回完整数据（实际项目中应使用数据库查询）
  return progress;
}

// ========================================
// GET /api/leaderboard - 获取排行榜
// 查询参数: type - 排行榜类型（weekly/monthly/all，默认all）
//           limit - 返回数量（默认10）
// ========================================
router.get('/', (req: Request, res: Response) => {
  const type = (req.query.type as LeaderboardType) || 'all';
  const limit = parseInt(req.query.limit as string) || 10;

  // 验证type参数
  if (!['weekly', 'monthly', 'all'].includes(type)) {
    res.status(400).json({ success: false, message: '排行榜类型无效，支持 weekly/monthly/all' });
    return;
  }

  const users = readUsers();
  const allProgress = readProgress();

  // 构建排行榜数据
  const entries: LeaderboardEntry[] = [];

  for (const user of users) {
    const progress = allProgress[user.id];
    if (!progress) continue;

    const filteredProgress = filterByTimeType(progress, type);

    entries.push({
      rank: 0, // 排名稍后计算
      userId: user.id,
      username: user.username,
      nickname: user.nickname,
      experience: filteredProgress.experience,
      level: filteredProgress.level,
      totalQuestions: filteredProgress.totalQuestions,
      accuracy: filteredProgress.overallAccuracy,
    });
  }

  // 按经验值降序排序
  entries.sort((a, b) => b.experience - a.experience);

  // 分配排名（相同经验值相同排名）
  let currentRank = 1;
  for (let i = 0; i < entries.length; i++) {
    if (i > 0 && entries[i].experience < entries[i - 1].experience) {
      currentRank = i + 1;
    }
    entries[i].rank = currentRank;
  }

  // 限制返回数量
  const result = entries.slice(0, limit);

  res.json({
    success: true,
    data: {
      type,
      total: entries.length,
      limit: result.length,
      entries: result,
    },
  });
});

export { router as leaderboardRouter };
