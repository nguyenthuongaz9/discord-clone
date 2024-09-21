import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function PATCH(req: Request, 
    { params } : { params: { profileId: string }}
) {
    try {

        const body = await req.json()

        const { role } = body;




        
        const profile = await db.profile.update({
            where:{
                id: params?.profileId as string,
            },
            data:{
                role: role
            }
        })

        if(!profile) {
            return new NextResponse('Profile not found', { status: 404 })
        }

        return NextResponse.json(profile, { status: 200})
      
    } catch (error) {
        return new NextResponse('INTERNAL ERROR', { status: 500 })
    }
  }