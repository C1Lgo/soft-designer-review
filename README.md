# 软件设计师复习App

一个类似多邻国的游戏化软件设计师考试复习应用。

## 技术栈

- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **后端**: Express + TypeScript + JWT
- **数据存储**: JSON 文件（可升级为数据库）

## 快速开始

### 安装依赖
```bash
# 安装前端依赖
cd frontend && npm install

# 安装后端依赖
cd backend && npm install
```

### 启动开发服务器
```bash
# 启动后端（端口 3001）
cd backend && npm run dev

# 启动前端（端口 5173）
cd frontend && npm run dev
```

### 构建生产版本
```bash
# 构建前端
cd frontend && npm run build

# 构建后端
cd backend && npm run build
```

## 项目结构

```
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── pages/            # 页面组件
│   │   ├── components/       # 通用组件
│   │   ├── store/            # Zustand 状态管理
│   │   ├── api/              # API 请求
│   │   ├── types/            # 类型定义
│   │   └── data/             # 静态数据
│   └── vercel.json           # Vercel 部署配置
├── backend/                  # Express 后端
│   ├── src/
│   │   ├── routes/           # API 路由
│   │   ├── data/             # 题库数据
│   │   └── types/            # 类型定义
│   └── vercel.json           # Vercel 部署配置
├── 软件设计师复习App-功能规划.md
├── 软件设计师复习App-设计图.html
└── 部署指南.md
```

## 部署

详见 [部署指南.md](./部署指南.md)

## 功能特性

- 🎮 游戏化学习：经验值、等级、连胜、宝石
- 📚 6大章节：计算机系统、数据结构、操作系统、软件工程、数据库、网络
- ✏️ 多种题型：单选、多选、判断
- 📊 学习统计：正确率、学习进度、错题本
- 🏆 排行榜：好友/全国排名
- 📱 移动端适配：多邻国风格 UI
