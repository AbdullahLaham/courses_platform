import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, {params}: {params: {
    courseId: string,
}}) {
    try {
        const {userId} = auth();
         
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const course = await db.course.findUnique({
            where: {
                id: params?.courseId,
                userId
            }, include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });
        if (!course) {
            return new NextResponse('not found', {status: 404})
        }
        const hasPublishedChapters = course.chapters.some((chapter) => chapter.isPublished); // if only one chapter is deleted


        if (!course ||  !course?.title || !course?.description || !course?.imageUrl || !hasPublishedChapters || course?.categoryId)  {
            return new NextResponse("missing required fields", {status: 401});
        }

        const publishedCourse = await db.course.update({
            where: {
                id: params?.courseId,
                userId
                
            },
            data: {
                isPublished: true
            }
        });
        return NextResponse.json(publishedCourse)

    } catch(error) {
        console.log("[CHAPTER_PUBLISHED]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}