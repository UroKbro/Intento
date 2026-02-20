import { motion } from 'framer-motion'
import { Bell, Search, TrendingUp, Info, Bolt, Terminal, Brush, Filter, Award } from 'lucide-react'
import { useState } from 'react'

import { useApp } from '../context/AppContext'

const Insights = () => {
    const { insightsFilter } = useApp()
    const [timeRange, setTimeRange] = useState(insightsFilter || 'Daily')

    const energyPatterns = [
        { label: 'AM', values: [20, 40, 90, 100] },
        { label: 'NOON', values: [60, 30, 20, 40] },
        { label: 'PM', values: [80, 100, 60, 20] },
    ]

    const distribution = [
        { label: 'Wk', value: 85 },
        { label: 'St', value: 45 },
        { label: 'He', value: 65 },
        { label: 'Si', value: 30 },
        { label: 'Ot', value: 15 },
    ]

    const history = [
        { title: 'Backend Architecture', note: 'Focused well on API endpoints', time: '45m', score: 3, icon: <Terminal size={20} className="text-blue-600" />, color: 'blue' },
        { title: 'Design System Updates', note: 'Slightly fatigued at the end', time: '1h 20m', score: 2, icon: <Brush size={20} className="text-purple-600" />, color: 'purple' },
    ]

    return (
        <div className="flex flex-col min-h-screen pb-36 bg-[#f6f7f8] dark:bg-[#101822]">
            <header className="px-6 pb-4 pt-12 sticky top-0 bg-[#f6f7f8]/80 dark:bg-[#101822]/80 backdrop-blur-md z-30">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Insights</h1>
                    <button className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-blue-600">
                        <Bell size={20} />
                    </button>
                </div>

                <div className="relative mb-6">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="w-full bg-slate-200/50 dark:bg-slate-800/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-600/50 transition-all outline-none"
                        placeholder="Search tasks, notes, or goals..."
                        type="text"
                    />
                </div>

                <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex">
                    {['Daily', 'Weekly', 'Monthly'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${timeRange === range ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </header>

            <main className="px-6 space-y-8 pt-4">
                <section>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Lifetime Statistics</h2>
                    <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 text-white overflow-hidden relative shadow-xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Award size={72} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-slate-400 text-sm mb-1">Total Time Invested</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold">1,284</span>
                                <span className="text-xl text-slate-400 font-medium tracking-tight">hours</span>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-700 pt-4">
                                <div>
                                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Sessions</p>
                                    <p className="text-lg font-bold">2,142</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Avg. Energy</p>
                                    <p className="text-lg font-bold text-green-400">High</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Energy Patterns</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Post-session reported vitality</p>
                        </div>
                        <Bolt size={20} className="text-blue-600" />
                    </div>
                    <div className="bg-white dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="space-y-4">
                            {energyPatterns.map((pattern) => (
                                <div key={pattern.label} className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-slate-400 w-8 uppercase">{pattern.label}</span>
                                    <div className="flex-1 h-3 flex gap-1">
                                        {pattern.values.map((v, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                                className="flex-1 rounded-full bg-blue-600 origion-left"
                                                style={{ opacity: v / 100 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                            <div className="text-center">
                                <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-tighter">Peak Day</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Tuesday</p>
                            </div>
                            <div className="text-center border-l border-slate-200 dark:border-slate-700 pl-6">
                                <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-tighter">Peak Time</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">9:00 AM</p>
                            </div>
                            <div className="text-center border-l border-slate-200 dark:border-slate-700 pl-6">
                                <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-tighter">Stability</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">84%</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg shadow-blue-600/20">
                        <p className="text-xs font-medium opacity-80 uppercase tracking-wider mb-1">Today's Focus</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">6.4</span>
                            <span className="text-sm opacity-80 font-medium">hrs</span>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-[10px] font-bold bg-white/20 w-fit px-2 py-0.5 rounded-full">
                            <TrendingUp size={12} /> 12%
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Goals Met</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">4</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">/ 5</span>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-600/10 w-fit px-2 py-0.5 rounded-full">
                            Almost there
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Goal Distribution</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Focus by category</p>
                        </div>
                        <span className="text-blue-600 text-xs font-semibold cursor-pointer">View Details</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-end justify-between h-32 gap-3">
                            {distribution.map((d, i) => (
                                <div key={d.label} className="flex flex-col items-center flex-1 gap-2">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${d.value}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`w-full bg-blue-600 rounded-t-lg`}
                                        style={{ opacity: (100 - i * 15) / 100 }}
                                    />
                                    <span className="text-[10px] font-medium text-slate-500">{d.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent History</h2>
                        <button className="text-blue-600 text-xs font-semibold flex items-center gap-1">
                            <Filter size={14} /> Filter
                        </button>
                    </div>
                    <div className="space-y-3">
                        {history.map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color === 'blue' ? 'bg-blue-600/10' : 'bg-purple-500/10'
                                        }`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-800 dark:text-white">{item.title}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">"{item.note}"</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">{item.time}</p>
                                    <div className="flex justify-end gap-0.5 mt-1">
                                        {[1, 2, 3].map(i => (
                                            <span
                                                key={i}
                                                className={`w-1.5 h-1.5 rounded-full ${i <= item.score
                                                    ? (item.color === 'blue' ? 'bg-green-500' : 'bg-orange-400')
                                                    : 'bg-slate-300 dark:bg-slate-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Insights
