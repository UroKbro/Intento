import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Calendar, CheckCircle2, Repeat, Target, Bolt, Brain, Plus, ChevronRight, ChevronLeft, AlertTriangle, X, Clock, Trash2 } from 'lucide-react'
import { useState, useMemo, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'

const Planner = () => {
    const { sessions, deleteSession, addSession, updateSession, tasks, setCurrentPage, selectedTask } = useApp()
    const suggestionRef = useRef(null)

    // Get current date at midnight for calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [currentDate, setCurrentDate] = useState(today)
    const [selectedDay, setSelectedDay] = useState(today.getDate())
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingSession, setEditingSession] = useState(null)
    const [newSessionTitle, setNewSessionTitle] = useState('')

    // Form states
    const [title, setTitle] = useState('')
    const [time, setTime] = useState('09 AM')
    const [duration, setDuration] = useState(1)
    const [taskId, setTaskId] = useState('')
    const [repeat, setRepeat] = useState(false)

    useEffect(() => {
        if (selectedTask) {
            setNewSessionTitle(selectedTask.title)
            // Auto-scroll to suggestion if selected task is set from dashboard
            setTimeout(() => {
                suggestionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 500)
        }
    }, [selectedTask])

    // Calculate start of the current week (Monday)
    const getWeekStart = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    const weekStart = useMemo(() => {
        const start = getWeekStart(currentDate);
        start.setHours(0, 0, 0, 0);
        return start;
    }, [currentDate]);

    const days = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            return {
                name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                date: d.getDate(),
                fullDate: d
            };
        });
    }, [weekStart]);

    const navigateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    }

    const goToToday = () => {
        setCurrentDate(today);
        setSelectedDay(today.getDate());
    }

    const daySessions = useMemo(() => sessions.filter(s => {
        // Handle sessions with date only or fullDate
        if (s.fullDate) {
            const d = new Date(s.fullDate)
            return d.getDate() === selectedDay && d.getMonth() === currentDate.getMonth()
        }
        return s.date === selectedDay
    }), [sessions, selectedDay, currentDate]);

    const handleOpenModal = (session = null) => {
        if (session) {
            setEditingSession(session)
            setTitle(session.title || '')
            setTime(session.time || '09 AM')
            setDuration(session.duration || 1)
            setTaskId(session.taskId || '')
            setRepeat(session.repeat || false)
        } else {
            setEditingSession(null)
            setTitle(selectedTask?.title || '')
            setTime('09 AM')
            setDuration(1)
            setTaskId(selectedTask?.id || '')
            setRepeat(false)
        }
        setIsModalOpen(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const sessionData = {
            title,
            time,
            duration: parseFloat(duration),
            taskId,
            repeat,
            date: selectedDay,
            fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay),
            color: 'blue',
            type: 'WORK'
        }

        if (editingSession) {
            updateSession(editingSession.id, sessionData)
        } else {
            addSession(sessionData)
        }
        setIsModalOpen(false)
    }

    const handleDelete = () => {
        if (editingSession) {
            deleteSession(editingSession.id)
            setIsModalOpen(false)
        }
    }

    const modalVariants = {
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="relative w-full flex flex-col min-h-screen pb-40 bg-[#f6f7f8] dark:bg-[#0a0f16]">
            <header className="px-6 py-4 pt-12">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigateWeek(-1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <ChevronLeft size={20} className="text-slate-400" />
                        </button>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-white">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h1>
                        <button onClick={() => navigateWeek(1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <ChevronRight size={20} className="text-slate-400" />
                        </button>
                    </div>
                    <button onClick={goToToday} className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Today</button>
                </div>

                <div className="flex justify-between items-center gap-1 overflow-x-auto py-2 no-scrollbar">
                    {days.map(day => (
                        <button
                            key={day.date}
                            onClick={() => setSelectedDay(day.date)}
                            className={`flex flex-col items-center min-w-[44px] py-3 rounded-2xl transition-all ${selectedDay === day.date
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            <span className="text-[10px] font-bold uppercase mb-1">{day.name}</span>
                            <span className="text-lg font-black">{day.date}</span>
                        </button>
                    ))}
                </div>
            </header>

            <main className="flex-1 px-6 space-y-6">
                {/* Slot Suggestion for Selected Task */}
                {selectedTask && (
                    <motion.div
                        ref={suggestionRef}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl text-white shadow-xl shadow-blue-600/20"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles size={20} />
                            <h2 className="text-sm font-bold uppercase tracking-widest">Slot Suggestion</h2>
                        </div>
                        <p className="text-lg font-medium mb-6">"Schedule <span className="italic underline">{selectedTask.title}</span> for tomorrow 10 AM to capitalize on your energy peak."</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="w-full py-4 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-2xl font-bold transition-all"
                        >
                            Accept Slot
                        </button>
                    </motion.div>
                )}

                {/* Timeline UI */}
                <div className="space-y-4">
                    {daySessions.length > 0 ? (
                        daySessions.map(session => (
                            <button
                                key={session.id}
                                onClick={() => handleOpenModal(session)}
                                className="w-full bg-white dark:bg-slate-800/50 p-5 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between group hover:border-blue-500 transition-all text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center min-w-[48px]">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase">{session.time.split(' ')[1]}</span>
                                        <span className="text-xl font-black text-slate-800 dark:text-white leading-none">{session.time.split(' ')[0]}</span>
                                    </div>
                                    <div className="h-10 w-[2px] bg-slate-100 dark:bg-slate-800 rounded-full" />
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{session.title}</h3>
                                        <p className="text-xs text-slate-500">{session.duration || 1} hour session</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 shadow-inner group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                    <ChevronRight size={18} />
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center text-center opacity-50">
                            <Calendar size={48} className="text-slate-400 mb-4" />
                            <p className="text-slate-500 font-medium">No sessions scheduled for this day.</p>
                            <button onClick={() => handleOpenModal()} className="mt-4 text-blue-600 font-bold uppercase text-xs tracking-widest">+ Schedule One</button>
                        </div>
                    )}
                </div>
            </main>

            {/* Floating Create Button */}
            <button
                onClick={() => handleOpenModal()}
                className="absolute bottom-32 right-8 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20"
            >
                <Plus size={32} />
            </button>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-[3rem] sm:rounded-3xl p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingSession ? 'Edit Session' : 'New Session'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Session Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-medium"
                                        placeholder="What will you focus on?"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                                        <select
                                            value={time}
                                            onChange={e => setTime(e.target.value)}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-sm font-medium"
                                        >
                                            {Array.from({ length: 24 }).map((_, i) => {
                                                const h = i % 12 || 12;
                                                const ampm = i < 12 ? 'AM' : 'PM';
                                                const label = `${h.toString().padStart(2, '0')} ${ampm}`;
                                                return <option key={label} value={label}>{label}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                                        <select
                                            value={duration}
                                            onChange={e => setDuration(e.target.value)}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-sm font-medium"
                                        >
                                            <option value={0.5}>30 mins</option>
                                            <option value={1}>1 hour</option>
                                            <option value={1.5}>1.5 hours</option>
                                            <option value={2}>2 hours</option>
                                            <option value={3}>3 hours</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    {editingSession && (
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="p-4 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98] transition-all"
                                    >
                                        {editingSession ? 'Update Schedule' : 'Schedule Session'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Planner
