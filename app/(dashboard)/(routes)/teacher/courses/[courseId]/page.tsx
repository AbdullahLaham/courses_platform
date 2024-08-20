
import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server'
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'
import TitleForm from './_components/TitleForm';
import DescriptionForm from './_components/DescriptionForm';
import ImageForm from './_components/ImageForm';
import CategoryForm from './_components/CategoryForm';
import PriceForm from './_components/PriceForm';
import AttachmentForm from './_components/AttchmentForm';
import ChapterForm from './_components/ChapterForm';
import Banner from '@/components/banner';
import Actions from './_components/Actions';

const CourseIdPage = async ({params}: {params: {courseId: string}}) => {


    const {userId} = auth();

    if (!userId) {
      return redirect('/');
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId
        },
        include: {
          attachments: {
            orderBy: {
              createdAt: "asc",
            }
          },
          chapters: {
            orderBy: {
              position: "asc"
            }
          }
        }
    });

    

    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    
    console.log(categories, 'categ');

    if (!userId || !course) return redirect("/");

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished),
    ];


    const totalFields = requiredFields.length;

    const completedFields = requiredFields.filter(Boolean).length;
    
    let completionText = `(${completedFields} / ${totalFields})`;
    
    const isComplete = requiredFields.every(Boolean);

  return (
    <div className='p-6'>
      {
        !course?.isPublished && (
          <Banner label='this course is unpublished, it will not be visible to the students' />
        )
      }
        <div className='flex items-center justify-between'>
          <div>
            <div className='flex flex-col gap-y-2'>
              <h1 className='text-2xl font-medium'>Cource Setup</h1>
              <span className=''>complete All fields {completionText}</span>

            </div>
            {/*Add Actions */}
            <Actions disabled={!isComplete} courseId={params.courseId} isPublished={course.isPublished} />
          </div>
        </div>
        
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 '>

        <div>
            <div className='flex items-center gap-x-2'>
                <IconBadge icon={LayoutDashboard} variant={'default'} size={'sm'} />
                <h2 className='text-xl'>Customize your course</h2>
            </div>,
            <TitleForm initialData={course} courseId={params?.courseId} />
            <DescriptionForm initialData={course} courseId={params?.courseId} />
            <ImageForm initialData={course} courseId={params?.courseId} />
            <CategoryForm initialData={course} courseId={params?.courseId} options={categories.map(({name, id}) => (
              {label: name, value: id}
            ))} />
        </div>
        <div className='space-y-6 '>
          <div>
            <div className='flex items-center gap-x-2 '>
              <IconBadge icon={ListChecks} />
              <h2 className='text-xl'>
                Course Chapters
              </h2>

            </div>
            <ChapterForm initialData={course} courseId={course?.id} />
          </div>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={CircleDollarSign} />
              <h2 className='text-xl'>
                Sell Your Course
              </h2>
            </div>
            <PriceForm initialData={course} courseId={course?.id}  />
          </div>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={File} />
              <h2 className='text-xl'>
                Resources & Attatchment
              </h2>
            </div>
            <AttachmentForm initialData={course} courseId={params?.courseId} />
          </div>

        </div>
    
      </div>
    </div>
  )
}

export default CourseIdPage ;
