// dc-table/columns.jsx (Optimized)
import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MapPin, Pencil, Eye } from "lucide-react"
import DCDetailDrawer from "../DcDetailDrawer"
import DeleteModal from "@/components/DeleteModal"
import { useDeleteDcMutation } from "@/lib/features/dcs/dcApi"
import { toast } from "sonner"

const STATUS_STYLES = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
}

function ActionsCell({ row, table }) {
    const dc = row.original
    const { setEditDc, setEditOpen, setViewDc, setViewOpen } = table.options.meta || {}

    const [deleteDC, { isLoading: isDeleting }] = useDeleteDcMutation()

    const handleDelete = async () => {
        try {
            await deleteDC(dc.id).unwrap()
        } catch (err) {
            console.error("Failed to delete DC", err)
        }
    }

    return (
        <>
            

            <div className="flex items-center gap-2 justify-end">
                <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                    setViewDc?.(dc)
                    setViewOpen?.(true)
                }} 
                    className="hover:bg-maroon cursor-pointer text-blue-800 hover:text-white"
                >
                    <Eye size={16} />
                </Button>

                <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                        setEditDc?.(dc)
                        setEditOpen?.(true)
                    }}
                    className="hover:bg-maroon cursor-pointer hover:text-white"
                >
                    <Pencil size={16} />
                </Button>

                <DeleteModal
                    who={dc.dc_name}
                    m1active="No new trips can be dispatched from this DC"
                    onConfirm={handleDelete}
                    isLoading={isDeleting}
                />
            </div>
        </>
    )
}

export const columns = [
    {
        accessorKey: "name",
        header: "Data center",
        cell: ({ row }) => {
            const { dc_name, address } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="font-semibold text-sm capitalize">{dc_name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 max-w-96 text-wrap">
                        <MapPin size={10} className="shrink-0" /> {address}
                    </p>
                </div>
            )
        },
    },
    {
        accessorKey: "contactName",
        header: "DC operator",
        cell: ({ row }) => {
            const { dc_manager_name, dc_manager_phone } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">{dc_manager_name || "—"}</p>
                    {dc_manager_phone && (
                        <p className="text-xs text-gray-400">{dc_manager_phone}</p>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "activeTrips",
        header: "Trips",
        cell: ({ row }) => {
            const { active_trips = 0, total_trips = 0 } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">{active_trips} active</p>
                    <p className="text-xs text-gray-400">{total_trips} total</p>
                </div>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: "Since",
        cell: ({ row }) => {
            const createdAt = row.getValue("created_at")
            return (
                <span className="text-sm text-gray-500">
                    {createdAt ? format(parseISO(createdAt), 'MMM yyyy') : "—"}
                </span>
            )
        }
    },
    {
        accessorKey: "status",
        header: ({ column, table }) => {
            const current = column.getFilterValue() || "all"
            return (
                <div className="flex items-center gap-2">
                    <span>Status</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-14 text-[10px]">
                                {current === "all" 
                                    ? "All" 
                                    : current.charAt(0).toUpperCase() + current.slice(1)}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-32 bg-white border shadow-md">
                            <DropdownMenuRadioGroup
                                value={current}
                                onValueChange={(val) => {
                                    column.setFilterValue(val === "all" ? undefined : val)
                                    table.options.meta?.updatePage?.(1)
                                }}
                            >
                                <DropdownMenuRadioItem value="all" className="text-xs">
                                    All
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="active" className="text-xs">
                                    Active
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
            const status = row.original.status
            return (
                <Badge className={`${STATUS_STYLES[status]} border-0 text-xs font-medium`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            )
        },
        filterFn: (row, id, value) => !value || row.getValue(id) === value,
    },
    {
        id: "actions",
        cell: ({ row, table }) => <ActionsCell row={row} table={table} />,
    },
]