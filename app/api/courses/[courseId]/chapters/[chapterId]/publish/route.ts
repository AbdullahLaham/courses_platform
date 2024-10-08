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
        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,

            }
        });
        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params?.chapterId
            }
        });

        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("missing required fields", {status: 400})
        }
        
        const publishedChapter = await db.chapter.update({
            where: {
                id: params?.chapterId,
                courseId: params.courseId,
                
            },
            data: {
                isPublished: true
            }
        });
        return NextResponse.json(publishedChapter)

    } catch(error) {
        console.log("[CHAPTER_PUBLISHED]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}