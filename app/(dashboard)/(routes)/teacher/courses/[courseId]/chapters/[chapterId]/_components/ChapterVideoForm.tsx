"use client"

import { Chapter, MuxData } from '@prisma/client'
import React, { useState } from 'react'
import axios from 'axios'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form';
import { useRouter } from 'next/navigation';
import MuxPlayer from '@mux/mux-player-react';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from '@/components/ui/input';
  import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { ImageIcon, Pencil, PlusCircle, VideoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import FileUpload from '@/components/FileUpload';
import { isMapIterator } from 'util/types';

interface ChapterVideoProps {
    initialData: Chapter & {muxData?: MuxData | null},
    courseId: string,
    chapterId: string,
}



const ChapterVideo = ({initialData, courseId, chapterId}: ChapterVideoProps) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(current => !current)
  }


  const formSchema = z.object({
    videoUrl: z.string().min(1)
  });
  const form = useForm<z.infer<typeof formSchema>>  ({
      resolver: zodResolver(formSchema),
      defaultValues: {
        videoUrl: initialData?.videoUrl || "",
      },
  
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        const res = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);

        toast.success("chapter updated successfully");
        toggleEdit();
        router.refresh();

      } catch (error) {
        toast.error("something went wrong");
      }
      
    }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between '>
            Chapter Video
            <Button variant={'ghost'} onClick={toggleEdit} >
                {isEditing && <>Cancel</>}
                {!isEditing && !initialData?.videoUrl && 
                  (
                    <>
                      <PlusCircle className='h-4 w-4 mr-2' /> Add A video
                    </>
                  )
                }
                {!isEditing && initialData?.videoUrl && 
                  (
                    <>
                      <Pencil className='h-4 w-4 mr-2' /> Edit Video
                    </>
                  )
                }
            </Button>
        </div>
        {!isEditing && 
          !initialData?.videoUrl && (
            <div onClick={toggleEdit} className='h-60 flex items-center justify-center bg-slate-200 rounded-md mt-5 cursor-pointer'>
              <VideoIcon className='h-10 w-10 text-slate-500' />
            </div>
          )
        }

        {
          !isEditing && initialData?.videoUrl && (
            <div className='relative aspect-video mt-2'>
              <MuxPlayer 
              playbackId={initialData?.muxData?.playbackId || ""} 
               />
            </div>
          )
        }
        
        {isEditing && (
          <div>
              <div className='' >
              <FileUpload
              endpoint='chapterVideo' onChange={(url) => {
                if (url) onSubmit({videoUrl: url})

              }} />
              <div className='text-xs text-muted-foreground mt-4'>
                upload this chapter&aspos;s video

              </div>

          </div>
          </div>
        )}
        {!isEditing && initialData?.videoUrl && 
                  (
                    <div>
                      
                    </div>
                  )
        }
        
        
    </div>
  )
}

export default ChapterVideo



