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

    useEffect(() => {
        if (selectedTask) {
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
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
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

    // Calculate daily hours to show overload warning
    const daySessions = useMemo(() => sessions.filter(s => {
        const sDate = new Date(s.fullDate || new Date(currentDate.getFullYear(), 10, s.date)); // Fallback for old data
        return sDate.getDate() === selectedDay && sDate.getMonth() === currentDate.getMonth();
    }), [sessions, selectedDay, currentDate]);

    const totalHours = useMemo(() => daySessions.reduce((acc, s) => {
        if (s.duration) return acc + s.duration;
        if (s.progress && s.progress.includes('/') && s.progress.includes('h')) {
            const planned = parseFloat(s.progress.split('/')[1]);
            return acc + (isNaN(planned) ? 0 : planned);
        }
        return acc;
    }, 0), [daySessions]);

    const isOverloaded = totalHours > 8

    const weekRangeString = useMemo(() => {
        const start = days[0].fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const end = days[6].fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `Week of ${start} – ${end}`;
    }, [days]);

    const monthYearString = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="relative flex flex-col min-h-screen pb-40 bg-white dark:bg-[#0a0f16]">
            <header className="px-6 py-4 pt-12">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigateWeek(-1)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <ChevronLeft size={20} className="text-slate-400" />
                        </button>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{monthYearString}</h1>
                        <button
                            onClick={() => navigateWeek(1)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <ChevronRight size={20} className="text-slate-400" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToToday}
                            className="px-3 py-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg uppercase tracking-wider"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => {
                                setEditingSession(null);
                                setIsModalOpen(true);
                            }}
                            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{weekRangeString}</p>
                    {isOverloaded && (
                        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200/50 dark:border-amber-800/50">
                            <AlertTriangle size={12} className="text-amber-600" />
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-tight">Overloaded: {totalHours}h</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="px-6 py-2 overflow-x-auto custom-scrollbar">
                <div className="flex space-x-4 min-w-max">
                    {days.map((day) => (
                        <button
                            key={day.fullDate.getTime()}
                            onClick={() => {
                                setSelectedDay(day.date);
                                setCurrentDate(day.fullDate);
                            }}
                            className="flex flex-col items-center group"
                        >
                            <span className={`text-[10px] font-bold uppercase tracking-wider mb-2 transition-colors ${selectedDay === day.date && currentDate.getMonth() === day.fullDate.getMonth() ? 'text-blue-600' : 'text-slate-400'
                                }`}>
                                {day.name}
                            </span>
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all shadow-sm ${selectedDay === day.date && currentDate.getMonth() === day.fullDate.getMonth()
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}>
                                {day.date}
                            </motion.div>
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex-1 px-6 pt-6 relative">
                <div className="absolute left-18 top-0 bottom-0 w-[1px] bg-slate-200 dark:bg-slate-800"></div>

                <div className="space-y-8 relative">
                    {sessions.filter(s => s.date === selectedDay).map((session) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`relative flex items-start gap-4 ${session.completed ? 'opacity-60' : ''}`}
                            onClick={() => {
                                setEditingSession(session);
                                setNewSessionTitle(session.title);
                                setIsModalOpen(true);
                            }}
                        >
                            <div className={`w-14 text-[11px] font-bold pt-2 text-right shrink-0 ${session.active ? 'text-blue-600' : session.suggestion ? 'text-purple-600' : 'text-slate-400'
                                }`}>
                                {session.time}
                            </div>

                            <div className={`flex-1 p-4 rounded-xl border-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${session.suggestion
                                ? 'bg-purple-500/5 border-dashed border-purple-500/40 shadow-lg shadow-purple-500/5'
                                : session.active
                                    ? 'bg-blue-600/5 border-blue-600/40 ring-1 ring-blue-600/40 shadow-xl shadow-blue-600/5'
                                    : 'bg-white dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 shadow-sm'
                                }`}>

                                {session.active && (
                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 z-10">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-600/20"></div>
                                    </div>
                                )}

                                <div className="flex justify-between items-start">
                                    <div>
                                        {session.suggestion && (
                                            <div className="flex items-center gap-1 mb-1">
                                                <Bolt size={12} className="text-purple-600" />
                                                <span className="text-[9px] font-bold text-purple-600 uppercase tracking-widest">{session.tag}</span>
                                            </div>
                                        )}
                                        <h3 className={`text-sm font-bold flex items-center ${session.active ? 'text-blue-600' : 'text-slate-800 dark:text-slate-100'
                                            }`}>
                                            {session.title}
                                            {session.repeat && <Repeat size={14} className="ml-1 opacity-50" />}
                                        </h3>
                                        {session.progress && (
                                            <p className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${session.completed ? 'text-emerald-500' : session.active ? 'text-blue-600' : 'text-slate-500'
                                                }`}>
                                                {session.progress}
                                            </p>
                                        )}
                                    </div>
                                    {session.completed ? (
                                        <CheckCircle2 size={18} className="text-emerald-500" />
                                    ) : session.suggestion ? (
                                        <button className="bg-purple-600 text-white p-1 rounded-md active:scale-90 transition-transform">
                                            <Plus size={16} />
                                        </button>
                                    ) : session.type === 'MEETING' ? (
                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500">MEETING</span>
                                    ) : null}
                                </div>

                                {session.active && (
                                    <div className="pt-4 mt-4 border-t border-blue-600/20 flex items-center justify-between">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Deep Focus Lock</p>
                                            <p className="text-[9px] text-slate-500">AI blocks all distractions</p>
                                        </div>
                                        <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center px-1">
                                            <motion.div
                                                layoutId="toggle"
                                                className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"
                                                initial={false}
                                                animate={{ x: '100%' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {sessions.filter(s => s.date === selectedDay).length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                            <Calendar size={48} strokeWidth={1} />
                            <p className="text-sm font-medium">No sessions scheduled for today</p>
                            <button
                                onClick={() => {
                                    setEditingSession(null);
                                    setNewSessionTitle(selectedTask?.title || '');
                                    setIsModalOpen(true);
                                }}
                                className="text-blue-600 font-bold text-[11px] uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl"
                            >
                                Add First Session
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Suggestion Card */}
            {selectedTask && (
                <motion.div
                    ref={suggestionRef}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-28 left-6 right-6 z-20"
                >
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                                <Brain size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Slot Suggestion</h4>
                                <p className="text-xs font-semibold leading-tight mt-1 text-slate-800 dark:text-slate-200">
                                    Schedule '{selectedTask.title}' for 3 PM?
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => {
                                    addSession({
                                        title: selectedTask.title,
                                        time: '03 PM',
                                        date: selectedDay,
                                        fullDate: currentDate,
                                        type: 'WORK',
                                        color: 'purple',
                                        progress: 'Planned'
                                    })
                                    setCurrentPage('home')
                                }}
                                className="flex items-center justify-center py-2 rounded-lg bg-purple-600/10 border border-purple-600/20 hover:bg-purple-600/20 transition-colors"
                            >
                                <span className="text-[10px] font-bold text-purple-600">Accept Slot</span>
                            </button>
                            <button className="flex items-center justify-center py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                <span className="text-[10px] font-bold text-slate-400">Later</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Scheduling Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <SchedulingModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingSession(null);
                            setNewSessionTitle('');
                        }}
                        editingSession={editingSession}
                        defaultTitle={newSessionTitle}
                        selectedDate={currentDate}
                        tasks={tasks}
                        sessions={sessions}
                        onSave={(sessionData, mode) => {
                            if (editingSession) {
                                updateSession(editingSession.id, sessionData, mode);
                            } else {
                                addSession(sessionData);
                            }
                            setIsModalOpen(false);
                        }}
                        onDelete={(id, mode) => {
                            deleteSession(id, mode);
                            setIsModalOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

const SchedulingModal = ({ isOpen, onClose, editingSession, defaultTitle, selectedDate, tasks, sessions, onSave, onDelete }) => {
    const [title, setTitle] = useState(editingSession?.title || defaultTitle || '')
    const [time, setTime] = useState(editingSession?.time || '09:00 AM')
    const [duration, setDuration] = useState(editingSession?.duration || 1)
    const [repeat, setRepeat] = useState(editingSession?.repeat || false)
    const [date, setDate] = useState(selectedDate.toISOString().split('T')[0])
    const [taskId, setTaskId] = useState(editingSession?.taskId || '')
    const [showConflict, setShowConflict] = useState(false)
    const [recurringEditMode, setRecurringEditMode] = useState(null) // 'this' or 'all'

    const isRecurringEdit = editingSession?.seriesId;

    const checkConflicts = () => {
        const hasConflict = sessions.some(s => {
            if (editingSession && s.id === editingSession.id) return false;
            return s.date === new Date(date).getDate() && s.time === time;
        });
        return hasConflict;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isRecurringEdit && !recurringEditMode) {
            return;
        }

        if (checkConflicts() && !showConflict) {
            setShowConflict(true);
            return;
        }

        onSave({
            title,
            time,
            duration: parseFloat(duration),
            repeat,
            date: new Date(date).getDate(),
            fullDate: new Date(date),
            taskId: taskId ? parseInt(taskId) : null,
            type: 'WORK',
            color: tasks.find(t => t.id === parseInt(taskId))?.color || 'blue'
        }, recurringEditMode || 'this');
    }

    const handleDelete = () => {
        if (isRecurringEdit && !recurringEditMode) {
            return;
        }
        onDelete(editingSession.id, recurringEditMode || 'this');
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="px-6 py-6 overflow-y-auto max-h-[90vh]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {editingSession ? 'Edit Session' : 'Add Session'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isRecurringEdit && !recurringEditMode ? (
                            <div className="space-y-4 py-4">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 text-center">
                                    This is a recurring session. How would you like to apply your changes?
                                </p>
                                <div className="grid grid-cols-1 gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setRecurringEditMode('this')}
                                        className="w-full py-4 px-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all flex flex-col items-center"
                                    >
                                        <span className="font-bold text-slate-800 dark:text-slate-200">Edit this instance</span>
                                        <span className="text-[10px] text-slate-500 uppercase">Only change this specific slot</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRecurringEditMode('all')}
                                        className="w-full py-4 px-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all flex flex-col items-center"
                                    >
                                        <span className="font-bold text-slate-800 dark:text-slate-200">Edit all future sessions</span>
                                        <span className="text-[10px] text-slate-500 uppercase">Update the entire series</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Session Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="What are you working on?"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={e => setDate(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</label>
                                        <div className="relative">
                                            <select
                                                value={time}
                                                onChange={e => setTime(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none transition-all text-sm font-medium appearance-none"
                                            >
                                                {Array.from({ length: 24 }, (_, i) => {
                                                    const hour = i % 12 || 12;
                                                    const ampm = i < 12 ? 'AM' : 'PM';
                                                    const t = `${hour.toString().padStart(2, '0')} ${ampm}`;
                                                    return <option key={t} value={t}>{t}</option>;
                                                })}
                                            </select>
                                            <Clock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration (Hours)</label>
                                        <select
                                            value={duration}
                                            onChange={e => setDuration(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                        >
                                            <option value={0.5}>0.5h</option>
                                            <option value={1}>1.0h</option>
                                            <option value={1.5}>1.5h</option>
                                            <option value={2}>2.0h</option>
                                            <option value={3}>3.0h</option>
                                            <option value={4}>4.0h</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Link to Task</label>
                                        <select
                                            value={taskId}
                                            onChange={e => setTaskId(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                        >
                                            <option value="">No Task</option>
                                            {tasks.map(t => (
                                                <option key={t.id} value={t.id}>{t.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <Repeat size={18} className="text-slate-400" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Repeat Weekly</p>
                                            <p className="text-[10px] text-slate-500">Create recurring session</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setRepeat(!repeat)}
                                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${repeat ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                    >
                                        <motion.div
                                            animate={{ x: repeat ? 20 : 0 }}
                                            className="w-4 h-4 bg-white rounded-full shadow-sm"
                                        />
                                    </button>
                                </div>

                                {showConflict && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30 rounded-2xl flex gap-3"
                                    >
                                        <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                                        <div>
                                            <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-tight">Overlap detected.</p>
                                            <p className="text-[11px] text-amber-700 dark:text-amber-500 mt-0.5">There's already a session at this time. Save anyway?</p>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    {editingSession && (
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        {showConflict ? 'Save Override' : (editingSession ? 'Update Session' : 'Save Session')}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Planner
