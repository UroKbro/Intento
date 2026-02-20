import { createContext, useContext, useState } from 'react'

const FocusContext = createContext()

export const FocusProvider = ({ children }) => {
    const [isFocusing, setIsFocusing] = useState(false)
    const [isReflecting, setIsReflecting] = useState(false)
    const [activeTask, setActiveTask] = useState(null)

    const startFocus = (task) => {
        setActiveTask(task)
        setIsFocusing(true)
        setIsReflecting(false)
    }

    const endFocus = () => {
        setIsFocusing(false)
        setIsReflecting(true)
    }

    const saveReflection = () => {
        setIsReflecting(false)
        setActiveTask(null)
    }

    const discardReflection = () => {
        setIsReflecting(false)
        setActiveTask(null)
    }

    return (
        <FocusContext.Provider value={{
            isFocusing, startFocus, endFocus,
            isReflecting, saveReflection, discardReflection,
            activeTask
        }}>
            {children}
        </FocusContext.Provider>
    )
}

export const useFocus = () => useContext(FocusContext)
