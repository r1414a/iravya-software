import { ArrowLeft, User, Lock, Bell, Settings2, AlertTriangle } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import { ProfileSection } from "@/components/super-admin/settings/ProfileSection"
import { PasswordSection } from "@/components/super-admin/settings/PasswordSection"
import { NotificationsSection } from "@/components/super-admin/settings/NotificationSection"
import { PlatformSection } from "@/components/super-admin/settings/PlatformSection"
import { DangerSection } from "@/components/super-admin/settings/DangerSection"
 
const NAV_ITEMS = [
    { key: "profile",       label: "Profile",           icon: User          },
    { key: "password",      label: "Password",          icon: Lock          },
    { key: "notifications", label: "Notifications",     icon: Bell          },
    { key: "platform",      label: "Platform settings", icon: Settings2     },
    { key: "danger",        label: "Danger zone",       icon: AlertTriangle },
]
 
const SECTION_MAP = {
    profile:       <ProfileSection />,
    password:      <PasswordSection />,
    notifications: <NotificationsSection />,
    platform:      <PlatformSection />,
    danger:        <DangerSection />,
}
 
export default function SuperAdminSettings() {
    const [active, setActive] = useState("profile")
 
    return (
        <section>
            {/* Same header pattern as ManageDCs, ManageStores */}
            <div className="h-18 px-10 flex gap-4 items-center shadow-md">
                <Link to={'/admin'} className="bg-gold hover:bg-gold-dark p-2 rounded-full">
                    <ArrowLeft size={18} className="text-maroon" />
                </Link>
                <div className="-space-y-1">
                    <h1 className="text-lg">Settings</h1>
                    <p className="text-sm text-gray-500">
                        Manage your account, platform config and notification preferences
                    </p>
                </div>
            </div>
 
            {/* Two-column layout */}
            <div className="flex gap-0 mt-8 px-10">
 
                {/* Sidebar nav */}
                <aside className="w-56 shrink-0 mr-8">
                    <nav className="flex flex-col gap-1">
                        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
                            const isDanger  = key === "danger"
                            const isActive  = active === key
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActive(key)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left w-full transition-colors
                                        ${isDanger ? "mt-4" : ""}
                                        ${isActive && !isDanger ? "bg-maroon text-white font-medium" : ""}
                                        ${isActive && isDanger  ? "bg-red-600 text-white border border-red-600" : ""}
                                        ${!isActive && !isDanger ? "text-gray-600 hover:bg-gray-100" : ""}
                                        ${!isActive && isDanger  ? "text-red-500 border border-red-200 hover:bg-red-50" : ""}
                                    `}
                                >
                                    <Icon size={15} className="shrink-0" />
                                    {label}
                                </button>
                            )
                        })}
                    </nav>
                </aside>
 
                {/* Content */}
                <main className="flex-1 max-w-2xl pb-16">
                    {SECTION_MAP[active]}
                </main>
 
            </div>
        </section>
    )
}