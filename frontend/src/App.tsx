/**
 * 根组件 - 配置 React Router 路由
 * Web 端显示手机框架，移动端全屏显示
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Quiz from '@/pages/Quiz'
import QuizResult from '@/pages/QuizResult'
import Review from '@/pages/Review'
import Leaderboard from '@/pages/Leaderboard'
import Profile from '@/pages/Profile'

function App() {
  return (
    <BrowserRouter>
      {/* Web 端：浅灰色背景，居中显示手机框架 */}
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
        {/* 手机框架 - 仅在 Web 端显示（md 及以上屏幕） */}
        <div className="hidden md:block relative">
          {/* 手机外框 */}
          <div
            className="relative bg-black rounded-[36px] p-[12px] shadow-2xl"
            style={{ width: '390px', height: '844px' }}
          >
            {/* 刘海屏 notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
              <div
                className="bg-black rounded-b-[20px] flex items-center justify-center"
                style={{ width: '126px', height: '34px' }}
              >
                {/* 听筒 */}
                <div
                  className="bg-[#2a2a2a] rounded-full"
                  style={{ width: '60px', height: '6px' }}
                />
              </div>
            </div>

            {/* 屏幕内容区域 */}
            <div
              className="w-full h-full bg-white rounded-[28px] overflow-hidden relative"
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/quiz/result" element={<QuizResult />} />
                <Route path="/review" element={<Review />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </div>
        </div>

        {/* 移动端：全屏显示，无手机框架 */}
        <div className="md:hidden w-full h-screen overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/result" element={<QuizResult />} />
            <Route path="/review" element={<Review />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
