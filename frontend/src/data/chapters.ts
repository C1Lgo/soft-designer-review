/**
 * 章节列表数据
 */
import type { Chapter } from '@/types'

export const chapters: Chapter[] = [
  {
    id: 'ch01',
    title: '计算机系统基础',
    description: '计算机组成原理、数制转换、数据表示',
    icon: '💻',
    status: 'completed',
    progress: 100,
    totalQuestions: 30,
    completedQuestions: 30,
  },
  {
    id: 'ch02',
    title: '数据结构与算法',
    description: '线性表、树、图、排序与查找算法',
    icon: '🌳',
    status: 'current',
    progress: 65,
    totalQuestions: 45,
    completedQuestions: 29,
  },
  {
    id: 'ch03',
    title: '操作系统原理',
    description: '进程管理、内存管理、文件系统',
    icon: '⚙️',
    status: 'locked',
    progress: 0,
    totalQuestions: 35,
    completedQuestions: 0,
  },
  {
    id: 'ch04',
    title: '软件工程',
    description: '需求分析、设计模式、软件测试',
    icon: '🔧',
    status: 'locked',
    progress: 0,
    totalQuestions: 30,
    completedQuestions: 0,
  },
  {
    id: 'ch05',
    title: '数据库系统',
    description: 'SQL语法、数据库设计、事务管理',
    icon: '🗄️',
    status: 'locked',
    progress: 0,
    totalQuestions: 40,
    completedQuestions: 0,
  },
  {
    id: 'ch06',
    title: '网络基础',
    description: 'TCP/IP协议、HTTP、网络安全基础',
    icon: '🌐',
    status: 'locked',
    progress: 0,
    totalQuestions: 35,
    completedQuestions: 0,
  },
]
