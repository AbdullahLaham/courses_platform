"use client"

import ConfirmModel from '@/components/models/ConfirmModel'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';
import { useConfettiStore } from '@/hooks/useConfettiStore'
import React, { useState } from 'react'

interface ActionsProps {
    disabled: boolean,
    courseId: string,
    isPublished: Boolean,
}
const Actions = ({disabled, courseId, isPublished}: ActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const togglePublish = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("course unpublished");
                confetti.onOpen();
            }
            else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("course published");
            }

            router.refresh();


        } catch (error) {
                toast.error("something went wrong")
        } finally {
            setIsLoading(false)
        }
    }


    const onDelete  = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}`);
            toast.success("course deleted");
            router.refresh();
            router.push(`teacher/courses`)


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


export default Actions
