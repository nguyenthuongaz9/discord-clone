"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Member, Profile, Server } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useRouter } from "next/navigation"



const ITEM_PER_PAGE = 10

type MemberWithProfile = Member & {
    profile:Profile
}

interface MemberTableProps{
    serverId: string;
}

const MemberTable = ({
    serverId,
}:MemberTableProps) => {
    const [filtervalue, setFilterValue] = useState({
        serverId: serverId,
        search: "",
        created: '',
    })

    const router = useRouter()

    const [members, setMembers] = useState<MemberWithProfile[]>([])
    const [totalPages, setTotalPages] = useState(0)

    const [currentPage, setCurrentPage] = useState(1)

    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [selectAll, setSelectAll] = useState(false)


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
        const fetchMembers = async () => {
            const query = builderQueryString(filtervalue, currentPage)
            console.log(query)
            const response = await axios.get(`/api/admins/members?${query}`)
            
            setMembers(response.data.data || [])
            setTotalPages(response.data.pagination.totalPages)
        }
        fetchMembers()
    }, [filtervalue.search, filtervalue.created, currentPage])


    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(members.map(member => member.id))
            setSelectAll(true)
        } else {
            setSelectedIds([])
            setSelectAll(false)
        }
    }

    const handleSelectServer = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }



    const handleDelete = async () => {
        if (selectedIds.length > 0) {
            try {
                await axios.delete(`/api/admins/members`, { data: { ids: selectedIds } })
                setMembers(members.filter(member => !selectedIds.includes(member.id)))
                setSelectedIds([])
                setSelectAll(false)

                toast.success("Delete successfully")
            } catch (error) {
                toast.error("Error")
            }

        }
    }



    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }
    return (
        <div className='w-full h-full p-4 space-y-10'>
            <div className='w-full flex gap-4 items-center'>
                <div className="flex flex-col gap-2">
                    <label className='text-sm' >Search</label>
                    <Input
                        placeholder="Enter server's name"
                        value={filtervalue.search}
                        onChange={(e) => setFilterValue({ ...filtervalue, search: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className='text-sm' >Created At</label>
                    <Input type='date' onChange={(e) => setFilterValue({ ...filtervalue, created: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-sm' >Delete</label>
                    <Button
                        className={cn('bg-red-600 text-white hover:bg-red-700', selectedIds.length === 0 && 'opacity-50 cursor-not-allowed')}
                        onClick={handleDelete}
                        disabled={selectedIds.length === 0}
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
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead>id</TableHead>
                        <TableHead>profile name</TableHead>
                        <TableHead>profile image</TableHead>
                        <TableHead>role</TableHead>
                        <TableHead>created At</TableHead>
                        <TableHead>update At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.length > 0 && members.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell >
                                <Input
                                    type="checkbox"
                                    value={member.id}
                                    className="w-4 cursor-pointer"
                                    checked={selectedIds.includes(member.id)}
                                    onChange={() => handleSelectServer(member.id)}
                                />
                            </TableCell>
                            <TableCell >{member.id}</TableCell>
                            <TableCell >{member.profile.name}</TableCell>
                            <TableCell>
                                <img src={member.profile.imageUrl} alt={member.profile.name} className="rounded-full w-10 h-10 object-cover" />
                            </TableCell>
                            <TableCell >{member.role}</TableCell>

                            <TableCell>{member.createdAt.toString()}</TableCell>
                            <TableCell>{member.updatedAt.toString()}</TableCell>
                           
                        </TableRow>
                    ))}
                </TableBody>
            </Table>



            <div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage > 1) handlePageChange(currentPage - 1);
                                }}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i + 1}>
                                <PaginationLink
                                    href="#"
                                    isActive={currentPage === i + 1}
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
                                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}

export default MemberTable
