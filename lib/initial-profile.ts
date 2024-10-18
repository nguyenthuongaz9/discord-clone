import { currentUser } from "@clerk/nextjs/server"
import { db } from "./db"
import { redirect } from "next/navigation"





const InitialProfile = async () => {
    const user = await currentUser()
    if(!user){
        return redirect('/sign-in')
    }


    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        },
    })




    
    if(profile){
        const updateProfile = await db.profile.update({
            where:{
                userId: user.id
            },
            data: {
                lastLogin: new Date()
            }
        })
    
        return updateProfile
    }
    

    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
            lastLogin: new Date()
        }
    })

    return newProfile
}

export default InitialProfile