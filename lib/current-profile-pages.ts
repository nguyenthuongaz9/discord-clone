import { getAuth } from "@clerk/nextjs/server";
import { db } from "./db";
import { NextApiRequest } from "next";



export default async function currentProfilePage (req: NextApiRequest){
    const { userId } = getAuth(req)
    if(!userId){
        return null;
    }

    const profile = await db.profile.findUnique({
        where:{
            userId: userId
        }
    })

   
    return profile
}