import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node';

const {Video}: any = new Mux({
    tokenId: 'a28b746c-81ec-44c7-8def-61597d0d91d3',
    tokenSecret: 'jBGP4NLt36d3E29z2QyFXgw3Z6VHmSCqhkXGKnptB6OpWHzTjpKQ3n/GcZ5ZjL+zZN5ltnFO6Bt'
});


export async function DELETE(req: Request, {params}: {params: {courseId: string; chapterId: string}}) {
    try {
        const {userId} = auth();
        const {courseId, chapterId} = params;

  

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId
            }
        })

        if (!chapter) {
            return new NextResponse("Not Found", {status: 404});
        }
        if (chapter?.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId,
                }
            });
            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }
        }
        const deletedChapter = await db.chapter.delete({
            where: {
                id: chapterId
            }
        });
        const publishedchaptersInCourse = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true,
            }
        });
        if (!publishedchaptersInCourse?.length) {
            await db.course.update({
                where: {
                    id: courseId
                },
                data: {
                    isPublished: false,
                }
            })
        }



        


    } catch (error) {
        console.log('CHAPTERID DELETED', error);
        return new NextResponse("Internal error", {status: 500})

    }
}
export async  function PATCH (req: Request, {params}: {params: {courseId: string; chapterId: string}}) {
    
    try {
        const {userId} = auth();
        const {isPublished, values} = await req.json();
        const {courseId, chapterId} = params;
        const {title} = values;

        
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }


        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if (!ownCourse) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            }
        })
        // handle video upload

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params?.chapterId,
                }
            });
            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData?.id,
                    }
                });
            }
            const asset = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: 'public',
                test: false,
            });
            await db.muxData.create({
                data: {
                    chapterId: params?.chapterId,
                    assetId: asset?.id,
                    playbackId: asset?.playback_ids?.[0]?.id,
                }
            })
        }

        return NextResponse.json(chapter)

    } catch(error) {
        console.log("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", {status: 500})
    }

}

