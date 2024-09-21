import ServerDetail from "@/components/admins/servers/server-detail";
import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
    params: {
        serverId: string;
    }
}


const ServerIdPage = async ({
    params
}: ServerIdPageProps) => {


    const profile = await currentProfile()

    if (!profile) {
        return redirect('/sign-in')
    }

    if(profile.role === 'GUEST'){
        return redirect('/')
    }

    const server = await db.server.findUnique({
        where:{
            id: params.serverId
        },
        include:{
            members:{
                include:{
                    profile: true
                }
            },
            channels: true
        },
        
    })

   
    if(!server){
        return redirect('/admins/servers')
    }


    return (
        <div className="mt-[60px]">
            <ServerDetail
                server={server}
            />
        </div>
    )
}

export default ServerIdPage