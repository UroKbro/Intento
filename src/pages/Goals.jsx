import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Share2, Flame, CheckCircle2, MoreHorizontal, History, TrendingUp, CalendarCheck, Coffee, Moon, Play, Edit2, Plus, Calendar, PauseCircle, Trash2, BarChart2, Clock, Zap, AlertCircle, X, Check } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'

const Goals = () => {
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

    const { goals, tasks, updateGoal, deleteGoal, setCurrentPage, activeGoalId, addTask, setTimerState } = useApp()
    const [showEditModal, setShowEditModal] = useState(false)
    const [showAddTaskModal, setShowAddTaskModal] = useState(false)
    const [editedGoal, setEditedGoal] = useState(null)
    const [newTask, setNewTask] = useState({ title: '', priority: 2, estimatedDuration: 30, category: 'Deep Work' })

    // Find the current goal based on activeGoalId
    const goal = useMemo(() => goals.find(g => g.id === activeGoalId) || goals[0], [goals, activeGoalId])

    const goalTasks = useMemo(() => tasks.filter(t => t.goalName === goal.title || t.goalId === goal.id), [tasks, goal])
    const contributions = useMemo(() => goalTasks.map(t => ({
        id: t.id,
        title: t.title,
        time: t.logged,
        progress: t.status === 'completed' ? 100 : (t.status === 'active' ? 50 : 0),
        status: t.status
    })), [goalTasks])

    const heatmap = [
        [0, 20, 60, 0, 40, 0, 0],
        [40, 80, 100, 60, 40, 20, 0],
        [20, 40, 20, 0, 0, 0, 0],
    ]

    const handlePauseGoal = () => {
        updateGoal(goal.id, { status: goal.status === 'paused' ? 'active' : 'paused' })
    }

    const handleDeleteGoal = () => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            deleteGoal(goal.id)
            setCurrentPage('goals')
        }
    }

    const handleShareGoal = () => {
        const shareData = {
            title: `Check out my progress on ${goal.title}`,
            text: `I've reached ${goal.progress}% progress on my goal: ${goal.title}!`,
            url: window.location.href
        }

        if (navigator.share) {
            navigator.share(shareData).catch(console.error)
        } else {
            navigator.clipboard.writeText(window.location.href)
            alert('Goal link copied to clipboard!')
        }
    }

    const handleSaveGoal = () => {
        updateGoal(goal.id, editedGoal)
        setShowEditModal(false)
    }

    const handleCreateTask = () => {
        if (!newTask.title) return
        addTask({
            ...newTask,
            goalId: goal.id,
            goalName: goal.title,
            color: goal.color
        })
        setShowAddTaskModal(false)
        setNewTask({ title: '', priority: 2, estimatedDuration: 30, category: 'Deep Work' })
    }

    const handleWork = () => {
        // Find the first active or pending task for this goal
        const targetTask = goalTasks.find(t => t.status === 'active') || goalTasks.find(t => t.status === 'pending')

        if (targetTask) {
            setTimerState(prev => ({ ...prev, activeTaskId: targetTask.id }))
        }
        setCurrentPage('focus')
    }

    const handleTaskClick = (taskId) => {
        setTimerState(prev => ({ ...prev, activeTaskId: taskId }))
        setCurrentPage('focus')
    }

    return (
        <div className="relative w-full flex flex-col min-h-screen pb-40 bg-[#f6f7f8] dark:bg-[#0a0f16]">
            <header className="pt-12 px-6 pb-6 flex items-center justify-between z-10">
                <button
                    onClick={() => setCurrentPage('goals')}
                    className="p-2 -ml-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800 transition-colors"
                >
                    <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
                </button>
                <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white truncate max-w-[200px]">{goal.title}</h1>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            setEditedGoal({ ...goal })
                            setShowEditModal(true)
                        }}
                        className="p-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800 transition-colors"
                    >
                        <Edit2 size={20} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <button
                        onClick={handleShareGoal}
                        className="p-2 -mr-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800 transition-colors"
                    >
                        <Share2 size={20} className="text-slate-600 dark:text-slate-300" />
                    </button>
                </div>
            </header>

            <main className="px-6 pt-6 space-y-8">
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-blue-600/10 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Primary Objective</span>
                            <span className="flex items-center gap-1 text-amber-500 text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full">
                                <Flame size={12} /> {goal.streak} Day Streak
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePauseGoal}
                                className={`p-2 rounded-lg transition-colors ${goal.status === 'paused' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                            >
                                <PauseCircle size={18} />
                            </button>
                            <button
                                onClick={handleDeleteGoal}
                                className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-3xl font-black text-slate-900 dark:text-white">{goal.progress}<span className="text-lg text-slate-400 font-medium">%</span></span>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Overall Completion</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-slate-900 dark:text-white">{goal.timeLogged}h</span>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">of {goal.timeTarget}h Target</p>
                            </div>
                        </div>
                        <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-blue-600 rounded-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-6">
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddTaskModal(true)}
                            className="flex flex-col items-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
                        >
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                                <Plus size={20} />
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Add Task</span>
                        </motion.button>
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleWork}
                            className="flex flex-col items-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
                        >
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center">
                                <Play size={20} fill="currentColor" />
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Work</span>
                        </motion.button>
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage('planner')}
                            className="flex flex-col items-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
                        >
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center">
                                <Calendar size={20} />
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Schedule</span>
                        </motion.button>
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage('insights')}
                            className="flex flex-col items-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
                        >
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center">
                                <BarChart2 size={20} />
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Stats</span>
                        </motion.button>
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Task Contribution</h3>
                        <span className="text-[10px] text-slate-400 font-medium">{goalTasks.length} Tasks Logged</span>
                    </div>
                    <motion.div
                        className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {contributions.map((task, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ backgroundColor: "rgba(37, 99, 235, 0.05)" }}
                                onClick={() => handleTaskClick(task.id)}
                                className={`p-4 flex items-center gap-4 cursor-pointer ${task.status === 'active' ? 'bg-blue-600/5' : ''}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                    task.status === 'active' ? 'bg-blue-600/10 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                    }`}>
                                    {task.status === 'completed' ? <CheckCircle2 size={20} /> : <History size={20} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <h4 className={`text-sm font-semibold truncate ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                                            {task.title}
                                        </h4>
                                        <span className={`text-xs font-bold ${task.status === 'active' ? 'text-blue-600' : 'text-slate-400'}`}>{task.time || '0m'}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${task.progress}%` }}
                                            transition={{ duration: 1, delay: 0.2 * idx }}
                                            className={`h-full rounded-full ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-600'}`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {contributions.length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-sm text-slate-400">No tasks linked to this goal yet.</p>
                                <button
                                    onClick={() => setShowAddTaskModal(true)}
                                    className="text-blue-600 text-xs font-bold mt-2 uppercase"
                                >
                                    Create First Task
                                </button>
                            </div>
                        )}
                    </motion.div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Focus Intensity</h3>
                        <span className="text-[10px] text-blue-600 font-bold">Peak: 9:00 AM</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="grid grid-cols-8 gap-2">
                            <div className="text-[8px] font-bold text-slate-400 flex items-end pb-1 uppercase">Time</div>
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                                <div key={d} className={`text-[8px] font-bold text-center uppercase ${d === 'W' ? 'text-blue-600' : 'text-slate-400'}`}>{d}</div>
                            ))}

                            {heatmap.map((row, rowIdx) => (
                                <div key={rowIdx} className="contents">
                                    <div className="text-[9px] font-medium text-slate-400 self-center">{['08:00', '09:00', '10:00'][rowIdx]}</div>
                                    {row.map((val, colIdx) => (
                                        <div
                                            key={`${rowIdx}-${colIdx}`}
                                            className={`aspect-square rounded-md transition-all ${val === 100 ? 'bg-blue-600 ring-2 ring-blue-600/20 ring-offset-2 dark:ring-offset-slate-900' :
                                                val === 80 ? 'bg-blue-600/80' :
                                                    val === 60 ? 'bg-blue-600/60' :
                                                        val === 40 ? 'bg-blue-600/40' :
                                                            val === 20 ? 'bg-blue-600/20' : 'bg-slate-100 dark:bg-slate-800'
                                                }`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Linked Habit Stacks</h3>
                        <button className="text-[10px] font-bold text-blue-600 uppercase">Edit Stacks</button>
                    </div>
                    <motion.div
                        className="space-y-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {goal.habits?.map(habit => (
                            <motion.div
                                key={habit.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4"
                            >
                                <div className={`w-12 h-12 bg-${habit.color}-500/10 rounded-full flex items-center justify-center text-${habit.color}-500`}>
                                    {habit.color === 'orange' ? <Coffee size={24} /> : (habit.color === 'violet' ? <Moon size={24} /> : <Zap size={24} />)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{habit.title}</h4>
                                    <p className="text-[11px] text-slate-500">{habit.detail}</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className={`text-xs font-black text-${habit.color}-500`}>{habit.match}</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase">Match</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            </main>

            <div className="absolute bottom-24 left-6 right-6 pointer-events-none z-30">
                <div className="w-full flex items-center gap-3 pointer-events-auto">
                    <button
                        onClick={handleWork}
                        className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:bg-slate-800 dark:hover:bg-slate-100"
                    >
                        <Play size={20} fill="currentColor" />
                        RESUME SESSION
                    </button>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showEditModal && editedGoal && (
                    <div className="absolute inset-0 z-[60] flex items-end justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[32px] p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Goal</h2>
                                <button onClick={() => setShowEditModal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1">Title</label>
                                    <input
                                        type="text"
                                        value={editedGoal.title}
                                        onChange={(e) => setEditedGoal({ ...editedGoal, title: e.target.value })}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1">Target Hours</label>
                                        <input
                                            type="number"
                                            value={editedGoal.timeTarget}
                                            onChange={(e) => setEditedGoal({ ...editedGoal, timeTarget: parseInt(e.target.value) })}
                                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1">Deadline</label>
                                        <input
                                            type="date"
                                            value={editedGoal.targetDate}
                                            onChange={(e) => setEditedGoal({ ...editedGoal, targetDate: e.target.value })}
                                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveGoal}
                                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showAddTaskModal && (
                    <div className="absolute inset-0 z-[60] flex items-end justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[32px] p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Add Task</h2>
                                <button onClick={() => setShowAddTaskModal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1">Task Title</label>
                                    <input
                                        type="text"
                                        placeholder="What needs to be done?"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                                        autoFocus
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1">Priority</label>
                                        <select
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: parseInt(e.target.value) })}
                                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none appearance-none"
                                        >
                                            <option value={1}>High</option>
                                            <option value={2}>Medium</option>
                                            <option value={3}>Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Category</label>
                                        <select
                                            value={newTask.category}
                                            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none appearance-none"
                                        >
                                            {['Deep Work', 'Health', 'Personal', 'Inbox'].map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Est. Minutes</label>
                                        <input
                                            type="number"
                                            value={newTask.estimatedDuration}
                                            onChange={(e) => setNewTask({ ...newTask, estimatedDuration: parseInt(e.target.value) })}
                                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleCreateTask}
                                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all"
                                >
                                    Create Task
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Goals
