/**
 * 底部导航栏组件
 * 4个tab：首页、复习、排行、我的
 */
import { useLocation, useNavigate } from 'react-router-dom'

/** 导航项配置 */
const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/review', label: '复习', icon: '📖' },
  { path: '/leaderboard', label: '排行', icon: '🏆' },
  { path: '/profile', label: '我的', icon: '👤' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive
                  ? 'text-[#58CC02]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {/* 当前页高亮指示器 */}
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 bg-[#58CC02] rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
