import ServerTable from "@/components/admins/servers/server-table"
import currentProfile from "@/lib/current-profile"
import { redirect } from "next/navigation"





const ServerPage = async () => {
    const profile = await currentProfile()
    if (!profile) {
      return redirect('/sign-in')
    }
  
    if (profile.role === 'GUEST') {
      return redirect('/')
    }
    return (
      <div className="mt-[60px]">
        <ServerTable/>
      </div>
    )
}

export default ServerPage