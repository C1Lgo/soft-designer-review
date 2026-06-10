/**
 * 统计卡片组件
 * 用于展示单个统计数据
 */
import { motion } from 'framer-motion'

interface StatCardProps {
  label: string       // 标签文字
  value: string | number  // 数值
  icon: string        // 图标 emoji
  color?: string      // 背景色
  delay?: number      // 动画延迟
}

export default function StatCard({
  label,
  value,
  icon,
  color = 'bg-white',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className={`${color} rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-1`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xl font-bold text-gray-800">{value}</span>
      <span className="text-xs text-gray-400 font-medium">{label}</span>
    </motion.div>
  )
}
