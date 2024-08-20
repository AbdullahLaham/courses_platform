import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import ChapterTitleForm from './_components/ChapterTitleForm';
import ChapterDescriptionForm from './_components/ChapterDescriptionForm';
import ChapterAccessForm from './_components/ChapterAccessForm';
import Banner from '@/components/banner';
import ChapterActions from './_components/ChapterActions';

const ChapterIdPage = async ({ params }: { params: { courseId: string; chapterId: string } }) => {
  const { userId } = auth();
  if (!userId) return redirect('/');
  const chapter = await db.chapter.findUnique({
    where: {
      id: params?.chapterId,
      courseId: params?.courseId
    },
    include: {
      muxData: true
    }
  })
  if (!chapter) {
    return redirect('/')
  }
  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl
  ];

  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields} / ${requiredFields.length}`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className='p-6'>
      {
        !chapter?.isPublished && (
          <Banner label="this chapter is not published, it will not be visible in the course" variant='warning' />
        )
      }
      <div className='flex items-center justify-between '>
        <div className='w-full'>
          <Link href={`/teacher/courses/${params.courseId}`} className='flex items-center text-sm hover:opacity-75 transition mb-6'>
            <ArrowLeft className='h-4 w-4 mr-2' /> Back to course setup
          </Link>
          <div className='w-full flex items-center justify-between'>
            <div className='flex flex-col gap-y-2'>
              <h1 className='text-2xl font-medium'>
                Chapter Creation

              </h1>
              <span className='text-sm text-slate-700'>
                Complete All fields {completionText}

              </span>

            </div>
            <ChapterActions disabled={!isComplete} courseId={params?.courseId} chapterId={params?.chapterId} isPublished={chapter?.isPublished} />

          </div>
        </div>


      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
        <div className='space-y-4'>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={LayoutDashboard} />
              <h2 className='text-xl'>
                Customise your chapter

              </h2>

            </div>
            {/* ChapterTitleForm */}
            <ChapterTitleForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
            <ChapterDescriptionForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
          </div>
          <div className='flex items-center gap-x-2'>
            <IconBadge icon={Eye}  />
            <h2 className='text-xl'>
              Access Settings
            </h2>

          </div>
          <ChapterAccessForm initialData={chapter} courseId={params.courseId} chapterId={params.courseId} />



        </div>
        <div>
          <div className='flex items-center gap-x-2'>
            <IconBadge icon={Video} />
            <h2 className='text-xl'>Add a video</h2>

          </div>
        </div>
      </div>
      
    </div>
  )
}

export default ChapterIdPage
