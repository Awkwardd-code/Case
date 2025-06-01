import Image from 'next/image'
import React from 'react'

function CoverImage() {
    return (
        <div className="mx-auto w-fit shadow-lg">
            <Image
                src={"/banner-animate.gif"}
                height={400}
                width={1000}
                alt="banner-img"
            />
        </div>
    )
}

export default CoverImage
