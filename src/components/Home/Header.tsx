"use client"

import React from 'react'
import Logo from '../Logo'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const Header = () => {
  const router = useRouter()
  return (
    <header className="h-20 flex items-center">
        <div className="container px-4 mx-auto flex items-center justify-between gap-4">
          <Logo />
          <nav>
            <Button className='cursor-pointer' onClick={()=>router.push("/login")}>Login</Button>
          </nav>
        </div>
      </header>
  )
}

export default Header
