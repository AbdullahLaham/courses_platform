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
import { Loader, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';


interface CategoryFormProps {
    initialData: Course,
    courseId: string
    options: {label: string, value: string}[],
}

const CategoryForm = ({initialData, courseId, options}: CategoryFormProps) => {
   // router
   const router = useRouter();

   const [isEditing, setIsEditing] = useState(false);
   const toggleEdit = () => setIsEditing(current => !current);

   const formSchema = z.object({
       categoryId: z.string().min(1, {
           message: "category is required"
       })
   });


   const form = useForm<z.infer<typeof formSchema>>  ({
       resolver: zodResolver(formSchema),
       defaultValues: {
          categoryId: initialData?.categoryId || "",
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
          Course Category
          <Button variant={'ghost'} onClick={toggleEdit} >
              {!isEditing ? <><Pencil className='w-4 h-4 mr-2' /> Edit Category</> : <> Cancel</>}
          </Button>

      </div>

      {!isEditing && 
          ( 
              <p className={cn("text-sm mt-2 ", !initialData?.categoryId && "text-slate-500 italic ")}>
                  {initialData?.categoryId || "No Category"}
              </p>
              
          )
      }

      {isEditing && (
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} >
                  <FormField control={form.control} name={'categoryId'} render={({field}) => (
                      <FormItem>
                          <FormControl>
                            <Combobox options={options} {...field} />
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


export default CategoryForm
