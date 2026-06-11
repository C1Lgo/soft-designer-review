# GitHub 推送指南

## 步骤 1：在 GitHub 创建仓库

1. 打开 https://github.com/new
2. Repository name: `soft-designer-review`
3. 选择 Public（公开）或 Private（私有）
4. 不要勾选 "Initialize this repository with a README"
5. 点击 "Create repository"

## 步骤 2：推送代码

创建仓库后，GitHub 会显示推送命令。你也可以直接复制下面的命令在终端执行：

```bash
cd "d:\work\学习\自我学习\study"

git remote add origin https://github.com/你的用户名/soft-designer-review.git

git branch -M main

git push -u origin main
```

## 步骤 3：验证推送

刷新 GitHub 页面，应该能看到所有代码文件。

## 之后更新代码

```bash
git add .
git commit -m "update: 更新描述"
git push
```

## Vercel 部署（推送后）

1. 打开 https://vercel.com
2. 用 GitHub 账号登录
3. 点击 "New Project"
4. 选择 `soft-designer-review` 仓库
5. Root Directory 设为 `frontend`
6. Framework Preset: Vite
7. 点击 Deploy

之后每次 `git push` 都会自动触发 Vercel 重新部署。
