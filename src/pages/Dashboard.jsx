import { motion } from 'framer-motion'
import { Plus, Mic, Edit3, ChevronRight, Brain, TrendingUp, Target, X, Calendar, Play, ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

const Dashboard = () => {
    const {
        goals, addGoal,
        tasks,
        sessions, updateSession,
        setCurrentPage,
        selectedTask, setSelectedTask,
        setInsightsFilter
    } = useApp()

    const [insightDismissed, setInsightDismissed] = useState(false)
    const [showNewGoalModal, setShowNewGoalModal] = useState(false)
    const [showTaskSelector, setShowTaskSelector] = useState(false)
    const [showRescheduleModal, setShowRescheduleModal] = useState(false)
    const [activeRescheduleSession, setActiveRescheduleSession] = useState(null)
    const [showFirstGoalTooltip, setShowFirstGoalTooltip] = useState(false)

    // New Goal Form State
    const [newGoal, setNewGoal] = useState({ title: '', desc: '', timeTarget: '', color: 'blue' })

    // Filter only active goals for the dashboard
    const activeGoals = goals.filter(g => g.status === 'active')

    // Find the next upcoming session
    const upcomingSession = sessions.find(s => !s.completed)

    const handleCreateGoal = () => {
        if (!newGoal.title) return
        addGoal({
            title: newGoal.title,
            milestone: 'Breaking ground',
            progress: 0,
            targetDate: 'Set date',
            color: newGoal.color,
            status: 'active',
            timeTarget: parseInt(newGoal.timeTarget) || 0,
            timeLogged: 0,
            description: newGoal.desc
        })
        setShowNewGoalModal(false)
        setNewGoal({ title: '', desc: '', timeTarget: '', color: 'blue' })

        if (goals.length === 1) { // If it was the first goal (addGoal increases length)
            setShowFirstGoalTooltip(true)
            setTimeout(() => setShowFirstGoalTooltip(false), 5000)
        }
    }

    const handleStartFocus = () => {
        if (selectedTask) {
            setCurrentPage('focus')
        } else {
            if (tasks.filter(t => t.status !== 'completed').length > 0) {
                setShowTaskSelector(true)
            } else {
                alert('Create a task first.')
            }
        }
    }

    const handleTaskSelect = (task) => {
        setSelectedTask(task)
        setShowTaskSelector(false)
        setCurrentPage('focus')
    }

    const handleViewInsights = () => {
        setInsightsFilter('Weekly')
        setCurrentPage('insights')
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 }
    }

    return (
        <div className="flex flex-col min-h-screen pb-40">
            <header className="pt-14 px-6 pb-6 flex flex-col gap-1 z-10">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Monday, Nov 04</span>
                    <button
                        onClick={() => setShowNewGoalModal(true)}
                        className="text-blue-600 font-bold text-[11px] uppercase tracking-wider relative"
                    >
                        New Goal
                        {showFirstGoalTooltip && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-8 right-0 w-32 bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-xl z-50 pointer-events-none"
                            >
                                <div className="absolute -top-1 right-4 w-2 h-2 bg-slate-900 rotate-45" />
                                Break this into tasks.
                            </motion.div>
                        )}
                    </button>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Smart Intentional Dashboard</h1>

                {!insightDismissed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 p-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm relative overflow-hidden"
                    >
                        <button
                            onClick={() => setInsightDismissed(true)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X size={16} />
                        </button>
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                <Brain className="text-amber-600 dark:text-amber-500" size={20} />
                            </div>
                            <div>
                                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-snug">
                                    "Over-scheduling detected in the next 4 hours. Consider moving 1 task to tomorrow."
                                </p>
                                <button
                                    onClick={() => setCurrentPage('planner')}
                                    className="text-[11px] mt-2 text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1 group"
                                >
                                    Adjust Schedule <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </header>

            <motion.div
                className="px-6 space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Start Focus Primary Button */}
                <motion.section variants={itemVariants}>
                    <button
                        onClick={handleStartFocus}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 shadow-xl shadow-blue-600/30 active:scale-[0.98] transition-all group"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play size={24} fill="white" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-lg font-bold">Start Focus</h2>
                            <p className="text-xs text-blue-100 opacity-80">
                                {selectedTask ? `Focusing on: ${selectedTask.title}` : 'Ready to dive in?'}
                            </p>
                        </div>
                    </button>
                </motion.section>

                {/* Upcoming Session Card */}
                {upcomingSession && (
                    <motion.section variants={itemVariants}>
                        <div className="bg-white dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">Upcoming Session</h2>
                                <Calendar size={16} className="text-slate-400" />
                            </div>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex flex-col items-center justify-center text-blue-600 font-bold">
                                    <span className="text-[10px] uppercase leading-none">{upcomingSession.time.split(' ')[1]}</span>
                                    <span className="text-lg leading-none">{upcomingSession.time.split(' ')[0]}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{upcomingSession.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">30 min duration</p>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                <button
                                    onClick={() => {
                                        setActiveRescheduleSession(upcomingSession)
                                        setShowRescheduleModal(true)
                                    }}
                                    className="flex-1 py-2 text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                                >
                                    Reschedule
                                </button>
                                <button
                                    onClick={() => setCurrentPage('planner')}
                                    className="flex-1 py-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-100 dark:bg-slate-700/50 rounded-lg"
                                >
                                    Schedule Session
                                </button>
                            </div>
                        </div>
                    </motion.section>
                )}

                <motion.section variants={itemVariants}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">Active Goals</h2>
                        <button
                            onClick={() => setCurrentPage('goals')}
                            className="text-blue-600 text-[11px] font-bold uppercase tracking-wider"
                        >
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {activeGoals.map((goal) => (
                            <motion.div
                                key={goal.id}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight text-slate-800 dark:text-slate-100">{goal.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`w-2 h-2 rounded-full ${goal.color === 'emerald' ? 'bg-emerald-500' : goal.color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{goal.milestone}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-blue-600 text-xs font-black bg-blue-50/50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">{goal.progress}%</span>
                                    </div>
                                </div>

                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden mb-4">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${goal.progress}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-blue-600 rounded-full"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Target</p>
                                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{goal.targetDate}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage('goal-detail')}
                                        className="text-blue-600 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 group"
                                    >
                                        View Goal <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Weekly Summary Card */}
                <motion.section variants={itemVariants}>
                    <div
                        onClick={handleViewInsights}
                        className="bg-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-600/20 cursor-pointer group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex items-center justify-between mb-3 relative z-10">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Weekly Insights</span>
                            <TrendingUp size={20} />
                        </div>
                        <p className="text-base font-medium leading-relaxed relative z-10">
                            You completed <span className="font-bold italic underline">12 focus sessions</span> this week. Excellent output!
                        </p>
                        <button className="mt-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            View Insights <ChevronRight size={12} />
                        </button>
                    </div>
                </motion.section>
            </motion.div>

            {/* Floating Action Button */}
            <div className="fixed bottom-28 right-6 left-6 flex justify-end items-center pointer-events-none gap-3 z-30">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex gap-2 pointer-events-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-2 rounded-full shadow-2xl"
                >
                    <button className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 active:scale-90 transition-all">
                        <Mic size={20} />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 active:scale-90 transition-all border-l border-slate-200 dark:border-slate-700 pl-1">
                        <Edit3 size={20} />
                    </button>
                </motion.div>

                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartFocus}
                    className="pointer-events-auto w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center z-40"
                >
                    <Plus size={32} strokeWidth={1.5} />
                </motion.button>
            </div>

            {/* New Goal Modal */}
            {showNewGoalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Goal</h2>
                            <button onClick={() => setShowNewGoalModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Goal Title (Required)</label>
                                <input
                                    type="text"
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                                    placeholder="e.g. Master Mobile UI Design"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Why this matters</label>
                                <textarea
                                    value={newGoal.desc}
                                    onChange={(e) => setNewGoal({ ...newGoal, desc: e.target.value })}
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all h-24 resize-none"
                                    placeholder="Impact of this goal..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Optional Target Hours</label>
                                    <input
                                        type="number"
                                        value={newGoal.timeTarget}
                                        onChange={(e) => setNewGoal({ ...newGoal, timeTarget: e.target.value })}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                                        placeholder="e.g. 50"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Category Color</label>
                                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                        {['blue', 'emerald', 'amber', 'rose'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setNewGoal({ ...newGoal, color: c })}
                                                className={`w-8 h-8 rounded-full border-4 transition-all ${newGoal.color === c ? 'border-white dark:border-slate-400 scale-110' : 'border-transparent opacity-60'}`}
                                                style={{ backgroundColor: c === 'blue' ? '#2563eb' : c === 'emerald' ? '#10b981' : c === 'amber' ? '#f59e0b' : '#e11d48' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCreateGoal}
                                disabled={!newGoal.title}
                                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs mt-4 transition-all ${newGoal.title
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98]'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                Create Goal
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Task Selector Bottom Sheet */}
            {showTaskSelector && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setShowTaskSelector(false)}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="bg-white dark:bg-slate-900 w-full rounded-t-[3rem] p-8 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Select a task to focus on</h2>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {tasks.filter(t => t.status !== 'completed').map(task => (
                                <button
                                    key={task.id}
                                    onClick={() => handleTaskSelect(task)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${task.color === 'blue' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600">{task.title}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{task.goalName || 'General'}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-3xl p-6 shadow-2xl"
                    >
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Reschedule Session</h3>
                        <p className="text-xs text-slate-500 mb-6">Adjust the time for <span className="font-bold text-slate-700 dark:text-slate-300">{activeRescheduleSession?.title}</span></p>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                                <button
                                    onClick={() => {
                                        // Logic to decrement time could be added here
                                    }}
                                    className="text-blue-600 hover:scale-110 active:scale-90 transition-transform"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="font-bold text-lg">{activeRescheduleSession?.time}</span>
                                <button
                                    onClick={() => {
                                        // Logic to increment time could be added here
                                    }}
                                    className="text-blue-600 hover:scale-110 active:scale-90 transition-transform"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowRescheduleModal(false)}
                                    className="flex-1 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (activeRescheduleSession) {
                                            updateSession(activeRescheduleSession.id, { time: activeRescheduleSession.time })
                                            setShowRescheduleModal(false)
                                        }
                                    }}
                                    className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white text-xs shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
