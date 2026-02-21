import { motion } from 'framer-motion'
import { Plus, ChevronRight, Target, ChevronLeft, MoreHorizontal, TrendingUp, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'

const GoalsOverview = () => {
    const { goals, setCurrentPage, setActiveGoalId, setShowNewGoalModal } = useApp()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    }

    return (
        <div className="relative w-full flex flex-col min-h-screen pb-40 bg-[#f6f7f8] dark:bg-[#0a0f16]">
            <header className="pt-12 px-6 pb-6">
                <div className="flex justify-between items-center mb-2">
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="p-2 -ml-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <button
                        onClick={() => setShowNewGoalModal(true)}
                        className="p-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800 transition-colors"
                    >
                        <Plus size={24} className="text-blue-600" />
                    </button>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Active Goals</h1>
                <p className="text-sm text-slate-500 mt-1">Focus on what matters most</p>
            </header>

            <motion.div
                className="px-6 space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {goals.map((goal) => (
                    <motion.div
                        key={goal.id}
                        variants={itemVariants}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                            setActiveGoalId(goal.id)
                            setCurrentPage('goal-detail')
                        }}
                        className="bg-white dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-${goal.color}-100 dark:bg-${goal.color}-900/30 flex items-center justify-center`}>
                                    <Target size={20} className={`text-${goal.color}-600`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{goal.title}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{goal.category || 'General'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-blue-600 text-xs font-black bg-blue-50/50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">{goal.progress}%</span>
                            </div>
                        </div>

                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden mb-4">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                className={`h-full bg-blue-600 rounded-full`}
                            />
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                            <div className="flex items-center gap-2">
                                <Clock size={12} />
                                <span>{goal.timeLogged}h / {goal.timeTarget}h</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp size={12} />
                                <span>{goal.milestone}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

export default GoalsOverview
