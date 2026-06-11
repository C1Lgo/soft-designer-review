/**
 * 底部导航栏组件
 * 4个tab：首页、复习、排行、我的
 * 当前页指示器为底部小圆点 + 文字加粗
 * Web 端在手机框架内固定底部，移动端全屏固定底部
 * 使用内联 SVG 图标（stroke-based，currentColor）
 */
import { useLocation, useNavigate } from 'react-router-dom'

/** 首页图标 - House */
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
)

/** 复习图标 - Book */
const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
)

/** 排行图标 - Trophy */
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
)

/** 我的图标 - User */
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)

/** 导航项配置 - 使用 SVG 图标组件 */
const navItems = [
  { path: '/', label: '首页', Icon: HomeIcon },
  { path: '/review', label: '复习', Icon: BookIcon },
  { path: '/leaderboard', label: '排行', Icon: TrophyIcon },
  { path: '/profile', label: '我的', Icon: UserIcon },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="shrink-0 bg-white border-t border-gray-100 z-50">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors relative ${
                isActive
                  ? 'text-[#58CC02]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {/* SVG 图标 */}
              <item.Icon />

              {/* 标签文字 - 当前页加粗 */}
              <span
                className={`text-[11px] leading-4 ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>

              {/* 当前页指示器 - 底部小圆点 */}
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-[#58CC02] rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
