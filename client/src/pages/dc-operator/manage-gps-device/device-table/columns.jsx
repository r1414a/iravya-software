import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldLabel } from "@/components/ui/field"
import {
    MoreHorizontal,
    Pencil,
    Truck,
    Trash2,
    RefreshCw,
    ChevronRight,
} from "lucide-react"

// ── Status config ─────────────────────────────────────────────────────────────
const statusStyles = {
    online:     "bg-green-100 text-green-700",
    offline:    "bg-gray-100 text-gray-500",
    warning:    "bg-amber-100 text-amber-700",
    unassigned: "bg-purple-100 text-purple-700",
}
const statusLabels = {
    online:     "Online",
    offline:    "Offline",
    warning:    "Warning",
    unassigned: "Unassigned",
}

// ── Signal bars — same visual style as TruckDetailDrawer ●○ ──────────────────
function SignalBars({ strength }) {
    const color =
        strength > 60 ? "bg-green-500"
        : strength > 30 ? "bg-amber-500"
        : "bg-gray-300"

    return (
        <div className="flex items-end gap-0.5 h-4">
            {[25, 50, 75, 100].map((threshold, i) => (
                <div
                    key={i}
                    className={`w-1 rounded-sm ${strength >= threshold ? color : "bg-gray-200"}`}
                    style={{ height: `${(i + 1) * 4 + 4}px` }}
                />
            ))}
            <span className={`ml-1 text-xs ${strength === 0 ? "text-gray-400" : "text-gray-600"}`}>
                {strength > 0 ? `${strength}%` : "—"}
            </span>
        </div>
    )
}

// ── Battery bar ───────────────────────────────────────────────────────────────
function BatteryBar({ level }) {
    const color =
        level > 40 ? "bg-green-500"
        : level > 15 ? "bg-amber-500"
        : "bg-red-500"

    return (
        <div className="flex items-center gap-1.5">
            <div className="relative flex items-center w-6 h-3 border border-gray-400 rounded-sm">
                <div
                    className={`h-full rounded-sm ${color}`}
                    style={{ width: `${level}%` }}
                />
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-gray-400 rounded-r-sm" />
            </div>
            <span className={`text-xs ${level <= 15 ? "text-red-600 font-medium" : "text-gray-600"}`}>
                {level}%
            </span>
        </div>
    )
}

export const columns = [
    // Device ID + IMEI
    {
        accessorKey: "deviceId",
        header: "Device",
        cell: ({ row }) => {
            const { deviceId, imei, firmware } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="font-semibold text-sm font-mono">{deviceId}</p>
                    <p className="text-xs text-gray-400 font-mono">{imei}</p>
                    <p className="text-[10px] text-gray-300">{firmware}</p>
                </div>
            )
        },
    },

    // Assigned truck — column header has "Unassigned only" checkbox filter
    {
        accessorKey: "assignedTruck",
        header: ({ column }) => {
            const isChecked = column.getFilterValue() === "unassigned"
            return (
                <div className="flex items-center gap-2">
                    <span>Truck</span>
                    <Checkbox
                        id="unassigned-only"
                        className="w-3 h-3 rounded-xs -mr-1 border border-gray-500"
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                            column.setFilterValue(checked ? "unassigned" : undefined)
                        }
                    />
                    <FieldLabel htmlFor="unassigned-only" className="text-xs">
                        Unassigned only
                    </FieldLabel>
                </div>
            )
        },
        cell: ({ row }) => {
            const { assignedTruck } = row.original
            return assignedTruck ? (
                <div className="flex items-center gap-1.5 text-sm">
                    <Truck size={13} className="text-gray-400" />
                    <span className="font-mono">{assignedTruck}</span>
                </div>
            ) : (
                <span className="text-xs text-gray-400 italic">Not assigned</span>
            )
        },
        filterFn: (row, id, value) => {
            if (!value) return true
            return !row.getValue(id) // show only rows with no truck
        },
    },

    // Signal strength
    {
        accessorKey: "signalStrength",
        header: "Signal",
        cell: ({ row }) => <SignalBars strength={row.original.signalStrength} />,
    },

    // Battery
    {
        accessorKey: "battery",
        header: "Battery",
        cell: ({ row }) => <BatteryBar level={row.original.battery} />,
    },

    // Last ping
    {
        accessorKey: "lastPing",
        header: "Last ping",
        cell: ({ row }) => (
            <div className="-space-y-0.5">
                <p className="text-sm">{row.original.lastPing}</p>
                <p className="text-xs text-gray-400">{row.original.lastPingDate}</p>
            </div>
        ),
    },

    // Status — column header has radio filter dropdown (same as trucks status column)
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
                                onValueChange={(val) =>
                                    column.setFilterValue(val === "all" ? undefined : val)
                                }
                            >
                                {["all", "online", "offline", "warning", "unassigned"].map((v) => (
                                    <DropdownMenuRadioItem key={v} value={v} className="text-xs capitalize">
                                        {v === "all" ? "All" : statusLabels[v]}
                                    </DropdownMenuRadioItem>
                                ))}
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

    // Actions — unassigned devices get an "Assign" quick button (mirrors idle truck "Dispatch")
    {
        id: "actions",
        cell: ({ row }) => {
            const { status, assignedTruck } = row.original
            return (
                <div className="flex items-center gap-2 justify-end">
                    {/* Assign now — only for unassigned devices */}
                    {/* {status === "unassigned" && (
                        <Button
                            size="sm"
                            className="bg-[#701a40] text-white h-7 px-3 text-xs flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Truck size={12} />
                            Assign
                        </Button>
                    )} */}

                    <DropdownMenu>
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
                        <DropdownMenuContent align="end" className="bg-white border shadow-md w-44">
                            <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                                <Pencil size={14} /> Edit device
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                                <Truck size={14} />
                                {assignedTruck ? "Reassign truck" : "Assign to truck"}
                            </DropdownMenuItem> */}
                            <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                                <RefreshCw size={14} /> Force re-ping
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-sm cursor-pointer text-red-500">
                                <Trash2 size={14} /> Decommission
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ChevronRight size={16} className="text-gray-300" />
                </div>
            )
        },
    },
]