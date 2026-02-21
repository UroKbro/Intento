import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Bell, Shield, Moon, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

const Settings = () => {
    const { setCurrentPage } = useApp()

    const sections = [
        {
            title: 'Account',
            items: [
                { icon: <User size={20} />, label: 'Profile Information', value: 'Aadi K.' },
                { icon: <Bell size={20} />, label: 'Notifications', value: 'On' },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: <Moon size={20} />, label: 'Dark Mode', value: 'System' },
                { icon: <Shield size={20} />, label: 'Privacy & Security', value: '' },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: <HelpCircle size={20} />, label: 'Help Center', value: '' },
                { icon: <LogOut size={20} className="text-rose-500" />, label: 'Sign Out', value: '', color: 'text-rose-500' },
            ]
        }
    ]

    return (
        <div className="relative w-full flex flex-col min-h-screen pb-40 bg-[#f6f7f8] dark:bg-[#0a0f16]">
            <header className="px-6 py-6 pt-12">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your intentional workspace.</p>
            </header>

            <main className="px-6 space-y-8">
                {sections.map((section, idx) => (
                    <section key={idx}>
                        <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">{section.title}</h3>
                        <div className="bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50">
                            {section.items.map((item, itemIdx) => (
                                <button
                                    key={itemIdx}
                                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 ${item.color || 'text-slate-600 dark:text-slate-400'}`}>
                                            {item.icon}
                                        </div>
                                        <span className={`text-sm font-semibold ${item.color || 'text-slate-800 dark:text-slate-200'}`}>{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.value && <span className="text-xs text-slate-400">{item.value}</span>}
                                        <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
            </main>
        </div>
    )
}

export default Settings
