"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Profile } from "@prisma/client"
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

const ITEM_PER_PAGE = 10

interface ProfileTableProps {
    profile: Profile
}
const ProfileTable = ({
    profile
}: ProfileTableProps) => {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(()=> {
        setIsMounted(true)
    },[])
    const [filtervalue, setFilterValue] = useState({
        search: "",
        role: "",
        created: '',
    })

    const onChange = async (id: string, newRole: string) => {
        try {
            await axios.patch(`/api/admins/profiles/${id}`, { role: newRole })

            toast.success("Role updated successfully")
            location.reload()
        } catch (error) {
            toast.error("Failed to update role")
        }
    }

    const [profiles, setProfiles] = useState<Profile[]>([])
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
        const fetchProfile = async () => {
            const query = builderQueryString(filtervalue, currentPage)
            const response = await axios.get(`/api/admins/profiles?${query}`)
            if(response.data){
                const existingProfiles = response.data.data.filter( (p:any) => p?.id !== profile.id)
                setProfiles(existingProfiles || [])
                setTotalPages(response.data.pagination.totalPages)
            }
        }
        fetchProfile()
    }, [filtervalue.search, filtervalue.created, filtervalue.role, currentPage])

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(profiles.map(profile => profile.id))
            setSelectAll(true)
        } else {
            setSelectedIds([])
            setSelectAll(false)
        }
    }

    const handleSelectProfile = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    const handleDelete = async () => {
        if (selectedIds.length > 0) {
            try {
                await axios.delete(`/api/admins/profiles`, { data: { ids: selectedIds } })
                setProfiles(profiles.filter(profile => !selectedIds.includes(profile.id)))
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


    if(!isMounted){
        return null;
    }
    return (
        <div className='w-full h-full p-4 space-y-10'>
            <div className='w-full flex gap-4 items-center'>
                <div className="flex flex-col gap-2">
                    <label className='text-sm'>Search</label>
                    <Input
                        placeholder="Enter profile's name"
                        value={filtervalue.search}
                        onChange={(e) => setFilterValue({ ...filtervalue, search: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-sm'>Role</label>
                    <Select
                        value={filtervalue.role}
                        onValueChange={(value) => setFilterValue({ ...filtervalue, role: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                <SelectItem value="GUEST">GUEST</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-sm'>Created At</label>
                    <Input type='date' onChange={(e) => setFilterValue({ ...filtervalue, created: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-sm'>Delete</label>
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
                        <TableHead>userId</TableHead>
                        <TableHead>name</TableHead>
                        <TableHead>image</TableHead>
                        <TableHead>email</TableHead>
                        <TableHead>role</TableHead>
                        <TableHead>created At</TableHead>
                        <TableHead>update At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {profiles.length > 0 && profiles.map((profile) => {
                        

                        return (
                            <TableRow key={profile.id}>
                                <TableCell>
                                    <Input
                                        type="checkbox"
                                        value={profile.id}
                                        className="w-4 cursor-pointer"
                                        checked={selectedIds.includes(profile.id)}
                                        onChange={() => handleSelectProfile(profile.id)}
                                    />
                                </TableCell>
                                <TableCell>{profile.id}</TableCell>
                                <TableCell>{profile.userId}</TableCell>
                                <TableCell>{profile.name}</TableCell>
                                <TableCell>
                                    <img src={profile.imageUrl} alt={profile.name} width="50" className="rounded-full" />
                                </TableCell>
                                <TableCell>{profile.email}</TableCell>
                                <TableCell>
                                    <Select
                                        value={profile.role}
                                        onValueChange={(value) => onChange(profile.id, value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={profile.role} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                                <SelectItem value="GUEST">GUEST</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>{profile.createdAt.toString()}</TableCell>
                                <TableCell>{profile.updatedAt.toString()}</TableCell>
                            </TableRow>
                        )
                    })}

                    {profiles.length === 0 && (
                        <div className="flex items-center justify-center">
                            No Item
                        </div>
                    )}
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

export default ProfileTable
