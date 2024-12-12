import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LessonContextType {
    showHub: boolean;
    setShowHub: React.Dispatch<React.SetStateAction<boolean>>;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export function LessonProvider({ children }: { children: ReactNode }) {
    const [showHub, setShowHub] = useState(true);

    return (
        <LessonContext.Provider value={{ showHub, setShowHub }}>
            {children}
        </LessonContext.Provider>
    );
}

export function useLessonContext() {
    const context = useContext(LessonContext);
    if (context === undefined) {
        throw new Error('useLessonContext must be used within a LessonProvider');
    }
    return context;
}
