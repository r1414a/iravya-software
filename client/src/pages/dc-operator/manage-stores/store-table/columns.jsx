import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    MoreHorizontal,
    Pencil,
    Eye,
    Trash2,
    RefreshCw,
    ChevronRight,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ── Status styles ──────────────────────────────────────────────────────────
const statusStyles = {
    active:   "bg-green-100 text-green-700",
    inactive: "bg-red-100 text-red-700",
    pending:  "bg-amber-100 text-amber-700",
}

const statusLabels = {
    active:   "Active",
    inactive: "Inactive",
    pending:  "Pending",
}

// ── Avatar colour by store name initial ────────────────────────────────────
const avatarPalette = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-amber-100 text-amber-700",
    "bg-pink-100 text-pink-700",
    "bg-violet-100 text-violet-700",
]

function getAvatarClass(name = "") {
    return avatarPalette[name.charCodeAt(0) % avatarPalette.length]
}

function getInitials(name = "") {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
}

// ── Column definitions ─────────────────────────────────────────────────────
export const columns = [
    // Store name + ID
    {
        accessorKey: "name",
        header: "Store",
        cell: ({ row }) => {
            const { name, id } = row.original
            return (
                <div className="flex items-center gap-3">
                    <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarClass(name)}`}
                    >
                        {getInitials(name)}
                    </div>
                    <div className="-space-y-0.5">
                        <p className="font-semibold text-sm">{name}</p>
                        <p className="text-xs text-gray-400 font-mono">{id}</p>
                    </div>
                </div>
            )
        },
    },

    // Address + pincode
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => {
            const { address, pin } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="text-sm">{address}</p>
                    <p className="text-xs text-gray-400 font-mono">{pin}</p>
                </div>
            )
        },
    },

    // City + State with dropdown filter
    {
        accessorKey: "state",
        header: ({ column, table }) => {
            const currentValue = column.getFilterValue() || "all"

            // Collect unique states from all rows for the dropdown
            const allStates = [
                ...new Set(
                    table
                        .getCoreRowModel()
                        .rows.map((r) => r.original.state)
                ),
            ].sort()

            return (
                <div className="flex items-center gap-2">
                    <span>City / State</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-20 text-[10px]">
                                {currentValue === "all" ? "All States" : currentValue}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 bg-white border shadow-md">
                            <DropdownMenuRadioGroup
                                value={currentValue}
                                onValueChange={(value) =>
                                    column.setFilterValue(value === "all" ? undefined : value)
                                }
                            >
                                <DropdownMenuRadioItem value="all" className="text-xs">
                                    All States
                                </DropdownMenuRadioItem>
                                {allStates.map((state) => (
                                    <DropdownMenuRadioItem key={state} value={state} className="text-xs">
                                        {state}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        cell: ({ row }) => {
            const { city, state } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">{city}</p>
                    <p className="text-xs text-gray-400">{state}</p>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue(id) === value
        },
    },

    // Manager name + phone
    {
        accessorKey: "manager",
        header: "Contact",
        cell: ({ row }) => {
            const { manager, phone } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">{manager}</p>
                    <p className="text-xs text-gray-400 font-mono">{phone}</p>
                </div>
            )
        },
    },

    // Status badge with dropdown filter
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
                                {currentValue === "all" ? "All" : statusLabels[currentValue]}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-36 bg-white border shadow-md">
                            <DropdownMenuRadioGroup
                                value={currentValue}
                                onValueChange={(value) =>
                                    column.setFilterValue(value === "all" ? undefined : value)
                                }
                            >
                                <DropdownMenuRadioItem value="all"      className="text-xs">All</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="active"   className="text-xs">Active</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="inactive" className="text-xs">Inactive</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="pending"  className="text-xs">Pending</DropdownMenuRadioItem>
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
                    {statusLabels[s]}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue(id) === value
        },
    },

    // Actions
    {
        id: "actions",
        cell: ({ row }) => {
            const store = row.original
            return (
                <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                    {/* Quick edit button */}
                    <Button
                        size="sm"
                        className=" text-white h-7 px-3 text-xs flex items-center gap-1 bg-white"
                        onClick={(e) => {
                            e.stopPropagation()
                            store._onEdit?.(store)
                        }}
                    >
                        <Pencil size={12} color="gray"/>
                        
                    </Button>

                    


                    <Button
                        size="sm"
                        className=" text-white h-7 px-3 text-xs flex items-center gap-1 bg-white"
                        onClick={() => store._onDelete?.(store)}
                    >
                        <Trash2 size={12} color="gray"/>
                        
                    </Button>

                    {/* 3-dot menu */}
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border shadow-md w-44">
                            <DropdownMenuItem
                                className="gap-2 text-sm cursor-pointer"
                                onClick={() => store._onView?.(store)}
                            >
                                <Eye size={14} /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="gap-2 text-sm cursor-pointer"
                                onClick={() => store._onEdit?.(store)}
                            >
                                <Pencil size={14} /> Edit Store
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="gap-2 text-sm cursor-pointer"
                                onClick={() => store._onToggleStatus?.(store)}
                            >
                                <RefreshCw size={14} /> Toggle Status
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="gap-2 text-sm cursor-pointer text-red-600 focus:text-red-600"
                                onClick={() => store._onDelete?.(store)}
                            >
                                <Trash2 size={14} /> Delete Store
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}

                    <ChevronRight size={16} className="text-gray-300" />
                </div>
            )
        },
    },
]