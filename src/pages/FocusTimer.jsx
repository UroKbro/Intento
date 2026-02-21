import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Square, Plus, Minus, Brain, MessageSquare, Shield, MoreHorizontal, ChevronLeft } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'

const FocusTimer = () => {
    const { timerState, setTimerState, setCurrentPage, tasks, logSession } = useApp()
    const [isDeepMode, setIsDeepMode] = useState(false)
    const [showNoteModal, setShowNoteModal] = useState(false)
    const [showOptionsMenu, setShowOptionsMenu] = useState(false)
    const [note, setNote] = useState(timerState.notes || '')

    const activeTask = tasks.find(t => t.id === timerState.activeTaskId) || tasks[0]

    const timerRef = useRef(null)

    useEffect(() => {
        if (timerState.isActive && timerState.timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimerState(prev => ({
                    ...prev,
                    timeLeft: prev.timeLeft - 1,
                    totalFocusTime: prev.totalFocusTime + 1
                }))
            }, 1000)
        } else {
            clearInterval(timerRef.current)
        }

        if (timerState.timeLeft === 0 && timerState.isActive) {
            handleEndSession()
        }

        return () => clearInterval(timerRef.current)
    }, [timerState.isActive, timerState.timeLeft])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleToggleTimer = () => {
        setTimerState(prev => ({ ...prev, isActive: !prev.isActive }))
    }

    const handleAdjustTime = (amount) => {
        setTimerState(prev => ({
            ...prev,
            timeLeft: Math.max(0, prev.timeLeft + amount)
        }))
    }

    const handleLogDistraction = () => {
        setTimerState(prev => ({ ...prev, distractions: prev.distractions + 1 }))
    }

    const handleEndSession = () => {
        logSession()
        setCurrentPage('reflection')
    }

    const progress = (1 - timerState.timeLeft / (25 * 60)) * 100

    return (
        <div className={`relative w-full flex flex-col min-h-screen pb-12 transition-colors duration-700 ${isDeepMode ? 'bg-[#0a0f16]' : 'bg-[#f6f7f8] dark:bg-[#0a0f16]'}`}>
            {!isDeepMode && (
                <header className="pt-12 px-6 pb-6 flex justify-between items-center">
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="p-2 -ml-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Focusing: {activeTask?.title}</span>
                    </div>
                    <button
                        onClick={() => setShowOptionsMenu(true)}
                        className="p-2 -mr-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800 transition-colors"
                    >
                        <MoreHorizontal size={24} className="text-slate-600 dark:text-slate-300" />
                    </button>
                </header>
            )}

            <main className="flex-1 flex flex-col items-center justify-center px-8 relative">
                {/* Timer Display */}
                <div className="relative w-72 h-72 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="144"
                            cy="144"
                            r="135"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-slate-200 dark:text-slate-800"
                        />
                        <motion.circle
                            cx="144"
                            cy="144"
                            r="135"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            className="text-blue-600"
                            initial={{ strokeDasharray: "848 848", strokeDashoffset: 848 }}
                            animate={{ strokeDashoffset: 848 - (848 * progress) / 100 }}
                            transition={{ duration: 0.5, ease: "linear" }}
                        />
                    </svg>
                    <div className="text-center z-10">
                        <motion.span
                            key={timerState.timeLeft}
                            initial={{ scale: 0.95, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-6xl font-black tracking-tighter ${isDeepMode ? 'text-white' : 'text-slate-900 dark:text-white'}`}
                        >
                            {formatTime(timerState.timeLeft)}
                        </motion.span>
                    </div>
                </div>

                {/* Main Controls */}
                <div className="mt-12 flex items-center gap-6">
                    <button
                        onClick={() => handleAdjustTime(-300)}
                        className={`p-4 rounded-full transition-colors ${isDeepMode ? 'text-white/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                    >
                        <Minus size={24} />
                    </button>
                    <button
                        onClick={handleToggleTimer}
                        className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-600/40 active:scale-90 transition-all hover:scale-105"
                    >
                        {timerState.isActive ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" className="ml-1" />}
                    </button>
                    <button
                        onClick={() => handleAdjustTime(300)}
                        className={`p-4 rounded-full transition-colors ${isDeepMode ? 'text-white/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                    >
                        <Plus size={24} />
                    </button>
                </div>

                <div className="mt-8 flex items-center gap-4">
                    <button
                        onClick={handleEndSession}
                        className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${isDeepMode ? 'bg-white/10 text-white' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100'}`}
                    >
                        End Session
                    </button>
                </div>
            </main>

            {/* Micro-interaction Buttons */}
            <div className={`px-6 pb-12 flex justify-between items-center transition-opacity ${isDeepMode ? 'opacity-20 hover:opacity-100' : 'opacity-100'}`}>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleLogDistraction}
                        className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all ${isDeepMode ? 'bg-white/5 text-white/60' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95'}`}
                    >
                        <Brain size={18} className="text-amber-500" />
                        <div className="text-left">
                            <span className="block text-[10px] font-bold uppercase tracking-tighter leading-none">Distraction</span>
                            <span className="text-xs font-black">{timerState.distractions}</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setShowNoteModal(true)}
                        className={`p-3 rounded-2xl transition-all ${isDeepMode ? 'bg-white/5 text-white/60' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm'}`}
                    >
                        <MessageSquare size={20} className="text-blue-500" />
                    </button>
                </div>

                <button
                    onClick={() => setIsDeepMode(!isDeepMode)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all ${isDeepMode ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm'}`}
                >
                    <Shield size={18} className={isDeepMode ? 'text-white' : 'text-blue-600'} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Deep Mode</span>
                </button>
            </div>

            {/* Quick Note Modal */}
            <AnimatePresence>
                {showNoteModal && (
                    <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                        >
                            <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Quick Note</h3>
                            <textarea
                                autoFocus
                                className="w-full h-32 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none resize-none mb-4"
                                placeholder="Type your thought..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowNoteModal(false)}
                                    className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setTimerState(prev => ({ ...prev, notes: note }))
                                        setShowNoteModal(false)
                                    }}
                                    className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-white bg-blue-600 rounded-xl"
                                >
                                    Save Note
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* More Options Modal */}
            <AnimatePresence>
                {showOptionsMenu && (
                    <div className="absolute inset-0 z-[110] flex items-end justify-center bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[32px] p-8 pb-12 shadow-2xl"
                        >
                            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-8"></div>
                            <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Session Options</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setTimerState(prev => ({ ...prev, timeLeft: 1500, isActive: false }))
                                        setShowOptionsMenu(false)
                                    }}
                                    className="w-full py-4 px-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-left flex items-center gap-4 group"
                                >
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-xl">
                                        <Square size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Restart Session</p>
                                        <p className="text-xs text-slate-500">Reset the timer to 25:00</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsDeepMode(!isDeepMode)
                                        setShowOptionsMenu(false)
                                    }}
                                    className="w-full py-4 px-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-left flex items-center gap-4"
                                >
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900 text-purple-600 rounded-xl">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{isDeepMode ? 'Disable' : 'Enable'} Deep Mode</p>
                                        <p className="text-xs text-slate-500">Full screen minimalist focus</p>
                                    </div>
                                </button>
                            </div>
                            <button
                                onClick={() => setShowOptionsMenu(false)}
                                className="w-full mt-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-500"
                            >
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default FocusTimer
