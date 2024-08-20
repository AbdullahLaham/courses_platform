"use client"

import { Chapter, Course } from '@prisma/client';
import React, { useState } from 'react';
import axios from 'axios';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';
import { Checkbox } from '@/components/ui/checkbox';

interface ChapterAccessFormProps {
    initialData: Chapter,
    courseId: string,
    chapterId: string,
}


const ChapterAccessForm = ({initialData, courseId, chapterId}: ChapterAccessFormProps) => {
     // router
     const router = useRouter();

     const [isEditing, setIsEditing] = useState(false);
     const toggleEdit = () => setIsEditing(current => !current);

     const formSchema = z.object({
         isFree: z.boolean().default(false)
     });


     const form = useForm<z.infer<typeof formSchema>>  ({
         resolver: zodResolver(formSchema),
         defaultValues: {
            isFree: Boolean(initialData?.isFree) || false,
         },
       });
 
       const { isSubmitting, isValid } = form.formState;
 
       const onSubmit = async (values: z.infer<typeof formSchema>) => {
         try {
           const res = await axios.patch(`/api/courses/${courseId}/chapter/${chapterId}`, values);
 
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
            Chapter Access Settings
            <Button variant={'ghost'} onClick={toggleEdit}>
                {!isEditing ? <><Pencil className='w-4 h-4 mr-2' /> Edit Access</> : 'Cancel'}
            </Button>

        </div>
        {!isEditing && 
            ( 
                <div className={cn("text-sm mt-2 ", !initialData?.isFree && "text-slate-500 italic ")}>
                    {!initialData?.isFree ? "This Chapter is Free for preview" : "this chapter is not free"}
                    
                </div>
            )
        }
        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >
                    <FormField control={form.control} name={'isFree'} render={({field}) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 '>
                            <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}
                />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                                <FormDescription>
                                    check this box if you want to make this chapter free for preview

                                </FormDescription>

                            </div>
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

export default ChapterAccessForm
