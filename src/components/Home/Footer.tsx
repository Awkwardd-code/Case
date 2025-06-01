import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-black py-6 mt-10 text-neutral-300">
            <div className="flex flex-col items-center justify-center text-center">
                <p className="text-sm sm:text-base font-medium px-4">
                    &copy; {new Date().getFullYear()} Made by{' '}
                    <a
                        href="https://github.com/Awkwardd-code"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-white transition"
                    >
                        SomeThinn Awkwardd
                    </a>
                </p>
                <p className="text-xs mt-1 text-neutral-400">
                    All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer
