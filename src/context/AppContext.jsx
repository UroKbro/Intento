import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [goals, setGoals] = useState([
        { id: 1, title: 'Finish iOS Course', milestone: 'Navigation & Routing', progress: 72, targetDate: 'Nov 20, 2024', projectedDate: 'Nov 16, 2024', color: 'emerald', status: 'active', timeTarget: 50, timeLogged: 36 },
        { id: 2, title: 'Deep Work Mastery', milestone: 'Streak: 8 Days', progress: 45, targetDate: 'Dec 01, 2024', projectedDate: 'Dec 09, 2024', color: 'amber', status: 'active', timeTarget: 40, timeLogged: 18 },
        { id: 3, title: 'Master Mobile UI Design', milestone: 'Prototyping Mastery', progress: 64, targetDate: 'Oct 12, 2024', projectedDate: 'Oct 10, 2024', color: 'blue', status: 'active', timeTarget: 50, timeLogged: 32.5 },
    ]);

    const [tasks, setTasks] = useState([
        { id: 1, title: 'Refine Product Roadmap', goalId: 1, goalName: 'MARKET LEADERSHIP', logged: '42m', timeSpent: 42, estimatedDuration: 60, status: 'active', priority: 1, color: 'blue', category: 'Deep Work', updatedAt: new Date().toISOString() },
        { id: 2, title: 'Prepare Q3 Stakeholder Deck', goalId: 1, goalName: 'TEAM ALIGNMENT', logged: '15m', timeSpent: 15, estimatedDuration: 45, status: 'pending', priority: 2, color: 'slate', category: 'Deep Work', updatedAt: new Date().toISOString() },
        { id: 3, title: 'Schedule Review Meeting', goalId: 1, goalName: 'TEAM ALIGNMENT', logged: '0m', timeSpent: 0, estimatedDuration: 15, status: 'locked', priority: 3, color: 'slate', dependency: 'Task 2', category: 'Deep Work', updatedAt: new Date().toISOString() },
        { id: 4, title: 'Review User Interviews', goalId: 1, goalName: 'MARKET LEADERSHIP', logged: '0m', timeSpent: 0, estimatedDuration: 90, status: 'pending', priority: 4, color: 'slate', category: 'Deep Work', updatedAt: new Date().toISOString() },
        { id: 5, title: 'Morning Meditation', goalId: null, goalName: 'HEALTH', logged: '20m', timeSpent: 20, estimatedDuration: 20, status: 'completed', priority: 5, color: 'emerald', category: 'Health', updatedAt: new Date().toISOString() },
    ]);

    const [sessions, setSessions] = useState([
        { id: 1, time: '08 AM', date: 24, title: 'Morning Deep Work', completed: true, progress: '2/2h Completed', repeat: true, color: 'slate', type: 'WORK' },
        { id: 2, time: '10 AM', date: 24, title: 'Strategic Planning', completed: false, progress: '1.5/3h ACTUAL', repeat: true, active: true, color: 'blue', type: 'WORK' },
        { id: 3, time: '01 PM', date: 24, title: 'Recommended: Complex Tasks', suggestion: true, tag: 'High Energy Peak', color: 'purple', type: 'SUGGESTION' },
        { id: 4, time: '03 PM', date: 24, title: 'Client Sync', type: 'MEETING', progress: '0/1h Planned', color: 'slate' }
    ]);

    const [activeSession, setActiveSession] = useState(null);
    const [timerState, setTimerState] = useState({
        isActive: false,
        timeLeft: 1500, // 25 minutes
        mode: 'focus', // focus, short-break, long-break
        totalFocusTime: 0,
        distractions: 0
    });

    const [currentPage, setCurrentPage] = useState('home');
    const [selectedTask, setSelectedTask] = useState(null);
    const [insightsFilter, setInsightsFilter] = useState('Weekly');
    const [activeGoalId, setActiveGoalId] = useState(null);

    // Helper functions
    const addGoal = (goal) => setGoals(prev => [...prev, { id: Date.now(), progress: 0, ...goal }]);
    const updateGoal = (id, updates) => setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    const deleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));

    const addTask = (task) => setTasks(prev => [...prev, {
        id: Date.now(),
        status: 'pending',
        logged: '0m',
        timeSpent: 0,
        updatedAt: new Date().toISOString(),
        ...task
    }]);
    const updateTask = (id, updates) => setTasks(prev => prev.map(t =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    ));
    const completeTask = (id) => updateTask(id, { status: 'completed' });
    const archiveTask = (id) => updateTask(id, { status: 'archived' });
    const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

    const addSession = (session) => {
        const id = Date.now();
        if (session.repeat) {
            // For a simple implementation, we mark it as part of a series
            setSessions(prev => [...prev, { id, seriesId: id, ...session }]);
        } else {
            setSessions(prev => [...prev, { id, ...session }]);
        }
    };

    const updateSession = (id, updates, mode = 'this') => {
        setSessions(prev => {
            const target = prev.find(s => s.id === id);
            if (!target) return prev;

            if (mode === 'all' && target.seriesId) {
                return prev.map(s => s.seriesId === target.seriesId ? { ...s, ...updates } : s);
            }
            return prev.map(s => s.id === id ? { ...s, ...updates } : s);
        });
    };

    const deleteSession = (id, mode = 'this') => {
        setSessions(prev => {
            const target = prev.find(s => s.id === id);
            if (!target) return prev;

            if (mode === 'all' && target.seriesId) {
                return prev.filter(s => s.seriesId !== target.seriesId);
            }
            return prev.filter(s => s.id !== id);
        });
    };

    return (
        <AppContext.Provider value={{
            goals, addGoal, updateGoal, deleteGoal,
            tasks, addTask, updateTask, completeTask, archiveTask, deleteTask,
            sessions, addSession, updateSession, deleteSession,
            activeSession, setActiveSession,
            timerState, setTimerState,
            currentPage, setCurrentPage,
            selectedTask, setSelectedTask,
            insightsFilter, setInsightsFilter,
            activeGoalId, setActiveGoalId
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
