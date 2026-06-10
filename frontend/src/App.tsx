/**
 * 根组件 - 配置 React Router 路由
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Quiz from '@/pages/Quiz'
import QuizResult from '@/pages/QuizResult'
import Review from '@/pages/Review'
import Leaderboard from '@/pages/Leaderboard'
import Profile from '@/pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/result" element={<QuizResult />} />
        <Route path="/review" element={<Review />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}
