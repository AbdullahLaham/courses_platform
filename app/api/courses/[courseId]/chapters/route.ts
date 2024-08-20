import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async  function POST (req: Request, {params}: {params: {courseId: string}}) {
    try {
        const {userId} = auth();
        const values = await req.json();
        const {courseId} = params;
        const {title} = values;
         

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId
            },
            orderBy: {
                position: 'desc',
            }
        });

       
        let newPosition = lastChapter ? lastChapter?.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId,
                position: newPosition,
            }
        })

        return NextResponse.json(chapter)

    } catch(error) {
        console.log("[COURSES_ID]", error);
        return new NextResponse("Internal Error", {status: 500})
    }

}

