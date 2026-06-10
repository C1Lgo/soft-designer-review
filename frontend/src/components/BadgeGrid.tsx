/**
 * 徽章网格组件
 * 展示成就徽章列表
 */
import { motion } from 'framer-motion'
import type { Badge } from '@/types'

interface BadgeGridProps {
  badges: Badge[]
}

export default function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl ${
            badge.unlocked
              ? 'bg-[#FFC800]/10 border border-[#FFC800]/30'
              : 'bg-gray-50 border border-gray-100 opacity-40'
          }`}
        >
          <span className="text-3xl">{badge.icon}</span>
          <span className="text-[10px] font-medium text-gray-500 text-center leading-tight">
            {badge.name}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
