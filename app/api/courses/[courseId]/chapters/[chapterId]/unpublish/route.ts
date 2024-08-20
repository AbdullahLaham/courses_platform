import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, {params}: {params: {
    courseId: string, chapterId: string,
}}) {
    try {
        const {userId} = auth();
        const values = await req.json();
         
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        const ownCourse = await db.course.findUnique({
            where: {
                id: params?.courseId,
                userId
            }
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        const unPublishedChapter = await db.chapter.update({
            where: {
                id: params?.chapterId,
                courseId: params.courseId,
                
            },
            data: {
                isPublished: false
            }
        });

        const PublishedChapteresInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        });
        
        if (!PublishedChapteresInCourse?.length) {
            await db.course.update({
                where: {
                    id: params?.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }
        return NextResponse.json(unPublishedChapter)

    } catch(error) {
        console.log("[CHAPTER_PUBLISHED]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}
// PublishedChapteresInCourse