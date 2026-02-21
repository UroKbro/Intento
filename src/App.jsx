import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, Calendar, Target, ListTodo, TrendingUp, Play, Plus, X, Star } from 'lucide-react'
import { AppProvider, useApp } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import Planner from './pages/Planner'
import Tasks from './pages/Tasks'
import Insights from './pages/Insights'
import GoalsOverview from './pages/GoalsOverview'
import Goals from './pages/Goals'
import FocusTimer from './pages/FocusTimer'
import Reflection from './pages/Reflection'
import Settings from './pages/Settings'

function AppContent() {
    const {
        currentPage, setCurrentPage,
        showNewGoalModal, setShowNewGoalModal,
        newGoal, setNewGoal,
        showBreakintoTasksPrompt, setShowBreakintoTasksPrompt,
        addGoal, goals
    } = useApp()

    const navItems = [
        { id: 'home', icon: <LayoutGrid size={24} />, label: 'Home' },
        { id: 'goals', icon: <Target size={24} />, label: 'Goals' },
        { id: 'focus', icon: <Play size={24} fill="currentColor" />, label: 'Focus', isPrimary: true },
        { id: 'tasks', icon: <ListTodo size={24} />, label: 'Tasks' },
        { id: 'insights', icon: <TrendingUp size={24} />, label: 'Insights' },
    ]

    const renderPage = () => {
        switch (currentPage) {
            case 'home': return <Dashboard />
            case 'planner': return <Planner />
            case 'tasks': return <Tasks />
            case 'insights': return <Insights />
            case 'goals': return <GoalsOverview />
            case 'goal-detail': return <Goals />
            case 'focus': return <FocusTimer />
            case 'reflection': return <Reflection />
            case 'settings': return <Settings />
            default: return <Dashboard />
        }
    }

    // Hide navigation bar on Focus and Reflection pages for maximum immersion
    const hideNav = currentPage === 'focus' || currentPage === 'reflection'

    const handleCreateGoal = () => {
        if (!newGoal.title) return
        addGoal({
            title: newGoal.title,
            milestone: 'Breaking ground',
            progress: 0,
            targetDate: newGoal.deadline || 'Set date',
            color: newGoal.color,
            status: 'active',
            timeTarget: parseInt(newGoal.timeTarget) || 0,
            timeLogged: 0,
            description: newGoal.desc,
            category: newGoal.category
        })
        setShowNewGoalModal(false)
        setShowBreakintoTasksPrompt(true)
        setNewGoal({ title: '', desc: '', timeTarget: '', color: 'blue', deadline: '', category: 'Deep Work' })
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 }
    }

    return (
        <div className="relative w-full max-w-md bg-[#f6f7f8] dark:bg-[#0a0f16] shadow-2xl min-h-screen h-screen overflow-hidden flex flex-col">
            <div className="flex-grow overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, scale: 0.98, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 1.02, x: -10 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1] // Custom quintic ease-out sweep
                        }}
                        className="min-h-full w-full"
                    >
                        {renderPage()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Glass Navigation */}
            {!hideNav && (
                <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[32px] shadow-2xl flex items-center justify-around px-2 z-50">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`relative flex flex-col items-center justify-center transition-all duration-300 ${item.isPrimary
                                ? 'w-16 h-16 -mt-12 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-600/40 border-4 border-[#f6f7f8] dark:border-[#0a0f16] hover:scale-110 active:scale-95'
                                : 'w-12 h-12 rounded-2xl'
                                } ${currentPage === item.id && !item.isPrimary ? 'text-blue-600' : 'text-slate-400 dark:text-slate-500'}`}
                        >
                            {item.icon}
                            {!item.isPrimary && (
                                <span className={`text-[10px] font-bold mt-1 uppercase tracking-tighter ${currentPage === item.id ? 'opacity-100' : 'opacity-0 scale-75'
                                    } transition-all`}>
                                    {item.label}
                                </span>
                            )}
                            {currentPage === item.id && !item.isPrimary && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-blue-600/5 dark:bg-blue-600/10 rounded-2xl -z-10"
                                />
                            )}
                        </button>
                    ))}
                </nav>
            )}

            {/* Modals and Overlays */}
            <AnimatePresence>
                {/* New Goal Modal */}
                {showNewGoalModal && (
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
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Target Hours</label>
                                        <input
                                            type="number"
                                            value={newGoal.timeTarget}
                                            onChange={(e) => setNewGoal({ ...newGoal, timeTarget: e.target.value })}
                                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Deadline</label>
                                        <input
                                            type="date"
                                            value={newGoal.deadline}
                                            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                                        />
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
                    </motion.div>
                )}

                {/* Break into Tasks Prompt */}
                {showBreakintoTasksPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[70] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-3xl p-8 shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Star size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Goal Created!</h2>
                            <p className="text-sm text-slate-500 mb-8">Would you like to break this goal into smaller tasks now?</p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        setShowBreakintoTasksPrompt(false)
                                        setCurrentPage('tasks')
                                    }}
                                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98] transition-all"
                                >
                                    Yes, break it down
                                </button>
                                <button
                                    onClick={() => setShowBreakintoTasksPrompt(false)}
                                    className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Maybe later
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function App() {
    return (
        <AppProvider>
            <div className="w-full flex justify-center min-h-screen bg-[#f6f7f8] dark:bg-[#0a0f16]">
                <AppContent />
            </div>
        </AppProvider>
    )
}

export default App
