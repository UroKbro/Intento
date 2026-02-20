import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, Calendar, Target, ListTodo, TrendingUp, Play } from 'lucide-react'
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
    const { currentPage, setCurrentPage } = useApp()

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

    return (
        <div className="relative w-full max-w-md bg-[#f6f7f8] dark:bg-[#0a0f16] shadow-2xl min-h-screen h-screen overflow-hidden flex flex-col">
            <div className="flex-grow overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, scale: 0.98, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, y: -4 }}
                        transition={{
                            duration: 0.35,
                            ease: [0.23, 1, 0.32, 1] // Custom ease-out cubic
                        }}
                        className="min-h-full"
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
        </div>
    )
}

function App() {
    return (
        <AppProvider>
            <div className="flex justify-center min-h-screen bg-[#f6f7f8] dark:bg-[#0a0f16]">
                <AppContent />
            </div>
        </AppProvider>
    )
}

export default App
