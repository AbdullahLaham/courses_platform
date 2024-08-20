import {PrismaClient} from '@prisma/client';

declare global {
    var prisma: PrismaClient  | undefined
}

export const db = globalThis.prisma || new PrismaClient();
// to save the project from cashing
if (process.env.NODE_ENV === "production") {
    globalThis.prisma = db;
}
