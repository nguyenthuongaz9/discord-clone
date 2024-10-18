"use client"

import qs from "query-string"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"


import { useModal } from "@/hooks/use-modal-store"
import { Button } from "../ui/button"
import axios from "axios"
import toast from "react-hot-toast"



export const DeleteMessageModal = () => {

    const { isOpen , onClose, type , data } = useModal()
    

    const isModalOpen = isOpen && type === "deleteMessage";

    const { apiUrl , query } = data;

    const [isLoading, setIsLoading] = useState(false);

  


    const onClick = async () => {
        try {

            setIsLoading(true);
            const url = qs.stringifyUrl({
               url: apiUrl || "",
               query: query
            })
            await axios.delete(url)
            toast.success('Deleted Successfully')
            onClose()
        } catch (error) {
            console.log(error);
            toast.success('Deleted Fail')
        }
    }


   


    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Message
                    </DialogTitle>

                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to delete <br />
                        The messsage will be permanently deleted.
    
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

