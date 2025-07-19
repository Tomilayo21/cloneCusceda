'use client'

import Sidebar from '@/components/admin/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 px-4 py-6 transition-all duration-300">
        {children}
        {/* <Footer /> */}
      </main>
    </div>
  )
}

export default Layout
