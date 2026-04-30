
// store-table/columns.jsx (Optimized)
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
import DeleteModal from "@/components/DeleteModal"
import { useDeleteStoreMutation } from "@/lib/features/stores/storeApi"
import { useLocation } from "react-router-dom"
import { toast } from "sonner"

const STATUS_STYLES = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
}

const CITIES = ["Pune", "Mumbai", "Nashik", "Nagpur", "Kolhapur", "Amravati"]

function ActionsCell({ row, table }) {
    const store = row.original
    const { pathname } = useLocation()
    const { setEditStore, setEditOpen, setViewStore, setViewOpen } = table.options.meta || {}
    
    const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation()

    const handleDelete = async () => {
        try {
            await deleteStore(store.id).unwrap()
        } catch (err) {
            console.error("Failed to delete store", err);
            
        }
    }

    return (
        <div className="flex items-center gap-2 justify-end">
            <Button 
                variant="outline" 
                size="xs" 
                onClick={() => {
                    setViewStore?.(store)
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
                    setEditStore?.(store)
                    setEditOpen?.(true)
                }} 
                className="hover:bg-maroon cursor-pointer hover:text-white"
            >
                <Pencil size={16} />
            </Button>

            {pathname.startsWith('/admin') && (
                <DeleteModal
                    who={store.name}
                    m1active="Store will no longer be available for trip scheduling or fleet tracking."
                    onConfirm={handleDelete}
                    isLoading={isDeleting}
                />
            )}
        </div>
    )
}

export const columns = [
    {
        accessorKey: "name",
        header: "Store",
        cell: ({ row }) => {
            const { name, address } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="font-semibold text-sm capitalize">{name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 max-w-72 text-wrap">
                        <MapPin size={10} className="shrink-0" />
                        {address}
                    </p>
                </div>
            )
        },
    },
    {
        accessorKey: "brand_name",
        header: ({ column, table }) => {
            const current = column.getFilterValue() || "all"
            const brands = table.options.meta?.brands || []

            return (
                <div className="flex items-center gap-2">
                    <span>Brand</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-18 text-[10px]">
                                {current === "all" 
                                    ? "All" 
                                    : brands.find(b => String(b.id) === current)?.name || "Select"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 bg-white border shadow-md">
                            <DropdownMenuRadioGroup
                                value={current}
                                onValueChange={(val) => {
                                    column.setFilterValue(val === "all" ? undefined : val)
                                    table.options.meta?.updatePage?.(1)
                                }}
                            >
                                <DropdownMenuRadioItem value="all" className="text-xs">
                                    All brands
                                </DropdownMenuRadioItem>
                                {brands.map((b) => (
                                    <DropdownMenuRadioItem 
                                        key={b.id} 
                                        value={String(b.id)} 
                                        className="text-xs"
                                    >
                                        {b.name}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        cell: ({ row }) => (
            <span className="text-sm text-gray-700">{row.getValue("brand_name")}</span>
        ),
        filterFn: (row, id, value) => !value || row.getValue(id) === value,
    },
    {
        accessorKey: "city",
        header: ({ column, table }) => {
            const current = column.getFilterValue() || "all"
            return (
                <div className="flex items-center gap-2">
                    <span>City</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-16 text-[10px]">
                                {current === "all" ? "All" : current}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-36 bg-white border shadow-md">
                            <DropdownMenuRadioGroup
                                value={current}
                                onValueChange={(val) => {
                                    column.setFilterValue(val === "all" ? undefined : val)
                                    table.options.meta?.updatePage?.(1)
                                }}
                            >
                                <DropdownMenuRadioItem value="all" className="text-xs">
                                    All cities
                                </DropdownMenuRadioItem>
                                {CITIES.map((c) => (
                                    <DropdownMenuRadioItem key={c} value={c} className="text-xs">
                                        {c}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">{row.getValue("city")}</span>
        ),
        filterFn: (row, id, value) => !value || row.getValue(id) === value,
    },
    {
        accessorKey: "managerName",
        header: "Store manager",
        cell: ({ row }) => {
            const { manager_name, manager_phone } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">{manager_name || "—"}</p>
                    {manager_phone && (
                        <p className="text-xs text-gray-400">+91 {manager_phone}</p>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "deliveriesToday",
        header: "Deliveries",
        cell: ({ row }) => {
            const { today_deliveries = 0, total_deliveries = 0 } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">
                        {today_deliveries > 0
                            ? <span className="text-blue-600">{today_deliveries} today</span>
                            : <span className="text-gray-400">None today</span>
                        }
                    </p>
                    <p className="text-xs text-gray-400">{total_deliveries} total</p>
                </div>
            )
        },
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