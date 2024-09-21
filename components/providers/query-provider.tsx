"use client"
import {
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query"


import { useState } from "react"



export const QueryProvider = ({
    children
}:{
    children: React.ReactNode
})=>{

    const [queryClient] = useState(()=> new QueryClient())
    return (
        <QueryClientProvider client={new QueryClient()}>
            
            {children}
        </QueryClientProvider>
    )
}