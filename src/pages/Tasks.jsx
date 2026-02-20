import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Mic, SortAsc, Play, Timer, Lock, CheckCircle2, GripVertical, Pause, Search, Filter, Archive, Check, X, ChevronRight, Clock, Hash, ChevronDown } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'

const Tasks = () => {
    const { tasks, goals, addTask, updateTask, completeTask, archiveTask, setCurrentPage, setSelectedTask } = useApp()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedGoalFilter, setSelectedGoalFilter] = useState('All')
    const [sortBy, setSortBy] = useState('priority')
    const [showNewTaskModal, setShowNewTaskModal] = useState(false)
    const [showSortSheet, setShowSortSheet] = useState(false)
    const [newTask, setNewTask] = useState({ title: '', goalId: '', priority: 1, estimatedDuration: 30, category: 'Deep Work' })

    const tabs = ['Deep Work', 'Health', 'Personal', 'Archived']
    const [activeTab, setActiveTab] = useState('Deep Work')

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesGoal = selectedGoalFilter === 'All' || task.goalName === selectedGoalFilter
            const matchesTab = (activeTab === 'Archived' && task.status === 'archived') || (task.category === activeTab && task.status !== 'archived')
            return matchesSearch && matchesGoal && matchesTab
        }).sort((a, b) => {
            if (sortBy === 'priority') return a.priority - b.priority
            if (sortBy === 'alphabetical') return a.title.localeCompare(b.title)
            if (sortBy === 'timeSpent') return (b.timeSpent || 0) - (a.timeSpent || 0)
            if (sortBy === 'recent') return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
            return 0
        })
    }, [tasks, searchQuery, selectedGoalFilter, activeTab, sortBy])

    const completedTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesGoal = selectedGoalFilter === 'All' || task.goalName === selectedGoalFilter
            const matchesTab = task.category === activeTab
            return matchesSearch && matchesGoal && matchesTab && task.status === 'completed'
        })
    }, [tasks, searchQuery, selectedGoalFilter, activeTab])

    const handleToggleComplete = (id) => {
        const task = tasks.find(t => t.id === id)
        if (task.status === 'completed') {
            updateTask(id, { status: 'pending' })
        } else {
            completeTask(id)
        }
    }

    const handleArchive = (id) => {
        archiveTask(id)
    }

    const handleCreateTask = () => {
        if (!newTask.title) return
        const goal = goals.find(g => g.id === parseInt(newTask.goalId))
        addTask({
            ...newTask,
            goalName: goal ? goal.title.toUpperCase() : 'GENERAL',
            goalId: newTask.goalId ? parseInt(newTask.goalId) : null
        })

        // If linked to goal, update progress slightly (mock logic)
        if (goal) {
            updateTask(null, null) // Just to trigger any side effects if any, though updateGoal is better
            // In a real app we'd recalculate based on task completion
        }

        setShowNewTaskModal(false)
        setNewTask({ title: '', goalId: '', priority: tasks.length + 1, estimatedDuration: 30, category: activeTab })
    }

    const handleStartFocus = (task) => {
        setSelectedTask(task)
        setCurrentPage('focus')
    }

    return (
        <div className="flex flex-col min-h-screen pb-40">
            <header className="pt-12 px-6 pb-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <select
                                value={selectedGoalFilter}
                                onChange={(e) => setSelectedGoalFilter(e.target.value)}
                                className="appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-1.5 pl-3 pr-8 text-[11px] font-bold text-blue-600 uppercase tracking-widest focus:ring-2 focus:ring-blue-600/50 outline-none cursor-pointer"
                            >
                                <option value="All">All Goals</option>
                                {goals.map(goal => (
                                    <option key={goal.id} value={goal.title}>{goal.title}</option>
                                ))}
                            </select>
                            <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none" />
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSortSheet(true)}
                        className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                    >
                        <SortAsc size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                </div>
                <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Intentional Flow</p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Task Alignment</h1>
                </div>
            </header>

            <div className="px-6 py-2 sticky top-0 z-20 bg-[#f6f7f8]/80 dark:bg-[#0a0f16]/80 backdrop-blur-md">
                <div className="relative group">
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800/80 p-1.5 pl-4 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-blue-600/50 transition-all">
                        <Search size={18} className="text-slate-400 shrink-0" />
                        <input
                            className="flex-grow bg-transparent border-none focus:ring-0 text-[15px] placeholder-slate-400 dark:placeholder-slate-500 py-2 outline-none"
                            placeholder="Search tasks..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="flex items-center gap-1">
                            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                <Mic size={20} />
                            </button>
                            <button
                                onClick={() => setShowNewTaskModal(true)}
                                className="bg-blue-600 text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 active:scale-95 transition-transform"
                            >
                                <Plus size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-3 overflow-x-auto custom-scrollbar pb-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${activeTab === tab
                                ? 'bg-blue-600/10 border-blue-600/20 text-blue-600'
                                : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${tab === 'Deep Work' ? 'bg-blue-600' : tab === 'Health' ? 'bg-emerald-500' : 'bg-purple-500'
                                }`}></span>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex-grow px-6 mt-4">
                {filteredTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Search size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium">No tasks found matching your search.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedGoalFilter('All'); }}
                            className="mt-4 text-blue-600 text-xs font-bold uppercase tracking-widest"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Sequence • Priority Flow</h2>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence initial={false}>
                            {filteredTasks.filter(t => t.status !== 'completed').map((task) => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ x: 2 }}
                                    className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all ${task.status === 'locked'
                                        ? 'bg-slate-50 dark:bg-slate-800/20 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/60 shadow-sm'
                                        } ${task.status === 'active' ? 'border-l-4 border-l-blue-600' : ''}`}
                                >
                                    <div className={`absolute -left-2 -top-2 w-6 h-6 text-[10px] font-black rounded-full flex items-center justify-center shadow-md ${task.status === 'active' ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white'
                                        }`}>
                                        {task.priority}
                                    </div>

                                    <div className="relative flex items-center justify-center">
                                        <button
                                            onClick={() => handleToggleComplete(task.id)}
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'completed' ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600'}`}
                                        >
                                            {task.status === 'completed' && <Check size={14} className="text-white" />}
                                        </button>
                                    </div>

                                    <div className="flex-grow cursor-pointer" onClick={() => { }}> {/* Should open task detail view */}
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className={`font-semibold text-[15px] ${task.status === 'locked' ? 'text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                                                {task.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-tight">
                                                GOAL: {task.goalName}
                                            </span>
                                            <span className={`flex items-center gap-1 text-[11px] font-medium ${task.status === 'active' ? 'text-blue-600' : 'text-slate-400'}`}>
                                                <Timer size={12} /> {task.logged} {task.logged !== '0m' ? 'logged' : ''}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {task.status !== 'locked' && (
                                            <button
                                                onClick={() => handleStartFocus(task)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Play size={18} fill="currentColor" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleArchive(task.id)}
                                            className="p-2 text-slate-400 hover:text-amber-600 transition-colors"
                                        >
                                            <Archive size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Accomplished</h2>
                    </div>
                    <div className="space-y-3">
                        {completedTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                layout
                                className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800/20 p-4 rounded-2xl opacity-60"
                            >
                                <button onClick={() => handleToggleComplete(task.id)}>
                                    <CheckCircle2 size={20} className="text-blue-600" />
                                </button>
                                <div className="flex-grow">
                                    <h3 className="font-medium text-[15px] line-through text-slate-500">{task.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold uppercase tracking-tight">
                                            GOAL: {task.goalName}
                                        </span>
                                        <span className="text-[11px] text-slate-400">{task.logged} logged</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Persistent Focus Bar */}
            <div className="fixed bottom-24 left-6 right-6 pointer-events-none z-40">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-blue-600/95 text-white p-3 rounded-2xl shadow-2xl shadow-blue-600/30 pointer-events-auto flex items-center justify-between border border-white/20 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-blue-400 flex items-center justify-center">
                                <Play size={20} fill="white" />
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Currently Focusing</p>
                            <p className="text-[13px] font-semibold truncate max-w-[150px]">Refine Product Roadmap...</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-black/20 rounded-lg text-xs font-mono">42:18</div>
                        <button className="w-9 h-9 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-inner hover:bg-blue-50 transition-colors">
                            <Pause size={20} fill="currentColor" />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* New Task Modal */}
            <AnimatePresence>
                {showNewTaskModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Task</h2>
                                <button onClick={() => setShowNewTaskModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Task Title</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                                        placeholder="What needs to be done?"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Linked Goal</label>
                                    <div className="relative">
                                        <select
                                            value={newTask.goalId}
                                            onChange={(e) => setNewTask({ ...newTask, goalId: e.target.value })}
                                            className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 pr-10 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                                        >
                                            <option value="">No specific goal</option>
                                            {goals.map(goal => (
                                                <option key={goal.id} value={goal.id}>{goal.title}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Priority</label>
                                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                                            {[1, 2, 3, 4].map(p => (
                                                <button
                                                    key={p}
                                                    onClick={() => setNewTask({ ...newTask, priority: p })}
                                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${newTask.priority === p ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-400'}`}
                                                >
                                                    P{p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Duration (min)</label>
                                        <input
                                            type="number"
                                            value={newTask.estimatedDuration}
                                            onChange={(e) => setNewTask({ ...newTask, estimatedDuration: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateTask}
                                    disabled={!newTask.title}
                                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs mt-4 transition-all ${newTask.title
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98]'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    Save Task
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Sort Bottom Sheet */}
            <AnimatePresence>
                {showSortSheet && (
                    <div
                        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowSortSheet(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white dark:bg-slate-900 w-full rounded-t-[2.5rem] p-8 shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-8" />
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Sort Tasks</h2>

                            <div className="space-y-2">
                                {[
                                    { id: 'priority', label: 'Priority', icon: Hash },
                                    { id: 'timeSpent', label: 'Time Spent', icon: Clock },
                                    { id: 'recent', label: 'Recent Activity', icon: Pause },
                                    { id: 'alphabetical', label: 'Alphabetical', icon: SortAsc },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            setSortBy(option.id)
                                            setShowSortSheet(false)
                                        }}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${sortBy === option.id
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <option.icon size={20} />
                                            <span className="font-bold text-sm uppercase tracking-wider">{option.label}</span>
                                        </div>
                                        {sortBy === option.id && <Check size={20} />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Tasks
