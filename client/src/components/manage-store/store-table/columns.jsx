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
    MapPin,
    ChevronRight,
    LocateFixed,
    ExternalLink,
    Copy,
    Eye,
    Trash2
} from "lucide-react"
import StoreDetailDrawer from "../StoreDetailsDrawer"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import StoreForm from "../StoreForm"
import DeleteModal from "@/components/DeleteModal"
import { useDeleteStoreMutation } from "@/lib/features/stores/storeApi"

const statusStyles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
}

const CITIES = ["Pune", "Mumbai", "Nashik", "Nagpur"]


function ActionsCell({ row, table }) {
    const store = row.original;
    // console.log(store);

    const { setEditStore, setEditOpen } = table.options.meta;
    const { pathname } = useLocation();
    const [viewDetails, setViewDetails] = useState(false)
    // const [editOpen, setEditOpen] = useState(false)

    const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();

    const handleDelete = async () => {
        try {
            await deleteStore(store.id).unwrap();
        } catch (err) {
            console.error("Failed to delete store", err);
        }
    };
    return (
        <>
            <StoreDetailDrawer
                store={store}
                open={viewDetails}
                onClose={() => setViewDetails(false)}
            />
            
            <div className="flex items-center gap-2 justify-end">
                <Button variant="outline" size="xs" onClick={() => setViewDetails(true)} className="hover:bg-maroon cursor-pointer text-blue-800 hover:text-white"><Eye size={16} /></Button>
                <Button variant="outline" size="xs" onClick={() => {
                    setEditStore(store)
                    setEditOpen(true)
                    }} className="hover:bg-maroon cursor-pointer hover:text-white"><Pencil size={16} /></Button>
                {
                    pathname.startsWith('/admin') && (


                        <DeleteModal
                            who={store.name}
                            m1active="Store will no longer be available for trip scheduling or fleet tracking."
                            onConfirm={handleDelete}
                            isLoading={isDeleting}
                        />

                    )
                }


            </div>
        </>
    )
}

export const columns = [
    // Store name + address
    {
        accessorKey: "name",
        header: "Store",
        cell: ({ row }) => {
            const { name, address } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="font-semibold text-sm">{name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 max-w-56 text-wrap">
                        <MapPin size={10} className="shrink-0" />
                        {address}
                    </p>
                </div>
            )
        },
    },

    // Brand — radio filter in header
    {
        accessorKey: "brand_name",
        header: ({ column, table }) => {
            const current = column.getFilterValue() || "all"
            const brands = table.options.meta?.brands || []
            console.log("brands", brands);

            return (
                <div className="flex items-center gap-2">
                    <span>Brand</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-18 text-[10px]">
                                {current === "all" ? "All" : brands.find(b => String(b.id) === current)?.name || "Select"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 bg-white border shadow-md">
                            <DropdownMenuRadioGroup
                                value={current}
                                onValueChange={(val) => {
                                    column.setFilterValue(val === "all" ? undefined : val)
                                    table.options.meta?.updatePage?.(1)
                                }
                                }
                            >
                                <DropdownMenuRadioItem value="all" className="text-xs">All brands</DropdownMenuRadioItem>
                                {brands.map((b) => (
                                    <DropdownMenuRadioItem key={b.id} value={String(b.id)} className="text-xs">{b.name}</DropdownMenuRadioItem>
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
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue(id) === value
        },
    },

    // City — radio filter in header
    {
        accessorKey: "city",
        header: ({ column }) => {
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
                                onValueChange={(val) =>
                                    column.setFilterValue(val === "all" ? undefined : val)
                                }
                            >
                                <DropdownMenuRadioItem value="all" className="text-xs">All cities</DropdownMenuRadioItem>
                                {CITIES.map((c) => (
                                    <DropdownMenuRadioItem key={c} value={c} className="text-xs">{c}</DropdownMenuRadioItem>
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

    // Store manager
    {
        accessorKey: "managerName",
        header: "Store manager",
        cell: ({ row }) => {
            const { manager_name, manager_phone } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">{manager_name}</p>
                    <p className="text-xs text-gray-400">+91 {manager_phone}</p>
                </div>
            )
        },
    },

    // Deliveries — today + total
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

    // Devices currently at this store
    // {
    //     accessorKey: "currentDevices",
    //     header: "Devices held",
    //     cell: ({ row }) => {
    //         const devices = row.original.currentDevices
    //         if (devices.length === 0) {
    //             return <span className="text-xs text-gray-400 italic">None</span>
    //         }
    //         return (
    //             <div className="flex flex-col gap-1">
    //                 {devices.map((d) => (
    //                     <div key={d} className="flex items-center gap-1.5 text-xs">
    //                         <LocateFixed size={11} className="text-amber-500" />
    //                         <span className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">{d}</span>
    //                     </div>
    //                 ))}
    //             </div>
    //         )
    //     },
    // },

    // Public tracking slug
    // {
    //     accessorKey: "publicTrackingSlug",
    //     header: "Public URL",
    //     cell: ({ row }) => {
    //         const slug = row.original.publicTrackingSlug
    //         return (
    //             <div
    //                 className="flex items-center gap-1.5 text-xs font-mono text-blue-600 hover:underline cursor-pointer"
    //                 onClick={(e) => {
    //                     e.stopPropagation()
    //                     navigator.clipboard.writeText(`/track/${slug}`)
    //                 }}
    //                 title="Click to copy"
    //             >
    //                 <Copy size={10} />
    //                 /track/{slug}
    //             </div>
    //         )
    //     },
    // },

    // Status — radio filter in header
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
                                {current === "all" ? "All" : current.charAt(0).toUpperCase() + current.slice(1)}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-32 bg-white border shadow-md">
                            <DropdownMenuRadioGroup
                                value={current}
                                onValueChange={(val) => {
                                    column.setFilterValue(val === "all" ? undefined : val)
                                    table.options.meta?.updatePage(1)
                                }

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

    // Actions

    {
        id: "actions",
        cell: ({ row, table }) => <ActionsCell row={row} table={table} />,
    },
    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //         const store = row.original
    //         return (
    //             <div className="flex items-center gap-2 justify-end">
    //                 <DropdownMenu>
    //                     <DropdownMenuTrigger asChild>
    //                         <Button
    //                             variant="ghost"
    //                             size="icon"
    //                             className="h-8 w-8"
    //                             onClick={(e) => e.stopPropagation()}
    //                         >
    //                             <MoreHorizontal size={16} />
    //                         </Button>
    //                     </DropdownMenuTrigger>
    //                     <DropdownMenuContent
    //                         align="end"
    //                         className="bg-white border shadow-md w-48"
    //                         onClick={(e) => e.stopPropagation()}
    //                     >
    //                         <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
    //                             <Pencil size={14} /> Edit store details
    //                         </DropdownMenuItem>
    //                         <DropdownMenuItem
    //                             className="gap-2 text-sm cursor-pointer"
    //                             onClick={() => window.open(`/track/${store.publicTrackingSlug}`, "_blank")}
    //                         >
    //                             <ExternalLink size={14} /> Open public tracking URL
    //                         </DropdownMenuItem>
    //                         <DropdownMenuSeparator />
    //                         <DropdownMenuItem
    //                             className={`gap-2 text-sm cursor-pointer ${store.status === "active" ? "text-red-500" : "text-green-600"}`}
    //                         >
    //                             <Ban size={14} />
    //                             {store.status === "active" ? "Deactivate store" : "Reactivate store"}
    //                         </DropdownMenuItem>
    //                     </DropdownMenuContent>
    //                 </DropdownMenu>
    //                 <ChevronRight size={16} className="text-gray-300" />
    //             </div>
    //         )
    //     },
    // },
]