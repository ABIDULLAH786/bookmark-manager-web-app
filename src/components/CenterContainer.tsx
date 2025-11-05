import React from 'react'

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-card">
      <div className="w-full max-w-sm p-8 rounded-2xl border bg-card border-border">
        {children}
      </div>
    </div>
  )
}

export default Container