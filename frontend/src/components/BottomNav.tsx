/**
 * 底部导航栏组件
 * 4个tab：首页、复习、排行、我的
 * 当前页指示器为底部小圆点 + 文字加粗
 * Web 端在手机框架内固定底部，移动端全屏固定底部
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
              {/* 图标 */}
              <span className="text-lg leading-5">{item.icon}</span>

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
