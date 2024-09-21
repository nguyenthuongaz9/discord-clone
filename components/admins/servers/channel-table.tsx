


import { Input } from '@/components/ui/input'
import { Channel } from '@prisma/client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface ChannelTableProps {
    serverId: string
}



const ITEM_PER_PAGE = 10
const ChannelTable = ({
    serverId
}: ChannelTableProps) => {

    const [filterChannel, setFilterChannel] = useState({
        serverId: serverId,
        search: "",
        created: ""
    })

    const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([])
    const [selectChannelAll, setSelectChannelAll] = useState(false)

    const [totalChannelPages, setTotalChannelPages] = useState(0)

    const [currentChannelPage, setCurrentChannelPage] = useState(1)
    const [channels, setChannels] = useState<Channel[]>([])

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



    useEffect(() => {
        const fetchChannel = async () => {
            const query = builderQueryString(filterChannel, currentChannelPage)
            console.log(query)
            const response = await axios.get(`/api/admins/channels?${query}`)

            setChannels(response.data.data || [])
            setTotalChannelPages(response.data.pagination.totalPages)
        }
        fetchChannel()
    }, [filterChannel.search, filterChannel.created, currentChannelPage])


    const handleSelectChannelAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedChannelIds(channels.map(channel => channel.id))
            setSelectChannelAll(true)
        } else {
            setSelectedChannelIds([])
            setSelectChannelAll(false)
        }
    }

    const handleSelectChannel = (id: string) => {
        if (selectedChannelIds.includes(id)) {
            setSelectedChannelIds(selectedChannelIds.filter(selectedId => selectedId !== id))
        } else {
            setSelectedChannelIds([...selectedChannelIds, id])
        }
    }




    const handleDeleteChannel = async () => {
        if (selectedChannelIds.length > 0) {
            try {
                await axios.delete(`/api/admins/channels`, { data: { ids: selectedChannelIds } })
                setChannels(channels.filter(channel => !selectedChannelIds.includes(channel.id)))
                setSelectedChannelIds([])
                setSelectChannelAll(false)

                toast.success("Delete successfully")
            } catch (error) {
                toast.error("Error")
            }

        }
    }



    const handlePageChange = (page: number) => {
        setCurrentChannelPage(page)
    }

    return (
        <div className="space-y-4">
            <h2 className="text-zinc-400 text-xl">Channel</h2>

            <div className='w-full flex gap-4 items-center'>
                <div className="flex flex-col gap-2">
                    <label className='text-sm' >Search</label>
                    <Input
                        placeholder="Enter server's name"
                        value={filterChannel.search}
                        onChange={(e) => setFilterChannel({ ...filterChannel, search: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className='text-sm' >Created At</label>
                    <Input type='date' onChange={(e) => setFilterChannel({ ...filterChannel, created: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-sm' >Delete</label>
                    <Button
                        className={cn('bg-red-600 text-white hover:bg-red-700', selectedChannelIds.length === 0 && 'opacity-50 cursor-not-allowed')}
                        onClick={handleDeleteChannel}
                        disabled={selectedChannelIds.length === 0}
                    >
                        Delete
                    </Button>
                </div>


            </div>
            <Table className="border">
                <TableHeader>
                    <TableRow>

                        <TableHead>
                            <Input
                                className="w-4 cursor-pointer"
                                type="checkbox"
                                checked={selectChannelAll}
                                onChange={handleSelectChannelAll}
                            />
                        </TableHead>
                        <TableHead>id</TableHead>
                        <TableHead>name</TableHead>
                        <TableHead>Type</TableHead>


                    </TableRow>
                </TableHeader>
                <TableBody>
                    {channels.length > 0 && channels.map((channel) => (
                        <TableRow key={channel.id}>
                            <TableCell >
                                <Input
                                    type="checkbox"
                                    value={channel.id}
                                    className="w-4 cursor-pointer"
                                    checked={selectedChannelIds.includes(channel.id)}
                                    onChange={() => handleSelectChannel(channel.id)}
                                />
                            </TableCell>
                            <TableCell >{channel.id}</TableCell>
                            <TableCell >{channel.name}</TableCell>
                            <TableCell >{channel.type}</TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>




            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentChannelPage > 1) handlePageChange(currentChannelPage - 1);
                            }}
                        />
                    </PaginationItem>
                    {Array.from({ length: totalChannelPages }, (_, i) => (
                        <PaginationItem key={i + 1}>
                            <PaginationLink
                                href="#"
                                isActive={currentChannelPage === i + 1}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(i + 1);
                                }}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentChannelPage < totalChannelPages) handlePageChange(currentChannelPage + 1);
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default ChannelTable