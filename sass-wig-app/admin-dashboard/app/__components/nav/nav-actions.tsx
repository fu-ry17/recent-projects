"use client"
import { UserButton } from '@clerk/nextjs'
import { Store } from '@prisma/client'
import React from 'react'
import Sidebar from './side-bar'
import { ModeToggle } from '@/components/ui/mode-toggle'

const NavActions = ({ store}: { store: Store }) => {
  return (
    <div className='ml-auto flex items-center space-x-4'>
      <ModeToggle />
      <UserButton afterSignOutUrl='/' />
      <Sidebar store={store} />
    </div>
  )
}

export default NavActions