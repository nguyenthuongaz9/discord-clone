import AdminHeader from "@/components/admins/admin-header"
import AdminSidebar from "@/components/admins/admin-sidebar"

import { Toaster } from 'react-hot-toast';


const AdminLayout = ({
    children
}:{
    children: React.ReactNode
}) => {
  return (
    <div className="w-full h-full flex gap-0">
      <AdminSidebar/>
      <div className="flex flex-col w-full">
        <div className="relative">
          <AdminHeader/>
        </div>
        {children}

        <Toaster />

      </div>
    </div>
  )
}

export default AdminLayout