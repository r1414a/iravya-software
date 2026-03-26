import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Truck, KeyRound, Ban } from "lucide-react"
 
// Colour map for avatar initials — same ua-* palette as users
const avatarColors = {
    "ua-teal":   "bg-teal-100 text-teal-700",
    "ua-purple": "bg-purple-100 text-purple-700",
    "ua-coral":  "bg-red-100 text-red-600",
    "ua-green":  "bg-green-100 text-green-700",
    "ua-amber":  "bg-amber-100 text-amber-700",
}
 
// Status badge styles
const statusStyles = {
    available: "bg-green-100 text-green-700",
    on_trip:   "bg-blue-100 text-blue-700",
    inactive:  "bg-gray-100 text-gray-500",
}
 
export const columns = [
    // Driver avatar + name + contact
    {
        accessorKey: "name",
        header: "Driver",
        cell: ({ row }) => {
            const { initials, color, name, phone, email } = row.original
            return (
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold p-1 bg-gold text-white`}>
                        {initials}
                    </div>
                    <div className="-space-y-0.5">
                        <p className="font-medium text-sm">{name}</p>
                        <p className="text-xs text-gray-400">{phone}</p>
                    </div>
                </div>
            )
        },
    },
    // Licence number + class
    {
        accessorKey: "licence",
        header: "Licence",
        cell: ({ row }) => (
            <div className="-space-y-0.5">
                <p className="text-sm font-mono">{row.original.licenceNo}</p>
                <p className="text-xs text-gray-400">{row.original.licenceClass} · Exp {row.original.licenceExpiry}</p>
            </div>
        ),
    },
    // Assigned truck (or "—")
    {
        accessorKey: "truck",
        header: "Assigned truck",
        cell: ({ row }) => {
            const truck = row.original.assignedTruck
            return truck ? (
                <div className="flex items-center gap-1.5 text-sm">
                    <Truck size={14} className="text-gray-400" />
                    <span>{truck}</span>
                </div>
            ) : (
                <span className="text-gray-400 text-sm">—</span>
            )
        },
    },
    // Total trips + this month
    {
        accessorKey: "trips",
        header: "Trips",
        cell: ({ row }) => (
            <div className="-space-y-0.5">
                <p className="text-sm font-medium">{row.original.totalTrips} total</p>
                <p className="text-xs text-gray-400">{row.original.tripsThisMonth} this month</p>
            </div>
        ),
    },
    // Last active
    // {
    //     accessorKey: "lastActive",
    //     header: "Last active",
    //     cell: ({ row }) => (
    //         <div className="-space-y-0.5">
    //             <p className="text-sm">{row.original.lastActive}</p>
    //             <p className="text-xs text-gray-400">{row.original.lastActiveDate}</p>
    //         </div>
    //     ),
    // },
    // Since (joined)
    {
        accessorKey: "since",
        header: "Since",
        cell: ({ row }) => <span className="text-sm text-gray-500">{row.original.since}</span>,
    },
    // Status
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const s = row.original.status
            const label = s === "on_trip" ? "On trip" : s.charAt(0).toUpperCase() + s.slice(1)
            return (
                <Badge className={`${statusStyles[s]} border-0 text-xs font-medium`}>
                    {label}
                </Badge>
            )
        },
    },
    // Actions
    {
        id: "actions",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border shadow-md">
                    <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                        <Pencil size={14} /> Edit driver
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                        <Truck size={14} /> Assign truck
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                        <KeyRound size={14} /> View trip history
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-sm cursor-pointer text-red-500">
                        <Ban size={14} /> Deactivate
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]