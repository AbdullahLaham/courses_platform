"use client"

import { Course } from '@prisma/client'
import React, { useState } from 'react'
import axios from 'axios'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form';
import { useRouter } from 'next/navigation';
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
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import FileUpload from '@/components/FileUpload';

interface ImageFormProps {
    initialData: Course,
    courseId: string,
}



const ImageForm = ({initialData, courseId}: ImageFormProps) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(current => !current)
  }


  const formSchema = z.object({
    imageUrl: z.string().min(1, {
          message: "imageUrl is required"
      })
  });
  const form = useForm<z.infer<typeof formSchema>>  ({
      resolver: zodResolver(formSchema),
      defaultValues: {
        imageUrl: initialData?.imageUrl || "",
      },
  
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        const res = await axios.patch(`/api/courses/${courseId}`, values);

        toast.success("course updated successfully");
        toggleEdit();
        router.refresh();

      } catch (error) {
        toast.error("something went wrong");
      }
      
    }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between '>
            Course Image
            <Button variant={'ghost'} onClick={toggleEdit} >
                {isEditing && <>Cancel</>}
                {!isEditing && !initialData?.imageUrl && 
                  (
                    <>
                      <PlusCircle className='h-4 w-4 mr-2' /> Add An Image
                    </>
                  )
                }
                {!isEditing && initialData?.imageUrl && 
                  (
                    <>
                      <Pencil className='h-4 w-4 mr-2' /> Edit Image
                    </>
                  )
                }
            </Button>
        </div>
        {!isEditing && 
          !initialData?.imageUrl && (
            <div onClick={toggleEdit} className='h-60 flex items-center justify-center bg-slate-200 rounded-md mt-5 cursor-pointer'>
              <ImageIcon className='h-10 w-10 text-slate-500' />
            </div>
          )
        }

        {
          !isEditing && initialData?.imageUrl && (
            <div className='relative aspect-video mt-2'>
              <Image fill src={initialData?.imageUrl || ""} alt={initialData.title} className='object-cover rounded-md'  />
            </div>
          )
        }
        
        {isEditing && (
          <div>
              <div className='' >
              <FileUpload
              endpoint='courseImage' onChange={(url) => {
                if (url) onSubmit({imageUrl: url})

              }} />
              </div>

          </div>
        )}
    </div>
  )
}

export default ImageForm

// const onDragEnd = (result: DropResult) => {
//   if (!result.destination) return;
//   const startIndex = Math.min(result.source.index, result.destination.index);
//   const endIndex = Math.max(result.source.index, result.destination.index);
//   const copyChapters = [...chapters];
//   const [reorderedItem] = copyChapters.splice(startIndex,1);
//   copyChapters.splice(endIndex,0,reorderedItem)
//   setChapters(copyChapters);

// }