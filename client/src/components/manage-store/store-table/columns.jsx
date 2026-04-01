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

const statusStyles = {
    active:   "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
}

const BRANDS = ["Tata Westside", "Zudio", "Tata Cliq", "Tanishq"]
const CITIES = ["Pune", "Mumbai", "Nashik", "Nagpur"]


function ActionsCell({ row }) {
      const store = row.original
      const {pathname} = useLocation();
    const [viewDetails, setViewDetails] = useState(false)
    const [editOpen,    setEditOpen]    = useState(false)
    return (
        <>
            <StoreDetailDrawer
                store={store} 
                open={viewDetails} 
                onClose={() => setViewDetails(false)} 
            />
    
        
        <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" size="xs" onClick={() => setViewDetails(true)} className="hover:bg-maroon cursor-pointer text-blue-800 hover:text-white"><Eye size={16}/></Button>
            {
                pathname.startsWith('/admin') && (
                    <>
                    <Button variant="outline" size="xs" className="hover:bg-maroon cursor-pointer hover:text-white"><Pencil size={16} /></Button>
                    <Button variant="outline" size="xs" className="hover:bg-maroon cursor-pointer text-red-600 hover:text-white"><Trash2 size={16} /></Button>
                    
                    </>
                )
            }

            
        </div>
        </>
    )
}

// function ActionsCell({ row }) {
//     const store = row.original
//     // const [editOpen, setEditOpen] = useState(false)
//     // const [tripDetailsOpen, setTripDetailsOpen] = useState(false)
//     // const [historyOpen, setHistoryOpen] = useState(false)

//     return (
//         <div className="flex items-center gap-2 justify-end">

//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="h-8 w-8"
//                                 onClick={(e) => e.stopPropagation()}
//                             >
//                                 <MoreHorizontal size={16} />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent
//                             align="end"
//                             className="bg-white border shadow-md w-48"
//                             onClick={(e) => e.stopPropagation()}
//                         >
//                             <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
//                                 <Pencil size={14} /> Edit store details
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                                 className="gap-2 text-sm cursor-pointer"
//                                 onClick={() => window.open(`/track/${store.publicTrackingSlug}`, "_blank")}
//                             >
//                                 <ExternalLink size={14} /> Open public tracking URL
//                             </DropdownMenuItem>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem
//                                 className={`gap-2 text-sm cursor-pointer ${store.status === "active" ? "text-red-500" : "text-green-600"}`}
//                             >
//                                 <Ban size={14} />
//                                 {store.status === "active" ? "Deactivate store" : "Reactivate store"}
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                     {/* <ChevronRight size={16} className="text-gray-300" /> */}
//                 </div>
//     )
// }



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
                    <p className="text-xs text-gray-400 flex items-center gap-1 max-w-56 truncate">
                        <MapPin size={10} className="shrink-0" />
                        {address}
                    </p>
                </div>
            )
        },
    },

    // Brand — radio filter in header
    // {
    //     accessorKey: "brand",
    //     header: ({ column }) => {
    //         const current = column.getFilterValue() || "all"
    //         return (
    //             <div className="flex items-center gap-2">
    //                 <span>Brand</span>
    //                 <DropdownMenu>
    //                     <DropdownMenuTrigger asChild>
    //                         <Button variant="outline" size="sm" className="h-6 min-w-18 text-[10px]">
    //                             {current === "all" ? "All" : current.split(" ")[1] ?? current}
    //                         </Button>
    //                     </DropdownMenuTrigger>
    //                     <DropdownMenuContent className="w-40 bg-white border shadow-md">
    //                         <DropdownMenuRadioGroup
    //                             value={current}
    //                             onValueChange={(val) =>
    //                                 column.setFilterValue(val === "all" ? undefined : val)
    //                             }
    //                         >
    //                             <DropdownMenuRadioItem value="all" className="text-xs">All brands</DropdownMenuRadioItem>
    //                             {BRANDS.map((b) => (
    //                                 <DropdownMenuRadioItem key={b} value={b} className="text-xs">{b}</DropdownMenuRadioItem>
    //                             ))}
    //                         </DropdownMenuRadioGroup>
    //                     </DropdownMenuContent>
    //                 </DropdownMenu>
    //             </div>
    //         )
    //     },
    //     cell: ({ row }) => (
    //         <span className="text-sm text-gray-700">{row.getValue("brand")}</span>
    //     ),
    //     filterFn: (row, id, value) => !value || row.getValue(id) === value,
    // },

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
            const { managerName, managerPhone } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">{managerName}</p>
                    <p className="text-xs text-gray-400">{managerPhone}</p>
                </div>
            )
        },
    },

    // Deliveries — today + total
    {
        accessorKey: "deliveriesToday",
        header: "Deliveries",
        cell: ({ row }) => {
            const { deliveriesToday, totalDeliveries, lastDelivery } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">
                        {deliveriesToday > 0
                            ? <span className="text-blue-600">{deliveriesToday} today</span>
                            : <span className="text-gray-400">None today</span>
                        }
                    </p>
                    <p className="text-xs text-gray-400">{totalDeliveries} total</p>
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
    {
        accessorKey: "publicTrackingSlug",
        header: "Public URL",
        cell: ({ row }) => {
            const slug = row.original.publicTrackingSlug
            return (
                <div
                    className="flex items-center gap-1.5 text-xs font-mono text-blue-600 hover:underline cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation()
                        navigator.clipboard.writeText(`/track/${slug}`)
                    }}
                    title="Click to copy"
                >
                    <Copy size={10} />
                    /track/{slug}
                </div>
            )
        },
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
                                <DropdownMenuRadioItem value="all"      className="text-xs">All</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="active"   className="text-xs">Active</DropdownMenuRadioItem>
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
        filterFn: (row, id, value) => !value || row.getValue(id) === value,
    },

    // Actions

    {
        id: "actions",
        cell: ({ row }) => <ActionsCell row={row} />,
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