"use client"

import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    // logo from logoipsum
    <Image width={130} height={80} alt='logo'  src={'/logo.png'} />
  )
}

export default Logo
