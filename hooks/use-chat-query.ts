
import qs from "query-string"

import { useParams } from "next/navigation"

import { useInfiniteQuery } from "@tanstack/react-query"


import { useSocket } from "@/components/providers/socket-provider"



interface ChatQueryProps{
    queryKey: string;
    apiUrl: string;
    paramKey: "channelId" | "conversationId" ;
    paramValue: string;
    serverId:string;
}



export const useChatQuery = ({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
    serverId
}: ChatQueryProps) => {
    
    const fetchMessages = async ({ pageParam = undefined})=>{
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue,
                serverId: serverId
            
            }
        }, { skipNull: true })


        const res = await fetch(url)
        return res.json()
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: 1000,
        initialPageParam: undefined
    });


    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    }
}