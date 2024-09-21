"use client"

import { Channel, Member, Profile, Server } from "@prisma/client";
import ChannelTable from "./channel-table";
import MemberTable from "./member-table";

interface ServerDetailProps {
    server: Server & {
        members: (Member & { profile: Profile })[],
        channels: Channel[]
    };
}

const ITEM_PER_PAGE = 5;


const builderQueryString = (filtervalue: any, currentPage: any) => {
    const params = new URLSearchParams();
    Object.entries({
        ...filtervalue,
        page: currentPage || '',
        limit: ITEM_PER_PAGE
    }).forEach(([key, value]) => {
        if (value) {
            params.append(key, value as string)
        }
    })
    return params.toString();
}

const ServerDetail = ({
    server
}: ServerDetailProps) => {


   

    return (
        <div className="w-full p-4 space-y-10 ">
            <div className="flex gap-4 items-center w-full">

                <div className="w-40 h-40 flex-shrink-0">
                    <img
                        src={server.imageUrl}
                        className="w-full h-full object-cover rounded-md"
                        alt={server.name}
                    />
                </div>


                <div className="flex-1">
                    <h2 className="text-2xl font-bold">{server.name}</h2>
                    <p className="mt-2 text-sm text-gray-500">Members: {server.members.length}</p>
                    <p className="text-sm text-gray-500">Channels: {server.channels.length}</p>
                    <p className="text-sm text-gray-500">admin:
                        {server.members.find((member) => member.role === 'ADMIN')?.profile.email}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <ChannelTable
                    serverId={server.id}
                />
            </div>
            <div className="space-y-4">
                <MemberTable
                    serverId={server.id}
                />
            </div>





        </div>
    )
}

export default ServerDetail;
