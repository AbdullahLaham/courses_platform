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
import { Pencil } from 'lucide-react';

interface ChapterTitleFormProps {
    initialData: {
        title: string,
    },
    courseId: string,
    chapterId: string
}
const ChapterTitleForm: React.FC<ChapterTitleFormProps> = ({initialData, courseId, chapterId}) => {
    // router
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing(current => !current)
    const formSchema = z.object({
        title: z.string().min(1)
    });
    const form = useForm<z.infer<typeof formSchema>>  ({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    
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
        <div className='fomt-medium flex items-center justify-between '>
            Chapter Title
            <Button variant={'ghost'} onClick={toggleEdit}>
                {!isEditing ? <><Pencil className='w-4 h-4 mr-2' /> Edit Title</> : 'Cancel'}

            </Button>

        </div>
        {!isEditing && 
            ( 
                <p>
                    {initialData.title}
                </p>
            )
        }
        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >
                    <FormField control={form.control} name={'title'} render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input disabled={isSubmitting} placeholder='e.g. "Introduction to the course"' {...field} />
                            
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}  />
                    <div className='flex items-center gap-x-2 mt-[1rem]'>
                        <Button disabled={!isValid || isSubmitting} type='submit' >
                            Save
                        </Button>

                    </div>

                </form>
            </Form>
        )}
        


      
    </div>
  )
}


export default ChapterTitleForm
