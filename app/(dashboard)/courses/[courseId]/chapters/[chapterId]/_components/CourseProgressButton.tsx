"use client"
import { Button } from '@/components/ui/button'
import { useConfettiStore } from '@/hooks/useConfettiStore'
import axios from 'axios'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
interface CourseProgressButtonProps {
    chapterId: string,
     courseId: string,
     nextChapterId?: string,
     isCompleted?: boolean

}
const CourseProgressButton = ({chapterId, courseId, nextChapterId, isCompleted}: CourseProgressButtonProps) => {
    const Icon = isCompleted ? XCircle : CheckCircle;
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);
    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            });
            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }

            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }
            toast.success("progress updated");
            router.refresh();
            


        } catch (error) {

        } finally {
            setIsLoading(false)
        }

    }

    return (
    <Button type='button' variant={isCompleted? 'outline' : "success"} className='w-full md:w-auto' onClick={onClick} disabled={isLoading}
    >
        <Icon className='h-4 w-4 ml-2' />
      {isCompleted ? "Not Completed":"Mark as complete" }
    </Button>
  )
}

export default CourseProgressButton
