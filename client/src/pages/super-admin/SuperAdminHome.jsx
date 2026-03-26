import DashboardHomePageAdminTask from "@/components/DashboardHomePageAdminTasks"
import { SUPER_ADMIN_TASKS } from "@/constants/tasks"

// import { BookUser, Building2, ChartNoAxesCombined, LocateFixed, Road, Settings, Siren, Store, Truck, Warehouse } from "lucide-react";


// export const SUPER_ADMIN_TASKS = [
//   { key: "companies", label: "Manage Brands", icon: <Building2 size={35} color="white"strokeWidth={1}/>, bg: "bg-pink-700 shadow-lg shadow-pink-500/40", path: "/admin/companies" },
//   { key: "users", label: "Manage Users", icon: <BookUser size={35} color="white"strokeWidth={1}/>, bg: "bg-sky-700 shadow-lg shadow-sky-700/40", path: "/admin/users" },
//   { key: "devices", label: "Register GPS Devices", icon: <LocateFixed size={35} color="white"strokeWidth={1}/>, bg: "bg-teal-700 shadow-lg shadow-teal-700/40", path: "/admin/devices" },
//   { key: "trucks", label: "Manage Trucks", icon: <Truck size={35} color="white"strokeWidth={1}/>, bg: "bg-violet-600 shadow-lg shadow-violet-600/40", path: "/admin/trucks" },
//   { key: "dcs", label: "Manage Warehouses", icon: <Warehouse size={35} color="white"strokeWidth={1}/>, bg: "bg-amber-700 shadow-lg shadow-amber-700/40", path: "/admin/dcs" },
//   { key: "stores", label: "Manage Stores", icon: <Store size={35} color="white"strokeWidth={1}/>, bg: "bg-cyan-700 shadow-lg shadow-cyan-700/40", path: "/admin/stores" },
//   { key: "trips", label: "View Trips", icon: <Road size={35} color="white"strokeWidth={1}/>, bg: "bg-slate-800 shadow-lg shadow-slate-800/40", path: "/admin/trips" },
//   { key: "alerts", label: "Alerts", icon: <Siren size={35} color="white"strokeWidth={1}/>, bg: "bg-red-800 shadow-lg shadow-red-800/40", path: "/admin/alerts" },
//   { key: "analytics", label: "Analytics", icon: <ChartNoAxesCombined strokeWidth={1} size={35} color="white"/>, bg: "bg-yellow-700 shadow-lg shadow-yellow-700/40", path: "/admin/analytics" },
//   { key: "settings", label: "Settings", icon: <Settings size={35} color="white" strokeWidth={1}/>,  bg: "bg-green-500 shadow-lg shadow-green-500/40", path: "/admin/settings" },
// ];


export default function SuperAdminHome() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#701a40] to-[#5a1430] p-6">

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-light text-white">
          Welcome to dashboard!.
        </h1>
        <p className="text-white/70 mt-2">
          Manage platform, brands, warehouses, and devices
        </p>
      </div>

      {/* Super Admin Task In Card Grid */}
      <DashboardHomePageAdminTask tasks={SUPER_ADMIN_TASKS}/>
    </div>
  )
}