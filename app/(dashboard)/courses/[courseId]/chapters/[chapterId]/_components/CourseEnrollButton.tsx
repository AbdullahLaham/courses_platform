"use client"

import { Button } from '@/components/ui/button'
// import { formatPrice } from '@/lib/format'
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


interface CourseEnrollButtonProps {
    courseId: string,
    price: number,
}
const CourseEnrollButton = ({courseId, price}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const onClick = async () => {
        try {
            setIsLoading(true);
            const res  = await axios.post(`/api/courses/${courseId}/checkout`);
            window.location.assign(res.data.url);

        } catch (error) {
            toast.error("something went wrong")
        } finally {
            setIsLoading(false)
        }
    }
  return (
    <Button onClick={onClick} disabled={isLoading} className='w-full md:w-auto' size='sm'>
      Enroll For ${price}
    </Button>
  )
}

export default CourseEnrollButton
