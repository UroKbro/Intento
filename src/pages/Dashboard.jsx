import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Mic, Edit3, ChevronRight, Brain, TrendingUp, Target, X, Calendar, Play, ChevronLeft, Bell, Check, AlertCircle, Info, Star } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

const Dashboard = () => {
    const {
        goals, addGoal,
        tasks, addTask,
        sessions, updateSession,
        notifications, markAllAsRead, removeNotification,
        currentPage, setCurrentPage,
        selectedTask, setSelectedTask,
        setInsightsFilter,
        showNewGoalModal, setShowNewGoalModal,
        newGoal, setNewGoal,
        showBreakintoTasksPrompt, setShowBreakintoTasksPrompt
    } = useApp()

    const [insightDismissed, setInsightDismissed] = useState(false)
    const [showTaskSelector, setShowTaskSelector] = useState(false)
    const [showRescheduleModal, setShowRescheduleModal] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [activeRescheduleSession, setActiveRescheduleSession] = useState(null)
    const [showFirstGoalTooltip, setShowFirstGoalTooltip] = useState(false)
    const [showMicModal, setShowMicModal] = useState(false)
    const [showNoteModal, setShowNoteModal] = useState(false)
    const [quickNote, setQuickNote] = useState('')
    const [isListening, setIsListening] = useState(false)

    const unreadCount = notifications.filter(n => !n.read).length

    // Filter only active goals for the dashboard
    const activeGoals = goals.filter(g => g.status === 'active')

    // Find the next upcoming session
    const upcomingSession = sessions.find(s => !s.completed)



    const handleProcessVoice = () => {
        setIsListening(true)
        setTimeout(() => {
            setIsListening(false)
            setQuickNote('Researching user personas for Mobile UI Goal')
            setShowMicModal(false)
            setShowNoteModal(true)
        }, 2000)
    }

    const handleSaveNote = () => {
        if (!quickNote) return
        addTask({
            title: quickNote,
            color: 'slate',
            category: 'Inbox',
            priority: 2,
            estimatedDuration: 30
        })
        setQuickNote('')
        setShowNoteModal(false)
    }

    const handleStartFocus = () => {
        if (selectedTask) {
            setCurrentPage('focus')
        } else {
            const pendingTasks = tasks.filter(t => t.status !== 'completed')
            if (pendingTasks.length > 0) {
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
                staggerChildren: 0.1,
                delayChildren: 0.2
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

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 }
    }

    return (
        <div className="relative flex flex-col min-h-screen pb-40 bg-white dark:bg-[#0a0f16]">
            <header className="pt-12 px-6 pb-6 flex flex-col gap-1 z-10">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: '2-digit' })}
                    </span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 text-slate-500 dark:text-slate-400 active:scale-90 transition-transform"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0a0f16]">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
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
                </div>

                <AnimatePresence>
                    {showNotifications && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden mb-4"
                        >
                            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Notifications</h3>
                                <button
                                    onClick={markAllAsRead}
                                    className="text-[10px] font-bold text-blue-600 uppercase"
                                >
                                    Mark all as read
                                </button>
                            </div>
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                {['Today', 'Earlier'].map(category => (
                                    <div key={category}>
                                        <div className="bg-slate-50 dark:bg-slate-900/40 px-4 py-1.5 text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                                            {category}
                                        </div>
                                        {notifications.filter(n => n.category === category).map(n => (
                                            <div key={n.id} className={`p-4 flex gap-3 border-b border-slate-50 dark:border-slate-800 last:border-none ${!n.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.type === 'overload' ? 'bg-amber-100 text-amber-600' :
                                                    n.type === 'summary' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                                                    {n.type === 'overload' ? <AlertCircle size={16} /> : <Info size={16} />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">{n.message}</p>
                                                    <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <button onClick={() => removeNotification(n.id)} className="text-slate-300 hover:text-slate-500 transition-colors">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
                        whileHover={{ scale: 1.02, backgroundColor: '#1d4ed8' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition-all group"
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
                                    <span className="text-[10px] uppercase leading-none">{upcomingSession.time && upcomingSession.time.includes(' ') ? upcomingSession.time.split(' ')[1] : 'PM'}</span>
                                    <span className="text-lg leading-none">{upcomingSession.time && upcomingSession.time.includes(' ') ? upcomingSession.time.split(' ')[0] : '00'}</span>
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

                {/* Active Goals Section */}
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
                                variants={itemVariants}
                                whileHover={{ y: -4, scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="bg-white dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm cursor-pointer"
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
                                        onClick={() => setCurrentPage('goals')}
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
            <div className="absolute bottom-28 right-6 left-6 flex justify-end items-center pointer-events-none gap-3 z-30">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex gap-2 pointer-events-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-2 rounded-full shadow-2xl"
                >
                    <button
                        onClick={() => setShowMicModal(true)}
                        className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 active:scale-90 transition-all"
                    >
                        <Mic size={20} />
                    </button>
                    <button
                        onClick={() => setShowNoteModal(true)}
                        className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 active:scale-90 transition-all border-l border-slate-200 dark:border-slate-700 pl-1"
                    >
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

            {/* Modals and Overlays */}
            <AnimatePresence>


                {/* Task Selector Bottom Sheet */}
                {showTaskSelector && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[60] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm"
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
                    </motion.div>
                )}

                {/* Reschedule Modal */}
                {showRescheduleModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-3xl p-6 shadow-2xl"
                        >
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Reschedule Session</h3>
                            <p className="text-xs text-slate-500 mb-6">Adjust the time for <span className="font-bold text-slate-700 dark:text-slate-300">{activeRescheduleSession?.title}</span></p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                                    <button
                                        onClick={() => {
                                            // Optional: decrement time
                                        }}
                                        className="text-blue-600 hover:scale-110 active:scale-90 transition-transform"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="font-bold text-lg">{activeRescheduleSession?.time}</span>
                                    <button
                                        onClick={() => {
                                            // Optional: increment time
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
                    </motion.div>
                )}



                {/* Voice Capture Modal */}
                {showMicModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[80] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-3xl p-8 shadow-2xl text-center"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Voice Capture</h2>
                                <button onClick={() => setShowMicModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="relative w-24 h-24 mx-auto mb-8">
                                <motion.div
                                    animate={isListening ? { scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] } : {}}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-blue-600 rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-blue-600 rounded-full text-white shadow-xl shadow-blue-600/40">
                                    <Mic size={40} strokeWidth={1.5} />
                                </div>
                            </div>

                            <p className="text-slate-800 dark:text-slate-200 font-bold mb-8 text-[11px] uppercase tracking-widest">
                                {isListening ? "Listening..." : "Ready to record"}
                            </p>

                            <button
                                onClick={handleProcessVoice}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98] transition-all"
                            >
                                {isListening ? "Processing..." : "Start Recording"}
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Quick Note Modal */}
                {showNoteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[80] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Quick Capture</h2>
                                <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <textarea
                                value={quickNote}
                                onChange={(e) => setQuickNote(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full h-32 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all resize-none mb-6"
                                autoFocus
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowNoteModal(false)}
                                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveNote}
                                    disabled={!quickNote}
                                    className={`flex-1 py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98] text-xs uppercase tracking-widest ${quickNote
                                        ? 'bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-700'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    Add to Inbox
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Dashboard
