'use client'
import Footer from '@/components/admin/Footer'
import Navbar from '@/components/admin/Navbar'
import Sidebar from '@/components/admin/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <>
    {/* <Navbar /> */}
    <div>
      <div className='flex w-full'>
        <Sidebar />
        {children}
      </div>
    </div>
    {/* <Footer /> */}
    </>
  )
}

export default Layout
