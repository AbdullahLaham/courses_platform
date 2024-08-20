"use client"

import { UserButton, useAuth } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import SearchInput from '@/components/SearchInput'
import { isTeacher } from '@/lib/teacher'

const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isTeacherPage = pathname.startsWith("/teacher");
  const isCoursePage = pathname?.includes('/courses');
  const isSearchPage = pathname === '/search';
  const {userId} = useAuth();
  return (
    <>
      {isSearchPage && (
        <div className='hidden md:block'>
          <SearchInput />
        </div>
      )}
      <div className='flex items-center gap-x-2 ml-auto'>
        {isTeacherPage || isCoursePage ? (
          <Link href={'/'}>
            <Button  variant={'ghost'}>
              <LogOut className='h-4 w-4 mr-2' />
              Exit
            </Button>
          </Link>
        ) :  (
          <Link href={'/teacher/courses'}>
            <Button size={'sm'} variant={'ghost'}>
              Teacher mode
            </Button>
          </Link>
        ) }
        <UserButton afterSignOutUrl='/' appearance={{
              elements: {
                avatarBox: "h-[42px] w-[42px]"
              }
            }}/>
        
      </div>
    </>
  )
}

export default NavbarRoutes
