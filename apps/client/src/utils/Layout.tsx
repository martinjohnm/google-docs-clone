import React from "react"

export const Layout = ({ children } : { children : React.ReactNode }) => {

    return (
        <div className="mx-auto container h-screen max-w-7xl bg-slate-200">
            {children}
        </div>
    )
}