"use client"

import qs from "query-string"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"


import { useModal } from "@/hooks/use-modal-store"
import { Button } from "../ui/button"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"



export const DeleteChannelModal = () => {

    const { isOpen , onClose, type , data } = useModal()
    const router = useRouter()
    

    const isModalOpen = isOpen && type === "deleteChannel";

    const { server , channel } = data;

    const [isLoading, setIsLoading] = useState(false);

  


    const onClick = async () => {
        try {

            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            await axios.delete(url)
            onClose()
            router.refresh()
            window.location.reload()
        } catch (error) {
            console.log(error);
        }
    }


   


    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Channel
                    </DialogTitle>

                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to delete <span className="font-semibold text-indigo-500"> {channel?.name} </span> This action cannot be undone.
    
                    </DialogDescription>
                    
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>



                        <Button
                            disabled={isLoading}
                            className="bg-blue-600 text-white hover:bg-blue-700 transition"
                            onClick={onClick}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

