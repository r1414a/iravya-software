import DashboardHomePageAdminTask from "@/components/DashboardHomePageAdminTasks"
import { SUPER_ADMIN_TASKS } from "@/constants/tasks"

export default function SuperAdminHome() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#701a40] to-[#5a1430] p-6">

      {/* Heading */}
      <div className="text-center mb-10">
        {/* <h1 className="text-3xl font-light text-white">
          Welcome to dashboard!.
        </h1> */}
        <p className="text-white/70 text-xl mt-2">
          Manage platform, brands, warehouses, and devices
        </p>
      </div>

      {/* Super Admin Task In Card Grid */}
      <DashboardHomePageAdminTask tasks={SUPER_ADMIN_TASKS}/>
    </div>
  )
}