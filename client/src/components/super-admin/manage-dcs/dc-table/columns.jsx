import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    MoreHorizontal,
    Pencil,
    Ban,
    Truck,
    Users,
    MapPin,
    ChevronRight,
    LocateFixed,
    Trash2,
    Eye
} from "lucide-react"
import { useState } from "react"
import DCDetailDrawer from "../DcDetailDrawer"

const statusStyles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
}

const BRANDS = ["Tata Westside", "Zudio", "Tata Cliq", "Tanishq"]

function ActionsCell({ row }) {
    const dc = row.original;
    const [viewDetails, setViewDetails] = useState(false);
    return (
        <>
            <DCDetailDrawer
                dc={dc}
                open={viewDetails}
                onClose={() => setViewDetails(false)}
            />
        
        <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" size="xs" onClick={() => setViewDetails(true)} className="hover:bg-maroon cursor-pointer text-blue-800 hover:text-white"><Eye size={16}/></Button>
            <Button variant="outline" size="xs" className="hover:bg-maroon cursor-pointer hover:text-white"><Pencil size={16} /></Button>

            <Button variant="outline" size="xs" className="hover:bg-maroon cursor-pointer text-red-600 hover:text-white"><Trash2 size={16} /></Button>
            {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreHorizontal size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="bg-white border shadow-md w-44"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                        <Pencil size={14} /> Edit DC details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className={`gap-2 text-sm cursor-pointer ${dc.status === "active" ? "text-red-500" : "text-green-600"}`}>
                        <Ban size={14} />
                        {dc.status === "active" ? "Deactivate DC" : "Reactivate DC"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ChevronRight size={16} className="text-gray-300" /> */}
        </div>
        </>
    )
}



export const columns = [
    // DC name + city + address
    {
        accessorKey: "name",
        header: "Data center",
        cell: ({ row }) => {
            const { name, city, address } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="font-semibold text-sm">{name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={10} /> {city}
                    </p>
                </div>
            )
        },
    },

    // Brand — column header has radio filter dropdown
    {
        accessorKey: "brand",
        header: ({ column }) => {
            const current = column.getFilterValue() || "all"
            return (
                <div className="flex items-center gap-2">
                    <span>Brand</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-18 text-[10px]">
                                {current === "all" ? "All" : current.split(" ")[1] ?? current}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 bg-white border shadow-md">
                            <DropdownMenuRadioGroup
                                value={current}
                                onValueChange={(val) =>
                                    column.setFilterValue(val === "all" ? undefined : val)
                                }
                            >
                                <DropdownMenuRadioItem value="all" className="text-xs">All brands</DropdownMenuRadioItem>
                                {BRANDS.map((b) => (
                                    <DropdownMenuRadioItem key={b} value={b} className="text-xs">{b}</DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        cell: ({ row }) => (
            <span className="text-sm text-gray-700">{row.getValue("brand")}</span>
        ),
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue(id) === value
        },
    },

    // Contact person
    {
        accessorKey: "contactName",
        header: "DC operator",
        cell: ({ row }) => {
            const { contactName, contactPhone } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">{contactName}</p>
                    <p className="text-xs text-gray-400">{contactPhone}</p>
                </div>
            )
        },
    },

    // Fleet stats — trucks + drivers + devices in one cell
    {
        accessorKey: "totalTrucks",
        header: "Fleet",
        cell: ({ row }) => {
            const { totalTrucks, activeTrucks, totalDrivers, totalDevices, devicesAvailable } = row.original
            return (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Truck size={11} className="text-gray-400" />
                        <span>{activeTrucks}/{totalTrucks} trucks active</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Users size={11} className="text-gray-400" />
                        <span>{totalDrivers} drivers</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <LocateFixed size={11} className="text-gray-400" />
                        <span>{devicesAvailable}/{totalDevices} devices available</span>
                    </div>
                </div>
            )
        },
    },

    // Trips
    {
        accessorKey: "activeTrips",
        header: "Trips",
        cell: ({ row }) => {
            const { activeTrips, totalTrips } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">{activeTrips} active</p>
                    <p className="text-xs text-gray-400">{totalTrips} total</p>
                </div>
            )
        },
    },

    // Since
    {
        accessorKey: "createdAt",
        header: "Since",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">{row.getValue("createdAt")}</span>
        ),
    },

    // Status — radio filter in header
    {
        accessorKey: "status",
        header: ({ column }) => {
            const current = column.getFilterValue() || "all"
            return (
                <div className="flex items-center gap-2">
                    <span>Status</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-14 text-[10px]">
                                {current === "all" ? "All" : current.charAt(0).toUpperCase() + current.slice(1)}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-32 bg-white border shadow-md">
                            <DropdownMenuRadioGroup
                                value={current}
                                onValueChange={(val) =>
                                    column.setFilterValue(val === "all" ? undefined : val)
                                }
                            >
                                <DropdownMenuRadioItem value="all" className="text-xs">All</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="active" className="text-xs">Active</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="inactive" className="text-xs">Inactive</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        cell: ({ row }) => {
            const s = row.original.status
            return (
                <Badge className={`${statusStyles[s]} border-0 text-xs font-medium`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue(id) === value
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell row={row} />,
    },
]