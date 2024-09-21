"use client"

import qs from "query-string"
import { Member, MemberRole, Profile } from "@prisma/client"
import UserAvatar from "../user-avatar";
import ActionTooltip from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";




interface ChatItemProps {
  id: string,
  content: string,
  member: Member & {
    profile: Profile
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;

}


const formSchema = z.object({
  content: z.string().min(1),
})

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
}

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {

  const [isEditting, setIsEditing] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { onOpen } = useModal()


  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false)
      }


      
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content
    }
  })


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery
      })



      await axios.patch(url, values)

      form.reset()
      setIsEditing(false)


    } catch (error) {
      console.error(error)
    }
  }

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    form.reset({
      content: content
    })
  }, [content])

  const fileType = fileUrl?.split(".").pop()

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id

  const canDeleteMesssage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMesssage = !deleted && isOwner && !fileUrl;

  const isPDF = fileType === "pdf" && fileUrl
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div 
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center ">
              <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">{member.profile.name}</p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>

            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>

          </div>

          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                fill
                src={fileUrl}
                alt={content}
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>


            </div>
          )}
          {!fileUrl && !isEditting && (
            <p className={cn(
              "text-sm text-zinc-600 dark:text-zinc-300",
              deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
            )}>
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditting && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited Message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 transition" disabled={isLoading}>
                  Save
                </Button>

              </form>


              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )

          }
        </div>
      </div>
      {canDeleteMesssage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMesssage && (
            <ActionTooltip
              label="Edit"
            >
              <Edit onClick={() => setIsEditing(true)} className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
            </ActionTooltip>
          )}
          <ActionTooltip
            label="Delete"
          >
            <Trash
              onClick={() => onOpen("deleteMessage", { apiUrl: `${socketUrl}/${id}`, query: socketQuery })}
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}

export default ChatItem