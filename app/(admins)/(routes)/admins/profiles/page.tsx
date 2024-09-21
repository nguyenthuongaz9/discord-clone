import ProfileTable from "@/components/admins/profiles/profile-table"
import currentProfile from "@/lib/current-profile"
import { redirectToSignIn } from "@clerk/nextjs/server"

import { redirect } from "next/navigation"


const ProfilePage = async () => {
  const profile = await currentProfile()
  if (!profile) {
    return redirect('/sign-in')
  }

  if (profile.role === 'GUEST') {
    return redirect('/')
  }
  return (
    <div className="mt-[60px]">
      <ProfileTable profile={profile} />
    </div>
  )
}

export default ProfilePage