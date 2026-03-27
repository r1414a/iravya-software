import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Truck, KeyRound, Ban, Filter } from "lucide-react"
import EditDriverSheet from "./EditDriverSheet"
import AssignTruckSheet from "./AssignTruckSheet"
import TripHistorySheet from "./TripHistorySheet"
import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Colour map for avatar initials — same ua-* palette as users


// Status badge styles
const statusStyles = {
    available: "bg-green-100 text-green-700",
    on_trip: "bg-blue-100 text-blue-700",
    inactive: "bg-gray-100 text-gray-500",
}


function ActionsCell({ row }) {
    const driver = row.original
    const [editOpen, setEditOpen] = useState(false)
    const [assignOpen, setAssignOpen] = useState(false)
    const [historyOpen, setHistoryOpen] = useState(false)

    return (
        <>
            <EditDriverSheet
                driver={driver}
                open={editOpen}
                onClose={() => setEditOpen(false)}
            />
            <AssignTruckSheet
                driver={driver}
                open={assignOpen}
                onClose={() => setAssignOpen(false)}
            />
            <TripHistorySheet
                driver={driver}
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border shadow-md w-40">
                    <DropdownMenuItem
                        className="gap-2 text-sm cursor-pointer"
                        onClick={() => setEditOpen(true)}
                    >
                        <Pencil size={14} /> Edit driver
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="gap-2 text-sm cursor-pointer"
                        onClick={() => setAssignOpen(true)}
                    >
                        <Truck size={14} /> Assign truck
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="gap-2 text-sm cursor-pointer"
                        onClick={() => setHistoryOpen(true)}
                    >
                        <KeyRound size={14} /> View trip history
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-sm cursor-pointer text-red-500">
                        <Ban size={14} /> Deactivate
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
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
        accessorKey: "licenceClass",
        header: ({ column }) => {
            const currentValue = column.getFilterValue() || "all"
            return (
                <div className="flex items-center gap-2">
                    <span>Licence</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-6 min-w-18 text-[10px]">
                            {currentValue === "all"
                                ? "All classes"
                                :  currentValue.toUpperCase() }
                        </Button>
                            {/* <Filter size={16} fill="#701a40" stroke=" #701a40" /> */}
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
                                    All classes
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="lmv" className="text-xs">
                                    LMV
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="hmv" className="text-xs">
                                    HMV
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="hgmv" className="text-xs">
                                    HGMV
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="htv" className="text-xs">
                                    HTV
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        cell: ({ row }) => (
            <div className="-space-y-0.5">
                <p className="text-sm font-mono">{row.original.licenceNo}</p>
                <p className="text-xs text-gray-400">{row.original.licenceClass} · Exp {row.original.licenceExpiry}</p>
            </div>
        ),
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue(id)?.toLowerCase() === value.toLowerCase()
        }
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
    {
        accessorKey: "since",
        header: "Since",
        cell: ({ row }) => <span className="text-sm text-gray-500">{row.original.since}</span>,
    },
    // Status
    {
        accessorKey: "status",
        header: ({ column }) => {
            const currentValue = column.getFilterValue() || "all"
            return (
                <div className="flex items-center gap-2">
                    <span>Status</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-18 text-[10px]">
                            {currentValue === "all"
                                ? "All"
                                : currentValue === "on_trip"
                                ? "On trip"
                                : currentValue.charAt(0).toUpperCase() + currentValue.slice(1)}
                        </Button>
                            {/* <Filter size={16} fill="#701a40" stroke=" #701a40" /> */}
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
                                    All
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="available" className="text-xs">
                                    Available
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="on_trip" className="text-xs">
                                    On trip
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="inactive" className="text-xs">
                                    Inactive
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        cell: ({ row }) => {
            const s = row.original.status
            const label = s === "on_trip" ? "On trip" : s.charAt(0).toUpperCase() + s.slice(1)
            return (
                <Badge className={`${statusStyles[s]} border-0 text-xs font-medium`}>
                    {label}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue(id) === value
        }
    },
    // Actions
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell row={row} />,
    },
]