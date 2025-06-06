/* eslint-disable @next/next/no-img-element */
'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, useEffect, useState } from 'react'

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string
  dark?: boolean
}

const Phone = ({ imgSrc, className, dark = false, ...props }: PhoneProps) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Prevent rendering until after hydration on client
  if (!hasMounted) return null

  return (
    <div
      className={cn(
        'relative pointer-events-none z-50 overflow-hidden',
        className
      )}
      {...props}
    >
      <img
        src={
          dark
            ? '/phone-template-dark-edges.png'
            : '/phone-template-white-edges.png'
        }
        className='pointer-events-none z-50 select-none'
        alt='phone image'
      />

      <div className='absolute -z-10 inset-0'>
        <img
          className='object-cover min-w-full min-h-full'
          src={imgSrc}
          alt='overlaying phone image'
        />
      </div>
    </div>
  )
}

export default Phone
