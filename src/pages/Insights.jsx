import { useState, useMemo } from 'react'
import { Bell, Search, TrendingUp, Info, Bolt, Terminal, Brush, Filter, Award, X, ChevronRight, PieChart } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { useApp } from '../context/AppContext'

const Insights = () => {
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

    const { insightsFilter, notifications, sessions } = useApp()
    const [timeRange, setTimeRange] = useState(insightsFilter || 'Daily')
    const [showDistributionDetails, setShowDistributionDetails] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategories, setActiveCategories] = useState(['Wk', 'St', 'He', 'Si', 'Ot'])
    const [showNotifications, setShowNotifications] = useState(false)
    const [showFilterModal, setShowFilterModal] = useState(false)

    const categoryMap = {
        'Wk': { full: 'Work', desc: 'Focus on primary professional goals', color: 'blue' },
        'St': { full: 'Study', desc: 'Learning and skill acquisition', color: 'indigo' },
        'He': { full: 'Health', desc: 'Physical and mental well-being', color: 'emerald' },
        'Si': { full: 'Side Proj', desc: 'Personal passion projects', color: 'purple' },
        'Ot': { full: 'Other', desc: 'Miscellaneous activities', color: 'slate' }
    }

    const dataSets = {
        'Daily': {
            totalHours: '6.4',
            totalSessions: '4',
            energyPeak: 'High',
            focusIncrease: '12%',
            goalsMet: '4/5',
            energyPatterns: [
                { label: 'AM', values: [20, 40, 90, 100] },
                { label: 'NOON', values: [60, 30, 20, 40] },
                { label: 'PM', values: [80, 100, 60, 20] },
            ],
            distribution: [
                { label: 'Wk', value: 85 },
                { label: 'St', value: 45 },
                { label: 'He', value: 65 },
                { label: 'Si', value: 30 },
                { label: 'Ot', value: 15 },
            ],
            history: [
                { title: 'Backend Architecture', note: 'Focused well on API endpoints', time: '45m', score: 3, icon: <Terminal size={20} className="text-blue-600" />, color: 'blue' },
                { title: 'Design System Updates', note: 'Slightly fatigued at the end', time: '1h 20m', score: 2, icon: <Brush size={20} className="text-purple-600" />, color: 'purple' },
            ],
            peakDay: 'Tuesday',
            peakTime: '9:00 AM',
            stability: '84%'
        },
        'Weekly': {
            totalHours: '42.5',
            totalSessions: '28',
            energyPeak: 'Stable',
            focusIncrease: '8%',
            goalsMet: '18/20',
            energyPatterns: [
                { label: 'AM', values: [70, 80, 85, 90] },
                { label: 'NOON', values: [40, 50, 45, 60] },
                { label: 'PM', values: [30, 40, 50, 70] },
            ],
            distribution: [
                { label: 'Wk', value: 70 },
                { label: 'St', value: 60 },
                { label: 'He', value: 40 },
                { label: 'Si', value: 20 },
                { label: 'Ot', value: 10 },
            ],
            history: [
                { title: 'Project X Launch', note: 'High intensity week', time: '12h', score: 3, icon: <Bolt size={20} className="text-blue-600" />, color: 'blue' },
                { title: 'Weekly Review', note: 'Good reflection', time: '2h', score: 3, icon: <TrendingUp size={20} className="text-emerald-600" />, color: 'emerald' },
            ],
            peakDay: 'Wednesday',
            peakTime: '10:30 AM',
            stability: '78%'
        },
        'Monthly': {
            totalHours: '184',
            totalSessions: '124',
            energyPeak: 'Optimal',
            focusIncrease: '15%',
            goalsMet: '72/80',
            energyPatterns: [
                { label: 'AM', values: [60, 70, 80, 95] },
                { label: 'NOON', values: [50, 40, 30, 45] },
                { label: 'PM', values: [40, 60, 80, 90] },
            ],
            distribution: [
                { label: 'Wk', value: 60 },
                { label: 'St', value: 50 },
                { label: 'He', value: 70 },
                { label: 'Si', value: 40 },
                { label: 'Ot', value: 25 },
            ],
            history: [
                { title: 'Q3 Goals Met', note: 'Solid month of output', time: '160h', score: 3, icon: <Award size={20} className="text-amber-600" />, color: 'amber' },
                { title: 'New Skills Mastery', note: 'Focused on UI/UX', time: '24h', score: 3, icon: <Brush size={20} className="text-purple-600" />, color: 'purple' },
            ],
            peakDay: 'Thursday',
            peakTime: '11:00 AM',
            stability: '92%'
        }
    }

    const currentData = useMemo(() => {
        const base = dataSets[timeRange] || dataSets['Daily']
        // Merge real sessions from context if they match the time range/date (simplification)
        const combinedHistory = [...base.history, ...sessions.filter(s => s.date === new Date().getDate())]

        const filteredHistory = combinedHistory.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.note.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = item.label ? activeCategories.includes(item.label) : true // Default categories from context might need mapping
            return matchesSearch && matchesCategory
        })

        return { ...base, history: filteredHistory }
    }, [timeRange, searchQuery, activeCategories, sessions])

    return (
        <div className="relative w-full flex flex-col min-h-screen pb-36 bg-[#f6f7f8] dark:bg-[#0a0f16]">
            <header className="px-6 pb-4 pt-12 sticky top-0 bg-[#f6f7f8]/80 dark:bg-[#0a0f16]/80 backdrop-blur-md z-30">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Insights</h1>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showNotifications ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-blue-600'}`}
                    >
                        <Bell size={20} />
                        {notifications.some(n => !n.read) && (
                            <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#f6f7f8] dark:border-[#0a0f16]"></div>
                        )}
                    </button>
                </div>

                <div className="relative mb-6">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="w-full bg-slate-200/50 dark:bg-slate-800/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-600/50 transition-all outline-none"
                        placeholder="Search tasks, notes, or goals..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex">
                    {['Daily', 'Weekly', 'Monthly'].map((range) => (
                        <motion.button
                            key={range}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTimeRange(range)}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${timeRange === range ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                                }`}
                        >
                            {range}
                        </motion.button>
                    ))}
                </div>
            </header>

            <main className="px-6 space-y-8 pt-4">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Statistics For {timeRange}</h2>
                    <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 text-white overflow-hidden relative shadow-xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Award size={72} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-slate-400 text-sm mb-1">Time Invested</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold">{currentData.totalHours}</span>
                                <span className="text-xl text-slate-400 font-medium tracking-tight">hours</span>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-700 pt-4">
                                <div>
                                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Sessions</p>
                                    <p className="text-lg font-bold">{currentData.totalSessions}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Avg. Energy</p>
                                    <p className="text-lg font-bold text-green-400">{currentData.energyPeak}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

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
                            {currentData.energyPatterns.map((pattern) => (
                                <div key={pattern.label} className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-slate-400 w-8 uppercase">{pattern.label}</span>
                                    <div className="flex-1 h-3 flex gap-1">
                                        {pattern.values.map((v, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                                className="flex-1 rounded-full bg-blue-600 origin-left"
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
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{currentData.peakDay}</p>
                            </div>
                            <div className="text-center border-l border-slate-200 dark:border-slate-700 pl-6">
                                <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-tighter">Peak Time</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{currentData.peakTime}</p>
                            </div>
                            <div className="text-center border-l border-slate-200 dark:border-slate-700 pl-6">
                                <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-tighter">Stability</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{currentData.stability}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg shadow-blue-600/20">
                        <p className="text-xs font-medium opacity-80 uppercase tracking-wider mb-1">{timeRange} Focus</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">{currentData.totalHours}</span>
                            <span className="text-sm opacity-80 font-medium">hrs</span>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-[10px] font-bold bg-white/20 w-fit px-2 py-0.5 rounded-full">
                            <TrendingUp size={12} /> {currentData.focusIncrease}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Goals Met</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">{currentData.goalsMet.split('/')[0]}</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">/ {currentData.goalsMet.split('/')[1]}</span>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-600/10 w-fit px-2 py-0.5 rounded-full">
                            {parseInt(currentData.goalsMet.split('/')[0]) / parseInt(currentData.goalsMet.split('/')[1]) > 0.8 ? 'On Track' : 'Almost there'}
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Goal Distribution</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Focus by category</p>
                        </div>
                        <span
                            onClick={() => setShowDistributionDetails(true)}
                            className="text-blue-600 text-xs font-semibold cursor-pointer hover:underline"
                        >
                            View Details
                        </span>
                    </div>
                    <div className="bg-white dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-end justify-between h-32 gap-3">
                            {currentData.distribution.map((d, i) => (
                                <div key={d.label} className="flex flex-col items-center flex-1 gap-2">
                                    <motion.div
                                        key={timeRange + i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${d.value}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.05 }}
                                        className={`w-full bg-blue-600 rounded-t-lg shadow-sm`}
                                        style={{ opacity: (100 - i * 15) / 100 }}
                                    />
                                    <span className="text-[10px] font-medium text-slate-500">{d.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="pb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent History</h2>
                        <button
                            onClick={() => setShowFilterModal(true)}
                            className="text-blue-600 text-xs font-semibold flex items-center gap-1"
                        >
                            <Filter size={14} /> Filter
                        </button>
                    </div>
                    <motion.div
                        className="space-y-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {currentData.history.map((item, idx) => (
                            <motion.div
                                key={timeRange + idx}
                                variants={itemVariants}
                                whileHover={{ x: 4, scale: 1.01 }}
                                whileTap={{ scale: 0.995 }}
                                className="bg-white dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between shadow-sm cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color === 'blue' ? 'bg-blue-600/10' :
                                        item.color === 'amber' ? 'bg-amber-500/10' : 'bg-purple-500/10'}`}>
                                        {item.icon}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-sm text-slate-800 dark:text-white">{item.title}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">"{item.note}"</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
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
                    </motion.div>
                </section>
            </main>

            <AnimatePresence>
                {showDistributionDetails && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] p-8 shadow-2xl overflow-hidden relative"
                        >
                            <button
                                onClick={() => setShowDistributionDetails(false)}
                                className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                                    <PieChart size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Goal Distribution</h2>
                                    <p className="text-sm text-slate-500">{timeRange} Deep Dive</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {currentData.distribution.map((d, i) => {
                                    const info = categoryMap[d.label] || { full: d.label, desc: 'Activity breakdown', color: 'blue' }
                                    return (
                                        <div key={d.label} className="group">
                                            <div className="flex justify-between items-end mb-2">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{info.full}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium">{info.desc}</p>
                                                </div>
                                                <p className="text-lg font-black text-slate-900 dark:text-white">{d.value}%</p>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${d.value}%` }}
                                                    transition={{ duration: 1, delay: i * 0.1 }}
                                                    className={`h-full bg-blue-600`}
                                                    style={{ opacity: (100 - i * 15) / 100 }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <button
                                onClick={() => setShowDistributionDetails(false)}
                                className="w-full mt-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-[0.98] active:scale-[0.95] transition-all"
                            >
                                Close Details
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filter Modal */}
            <AnimatePresence>
                {showFilterModal && (
                    <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] p-8 shadow-2xl"
                        >
                            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Filter History</h2>
                            <div className="space-y-3">
                                {Object.entries(categoryMap).map(([id, info]) => (
                                    <button
                                        key={id}
                                        onClick={() => {
                                            if (activeCategories.includes(id)) {
                                                setActiveCategories(activeCategories.filter(c => c !== id))
                                            } else {
                                                setActiveCategories([...activeCategories, id])
                                            }
                                        }}
                                        className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${activeCategories.includes(id) ? 'bg-blue-600/10 border-blue-600/20' : 'bg-slate-50 dark:bg-slate-800 border-transparent'} border`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full bg-${info.color}-500`}></div>
                                            <span className="font-bold text-sm text-slate-800 dark:text-white">{info.full}</span>
                                        </div>
                                        {activeCategories.includes(id) && <X size={16} className="text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="w-full mt-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest"
                            >
                                Apply Filters
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Notifications Panel */}
            <AnimatePresence>
                {showNotifications && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute top-24 right-6 w-80 z-[120] bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">Notifications</h3>
                            <button onClick={() => setShowNotifications(false)}><X size={16} /></button>
                        </div>
                        <div className="space-y-4">
                            {notifications.length > 0 ? notifications.map(n => (
                                <div key={n.id} className="flex gap-4">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-slate-300' : 'bg-blue-600'}`}></div>
                                    <div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
                                        <p className="text-[10px] text-slate-400 mt-1 font-bold">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-xs text-slate-400 text-center py-4">No new notifications</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Insights
