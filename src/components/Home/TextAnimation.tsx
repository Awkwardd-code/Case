"use client";

import { cn } from '@/lib/utils';
import React from 'react'
import { TypeAnimation } from 'react-type-animation'

type TextAnimationHeadingProps = {
    className?: string;
    classNameAnimationContainer ? : string;
}

const TextAnimation = ({ className,classNameAnimationContainer }: TextAnimationHeadingProps) => {
    return (
        < div className = { cn("mx-auto text-2xl lg:text-5xl my-6 flex flex-col gap-3 lg:gap-5 text-center font-bold", className) } >
                <div className="text-primary drop-shadow-2xl">Build Space</div>
                <div className={cn("w-fit  text-center",classNameAnimationContainer)}>
                    <TypeAnimation
                        sequence={[
                            'Your Team.',
                            1000,
                            'Your Ideas!',
                            1000,
                            "Code !!",
                            1000,
                        ]}
                        wrapper="span"
                        speed={50}
                        style={{ fontSize: '2em', display: 'inline-block' }}
                        repeat={Infinity}
                    />


                </div>
            </div >
    )
}

export default TextAnimation;
