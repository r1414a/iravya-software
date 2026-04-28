import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuRadioItem,
    DropdownMenuRadioGroup
} from "@/components/ui/dropdown-menu"
import { format, formatDistanceToNow, parseISO } from "date-fns"
import { REPORTING_ISSUES } from "@/constants/constant"


// 🎨 Issue Type Styles
const issueStyles = {
    route_issue: "bg-yellow-100 text-yellow-700",
    unable_to_reach_driver: "bg-red-100 text-red-700",
    unable_to_reach_dc_operator: "bg-orange-100 text-orange-700",
    wrong_delivery_location: "bg-purple-100 text-purple-700",
}

// 🏷️ Label mapping (important)
const issueLabels = {
    route_issue: "Route Issue",
    unable_to_reach_driver: "Can't reach driver",
    unable_to_reach_dc_operator: "Can't reach DC",
    wrong_delivery_location: "Wrong location",
}

// 👤 Reporter styles
const reporterStyles = {
    driver: "bg-blue-100 text-blue-700",
    store: "bg-green-100 text-green-700",
}

// 🔧 Actions
function ActionsCell({ row }) {
    const issue = row.original

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border shadow-md w-36">
                <DropdownMenuItem className="text-sm cursor-pointer">
                    View details
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns = [

    // 🏷️ Issue Type
    {
        accessorKey: "issue_type",
        header: ({ column }) => {
            const currentValue = column.getFilterValue() || "all"

            return (
                <div className="flex items-center gap-2">
                    <span>Issue</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-18 text-[10px]">
                                {currentValue === "all"
                                    ? "All issues"
                                    : REPORTING_ISSUES[currentValue].label}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-36 bg-white border shadow-md">
                            <DropdownMenuRadioGroup
                                value={currentValue}
                                onValueChange={(value) => {
                                    column.setFilterValue(
                                        value === "all" ? undefined : value
                                    )
                                }}
                            >
                                <DropdownMenuRadioItem value="all" className="text-xs">
                                    All issues
                                </DropdownMenuRadioItem>
                                {
                                    Object.entries(REPORTING_ISSUES).map(([k, v]) => (
                                        <DropdownMenuRadioItem value={k} className="text-xs">
                                            {v.label}
                                        </DropdownMenuRadioItem>
                                    ))
                                }


                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    
                </div>
            )
        },
        cell: ({ row }) => {
            const type = row.original.issue_type

            return (
                <Badge className={`${issueStyles[type]} border-0 text-xs`}>
                    {issueLabels[type] || type}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue(id) === value
        },
    },

    // 👤 Reported By
    {
        accessorKey: "reported_by",
        header: ({ column }) => {
            const currentValue = column.getFilterValue() || "all"

            return (
                <div className="flex items-center gap-2">
                    <span>Reported By</span>

                  
                </div>
            )
        },
        cell: ({ row }) => {
            const isDriver = row.original.is_complaintby_driver

            const label = isDriver ? "Driver" : "Store"

            return (
                <Badge className={`${reporterStyles[isDriver ? "driver" : "store"]} border-0 text-xs`}>
                    {label}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            if (!value) return true

            const isDriver = row.original.is_complaintby_driver

            return value === "driver" ? isDriver : !isDriver
        },
    },

    // 🚚 Trip Info
    {
        accessorKey: "trip_tracking_code",
        header: "Trip",
        cell: ({ row }) => {
            const { trip_tracking_code, truck_no } = row.original

            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">{trip_tracking_code}</p>
                    <p className="text-xs text-gray-400">{truck_no}</p>
                </div>
            )
        },
    },

    // 🏬 Store / DC
    {
        accessorKey: "store_name",
        header: "Location",
        cell: ({ row }) => {
            const { store_name, dc_name } = row.original

            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">
                        {store_name || "—"}
                    </p>
                    <p className="text-xs text-gray-400">
                        {dc_name}
                    </p>
                </div>
            )
        },
    },

    // 📦 Complaint
    {
        accessorKey: "complaint",
        header: "Complaint",
        cell: ({ row }) => (
            <p className="text-sm text-gray-600 text-wrap max-w-90">
                {row.original.complaint || "—"}
            </p>
        ),
    },

    // ⏱️ Created At
    {
        accessorKey: "created_at",
        header: "Reported At",
        cell: ({ row }) => {
            const { created_at } = row.original

            return (
                <span className="text-sm text-gray-500">
                     {/* <p className="text-sm">{formatDistanceToNow(parseISO(last_trip), { addSuffix: true })}</p> */}
                    {created_at
                        ? formatDistanceToNow(parseISO(created_at), { addSuffix: true })
                        : "-"}
                </span>
            )
        },
    },

    // 🚀 Actions
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell row={row} />,
    },
]