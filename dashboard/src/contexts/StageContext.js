import React, { createContext } from 'react'

const StageContext = createContext()

function StageProvider({ children, value }) {
    return <StageContext.Provider value={value}>{children}</StageContext.Provider>
}

export { StageContext, StageProvider }
