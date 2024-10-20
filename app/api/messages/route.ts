import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get('cursor');
        const channelId = searchParams.get('channelId');
        const serverId = searchParams.get('serverId');

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!channelId) {
            return new NextResponse("Channel ID is required", { status: 400 });
        }

        if (!serverId) {
            return new NextResponse("Server ID is required", { status: 400 });
        }

        let messages: Message[] = [];

        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                cursor: {
                    id: cursor,
                },
                where: {
                    member: {
                        server: {
                            id: serverId,
                        }
                    },
                    channelId: channelId
                },
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            });
        } else {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    member: {
                        server: {
                            id: serverId,
                        }
                    },
                    channelId: channelId
                },
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            });
        }

        let nextCursor = null;
        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[messages.length - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        });
        
    } catch (error) {
        console.log("[MESSAGES_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
