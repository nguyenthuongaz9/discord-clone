


import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { AdminRole, MemberRole, Profile } from "@prisma/client";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search');
    const createdAt = searchParams.get('created');

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const whereConditions: any = {};

    if (search) {
      whereConditions.name = {
        contains: search.toLowerCase(),
      };
    }


    if (createdAt) {
      const createdDate = new Date(createdAt);
      whereConditions.createdAt = {
        gte: new Date(createdDate.setHours(0, 0, 0, 0)),
        lt: new Date(createdDate.setHours(23, 59, 59, 999)),
      };
    }

    const totalServers = await db.server.count({
      where: whereConditions,
    });

    const servers = await db.server.findMany({
      where: whereConditions,
      skip: skip,
      take: limit,
      include: {
        members: {
          include: {
            profile: true
          }
        }
      }
    });

    const totalPages = Math.ceil(totalServers / limit);


    console.log(whereConditions)

    return NextResponse.json({
      data: servers,
      pagination: {
        totalPages,
        currentPage: page,
        limit,
      },
    });

  } catch (error) {
    console.error("Error fetching profiles:", error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}



export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const ids = body.ids as string[];



    if (!Array.isArray(ids) || ids.length === 0) {
      return new NextResponse('Invalid or empty list of IDs', { status: 400 });
    }
    await db.server.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });


    return new NextResponse('servers deleted successfully', { status: 200 });

  } catch (error) {
    console.error(error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
