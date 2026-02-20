import { motion } from 'framer-motion'
import { Sparkles, Save, Trash2, ChevronLeft, Smile, Meh, Frown, Zap, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

const Reflection = () => {
    const { timerState, setTimerState, setCurrentPage, addSession } = useApp()
    const [mood, setMood] = useState('pleasant')
    const [energy, setEnergy] = useState('medium')
    const [reflection, setReflection] = useState('')

    const moods = [
        { id: 'pleasant', icon: <Smile className="text-emerald-500" />, label: 'Good' },
        { id: 'neutral', icon: <Meh className="text-amber-500" />, label: 'Okay' },
        { id: 'stressed', icon: <Frown className="text-rose-500" />, label: 'Stressed' },
    ]

    const energyLevels = [
        { id: 'low', icon: <BatteryLow />, label: 'Low' },
        { id: 'medium', icon: <BatteryMedium />, label: 'Steady' },
        { id: 'high', icon: <BatteryFull className="text-blue-500" />, label: 'Peak' },
    ]

    const handleSave = () => {
        // Log the session to stats
        addSession({
            title: 'Focus Session Reflection',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: 25, // Mock date
            completed: true,
            progress: `${Math.floor(timerState.totalFocusTime / 60)}m Logged`,
            mood,
            energy,
            reflection,
            distractions: timerState.distractions
        })

        // Reset timer state
        setTimerState({
            isActive: false,
            timeLeft: 1500,
            mode: 'focus',
            totalFocusTime: 0,
            distractions: 0
        })

        setCurrentPage('home')
    }

    const handleDiscard = () => {
        if (window.confirm('Are you sure you want to discard this session?')) {
            setCurrentPage('home')
        }
    }

    return (
        <div className="relative flex flex-col min-h-screen pb-12 bg-white dark:bg-[#0a0f16]">
            <header className="pt-12 px-6 pb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Session Complete</span>
                    <button
                        onClick={handleDiscard}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-colors"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    Great job! <Sparkles className="text-amber-500" size={24} />
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Reflect on your focus to improve tomorrow.</p>
            </header>

            <main className="flex-1 px-6 space-y-8">
                {/* Mood Selector */}
                <section>
                    <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">How was your mood?</h3>
                    <div className="flex gap-3">
                        {moods.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setMood(m.id)}
                                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${mood === m.id
                                    ? 'bg-white dark:bg-slate-800 border-blue-600 shadow-lg shadow-blue-600/10'
                                    : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-400'}`}
                            >
                                <span className="scale-125">{m.icon}</span>
                                <span className={`text-[10px] font-bold ${mood === m.id ? 'text-slate-800 dark:text-white' : ''}`}>{m.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Energy Selector */}
                <section>
                    <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Current Energy level?</h3>
                    <div className="flex gap-3">
                        {energyLevels.map((e) => (
                            <button
                                key={e.id}
                                onClick={() => setEnergy(e.id)}
                                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${energy === e.id
                                    ? 'bg-white dark:bg-slate-800 border-blue-600 shadow-lg shadow-blue-600/10'
                                    : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-400'}`}
                            >
                                <span className={energy === e.id ? 'text-blue-600' : ''}>{e.icon}</span>
                                <span className={`text-[10px] font-bold ${energy === e.id ? 'text-slate-800 dark:text-white' : ''}`}>{e.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Reflection Box */}
                <section>
                    <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Any breakthroughs or blocks?</h3>
                    <textarea
                        className="w-full h-40 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-3xl p-6 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none resize-none shadow-sm placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="Write a quick summary..."
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                    />
                </section>

                {/* Session Stats */}
                <section className="bg-blue-600/5 border border-blue-600/20 rounded-3xl p-5 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Focus Time</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">{Math.floor(timerState.totalFocusTime / 60)}m {timerState.totalFocusTime % 60}s</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Distractions</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">{timerState.distractions}</p>
                    </div>
                </section>
            </main>

            <div className="px-6 py-6 sticky bottom-0 bg-white/100 dark:bg-[#0a0f16]/100 backdrop-blur-md">
                <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                    <Save size={20} />
                    SAVE & COMPLETE
                </button>
            </div>
        </div>
    )
}

export default Reflection
