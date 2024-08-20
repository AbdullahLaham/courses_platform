import { db } from '@/lib/db';
import React from 'react'
import Categories from './_components/Categories';
import SearchInput from '@/components/SearchInput';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CoursesList from '@/components/CoursesList';
import { getCourses } from '@/actions/getCourses';

interface SearchPageProps  {
  searchParams: {
    title: string,
    categoryId: string,
  }
}
const SearchPage = async ({searchParams}: SearchPageProps) => {
  const {userId} = auth();
  if (!userId) return redirect('/');

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc'
,    }
  });
  const courses = await getCourses({
    userId,
    ...searchParams
  });
  return (
    <>
      <div className='px-6 pt-6 md:hidden block md:mb-0'>
        <SearchInput />
      </div>
      <div className='p-6 space-y-6'>
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  )
}

export default SearchPage;
