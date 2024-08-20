"use client"


import ConfirmModel from '@/components/models/ConfirmModel'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
interface ChapterActionsProps {
    disabled: boolean,
    courseId: string,
    chapterId: string,
    isPublished: Boolean,
}
const ChapterActions = ({disabled, courseId, chapterId, isPublished}: ChapterActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const togglePublish = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                toast.success("chapter unpublished");
            }
            else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("chapter published");
            }

            router.refresh();
            // router.push(`teacher/courses/${courseId}`)


        } catch (error) {
                toast.error("something went wrong")
        } finally {
            setIsLoading(false)
        }
    }


    const onDelete  = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("chapter deleted");
            router.refresh();
            router.push(`teacher/courses/${courseId}`)


        } catch (error) {
                toast.error("something went wrong")
        } finally {
            setIsLoading(false)
        }
    }
  return (
    <div className='flex items-center gap-x-2'>
        <Button disabled={disabled || isLoading} onClick={togglePublish} variant='outline' size='sm' >
            {isPublished? "Unpublish" : "Publish"}


        </Button>
        <ConfirmModel onConfirm={onDelete} >
            <Button size={'sm'} disabled={isLoading}>
                <Trash className='w-4 h-4' />
            </Button>
        </ConfirmModel>
        
      
    </div>
  )
}

export default ChapterActions
