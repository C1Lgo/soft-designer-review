// ========================================
// Express 服务器入口文件
// 软件设计师刷题系统后端
// ========================================

import express from 'express';
import cors from 'cors';
import { questionsRouter } from './routes/questions.ts';
import { usersRouter } from './routes/users.ts';
import { leaderboardRouter } from './routes/leaderboard.ts';

const app = express();
const PORT = 3001;

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析 JSON 请求体

// 请求日志中间件
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 注册路由
app.use('/api/questions', questionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/leaderboard', leaderboardRouter);

// 健康检查接口
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: '服务器运行正常', timestamp: new Date().toISOString() });
});

// 404 处理
app.use((_req, res) => {
  res.status(404).json({ success: false, message: '接口不存在' });
});

// 全局错误处理
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('服务器错误:', err.message);
  res.status(500).json({ success: false, message: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  软件设计师刷题系统后端已启动`);
  console.log(`  服务地址: http://localhost:${PORT}`);
  console.log(`  API文档: http://localhost:${PORT}/api/health`);
  console.log(`========================================`);
});

export default app;
