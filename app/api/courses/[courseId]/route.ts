import { db } from "@/lib/db";
import Mux from '@mux/mux-node'
import { auth } from "@clerk/nextjs/server";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";
import { isTeacher } from "@/lib/teacher";

const {Video}: any = new Mux({
    tokenId: 'a28b746c-81ec-44c7-8def-61597d0d91d3',
    tokenSecret: 'jBGP4NLt36d3E29z2QyFXgw3Z6VHmSCqhkXGKnptB6OpWHzTjpKQ3n/GcZ5ZjL+zZN5ltnFO6Bt'
});


export async function DELETE(req: Request, {params}: {params: {courseId: string}}) {
    try {
        const {userId} = auth();
        const {courseId} = params;

  

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });
        if (!ownCourse) {
            return new NextResponse("Not Found", {status: 401});
        }
       
        for (const chapter of ownCourse?.chapters) {
            if (chapter?.muxData?.assetId) {
                await Video.Assets.del(chapter.muxData.assetId);
            }

        }
        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId
            }
        });

        return NextResponse.json(deletedCourse)

    


        


    } catch (error) {
        console.log('Course_ID DELETED', error);
        return new NextResponse("Internal error", {status: 500})

    }
}

export async function PATCH(req: Request, {params}: {params: {
    courseId: string
}}) {
    try {
        const {userId} = auth();
        const values = await req.json();
        const {courseId} = params;
         
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values
            }
        });
        return NextResponse.json(course)

    } catch(error) {
        console.log("[COURSES_ID]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}