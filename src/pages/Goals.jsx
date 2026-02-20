import { motion } from 'framer-motion'
import { ChevronLeft, Share2, Flame, CheckCircle2, MoreHorizontal, History, TrendingUp, CalendarCheck, Coffee, Moon, Play, Edit2, Plus, Calendar, PauseCircle, Trash2, BarChart2 } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

const Goals = () => {
    const { goals, tasks, updateGoal, deleteGoal, setCurrentPage } = useApp()

    // For now, we'll look at the first active goal as our "Detail" view
    // In a real app, this would be based on a URL parameter or state
    const goal = goals[2] || goals[0] // Master Mobile UI Design or Finish iOS Course

    const goalTasks = tasks.filter(t => t.goalName === goal.title || t.goalId === goal.id)
    const contributions = goalTasks.map(t => ({
        title: t.title,
        time: t.logged,
        progress: t.status === 'completed' ? 100 : (t.status === 'active' ? 50 : 0),
        status: t.status
    }))

    const heatmap = [
        [0, 20, 60, 0, 40, 0, 0],
        [40, 80, 100, 60, 40, 20, 0],
        [20, 40, 20, 0, 0, 0, 0],
    ]

    const habits = [
        { title: 'Morning UI Review', detail: 'After Morning Coffee → 15m Dribbble Inspo', match: '85%', color: 'orange', icon: <Coffee size={20} /> },
        { title: 'Daily retrospective', detail: 'Before Bed → 5m Log Learning Outcomes', match: '100%', color: 'violet', icon: <Moon size={20} /> },
    ]

    const handlePauseGoal = () => {
        updateGoal(goal.id, { status: goal.status === 'paused' ? 'active' : 'paused' })
    }

    const handleDeleteGoal = () => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            deleteGoal(goal.id)
            setCurrentPage('home')
        }
    }

    return (
        <div className="flex flex-col min-h-screen pb-40 bg-[#f6f7f8] dark:bg-[#0a0f16]">
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setCurrentPage('home')}
                    className="p-2 -ml-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800 transition-colors"
                >
                    <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
                </button>
                <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white truncate max-w-[200px]">{goal.title}</h1>
                <div className="flex items-center gap-1">
                    <button className="p-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800 transition-colors">
                        <Edit2 size={20} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <button className="p-2 -mr-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800 transition-colors">
                        <MoreHorizontal size={24} className="text-slate-600 dark:text-slate-300" />
                    </button>
                </div>
            </header>

            <main className="px-5 pt-6 space-y-8">
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-blue-600/10 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Primary Objective</span>
                            <span className="flex items-center gap-1 text-amber-500 text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full">
                                <Flame size={12} /> 12 Day Streak
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
                        <button
                            onClick={() => { }} // Open New Task modal
                            className="flex flex-col items-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-transform active:scale-95"
                        >
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                                <Plus size={20} />
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Add Task</span>
                        </button>
                        <button
                            onClick={() => setCurrentPage('focus')}
                            className="flex flex-col items-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-transform active:scale-95"
                        >
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center">
                                <Play size={20} fill="currentColor" />
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Work</span>
                        </button>
                        <button
                            onClick={() => setCurrentPage('planner')}
                            className="flex flex-col items-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-transform active:scale-95"
                        >
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center">
                                <Calendar size={20} />
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Schedule</span>
                        </button>
                        <button
                            onClick={() => { }} // Open Breakdown modal
                            className="flex flex-col items-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-transform active:scale-95"
                        >
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center">
                                <BarChart2 size={20} />
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Stats</span>
                        </button>
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Task Contribution</h3>
                        <span className="text-[10px] text-slate-400 font-medium">{goalTasks.length} Tasks Logged</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                        {contributions.map((task, idx) => (
                            <div key={idx} className={`p-4 flex items-center gap-4 ${task.status === 'active' ? 'bg-blue-600/5' : ''}`}>
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
                            </div>
                        ))}
                    </div>
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
                                <React.Fragment key={rowIdx}>
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
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Milestone Forecasting</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <CalendarCheck size={18} className="text-indigo-500" />
                                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Est. Completion</span>
                            </div>
                            <div className="text-xl font-black text-slate-900 dark:text-white">{goal.projectedDate.split(',')[0]}</div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Based on current pace</p>
                        </div>
                        <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={18} className="text-amber-500" />
                                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">Remaining</span>
                            </div>
                            <div className="text-xl font-black text-slate-900 dark:text-white">{goal.timeTarget - goal.timeLogged}h <span className="text-xs font-normal text-slate-400">Left</span></div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">{goal.milestone}</p>
                        </div>
                    </div>
                </section>
            </main>

            <div className="fixed bottom-24 left-0 right-0 p-5 pointer-events-none z-30">
                <div className="max-w-md mx-auto flex items-center gap-3 pointer-events-auto">
                    <button
                        onClick={() => setCurrentPage('focus')}
                        className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:bg-slate-800 dark:hover:bg-slate-100"
                    >
                        <Play size={20} fill="currentColor" />
                        RESUME SESSION
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Goals
