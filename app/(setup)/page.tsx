import InitialModal from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import InitialProfile from "@/lib/initial-profile";
import { redirect } from "next/navigation";

export default async function SetupPage() {

  const profile = await InitialProfile()


  
  if(profile.role === "ADMIN") {
    return redirect(`/admins`)
  }

 


  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id 
        }
      }
    }
  })


  if(server){
    return redirect(`/servers/${server.id}`)
  }


  return (
    <InitialModal/>
  );
}
