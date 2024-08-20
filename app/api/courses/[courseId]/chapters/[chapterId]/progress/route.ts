import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, {params}: {params: {courseId: string, chapterId: string}}) {
    try {
        const {userId} = auth();
        const {isCompleted} = await req.json();

        if (!userId) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId,
                }
            }, update: {
                isCompleted
            }, create: {
                userId,
                chapterId: params.chapterId,
                isCompleted
            }

        });
        return NextResponse.json(userProgress)

    } catch (error) {

    } finally {
        console.log('[CHAPTER_ID_PROGREE]', error);
        return new NextResponse("internal error", {status: 500})
    }
}