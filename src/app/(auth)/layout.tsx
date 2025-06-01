
import TextAnimation from '@/components/Home/TextAnimation'
import Logo from '@/components/Logo'
import React, { Suspense } from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='grid lg:grid-cols-2 min-h-screen max-h-screen h-full'>
            {/* animation */}
            <div className="hidden lg:flex flex-col p-10 bg-primary/10">
                <div className="flex items-center">
                    <Logo />
                </div>
                <div className="h-full justify-center flex flex-col">
                    <TextAnimation
                        className=''
                    />
                </div>
            </div>
            {/* component */}
            <Suspense fallback={<p>Loading...</p>}>
                <div className="h-full flex flex-col mt-14 lg:mt-0 lg:justify-center px-4 lg:p-6 overflow-auto">
                    {children}
                </div>
            </Suspense>
        </div>
    )
}

export default AuthLayout
