import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { MoreHorizontal, Eye, MapPin, Pencil } from "lucide-react"
// import TripDetailSheet from "../TripDetailSheet"
import { useState } from "react"
import TripMapModal from "../TripMapModal"
import TripDetailSheet from "../TripDetailSheet"
import { useCancelTripMutation } from "@/lib/features/trips/tripApi"
import DeleteModal from "@/components/DeleteModal"
import { format, parseISO } from "date-fns"
import { useLocation } from "react-router-dom"


const DCS = ["Pune", "Mumbai", "Nashik", "Nagpur", "Kolhapur", "Amravati"]
const BRANDS = ["Tata Westside", "Zudio", "Tata Cliq", "Tanishq"]

// Status badge — matches your existing style pattern
function StatusBadge({ status }) {
    const config = {
        in_transit: { label: "In Transit", className: "bg-blue-100 text-blue-700 border-blue-200" },
        completed: { label: "Completed", className: "bg-green-100 text-green-700 border-green-200" },
        scheduled: { label: "Scheduled", className: "bg-gray-100 text-gray-600 border-gray-200" },
        cancelled: { label: "Cancelled", className: "bg-red-100 text-red-600 border-red-200" },
    }
    const c = config[status] || config.scheduled
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${c.className}`}>
            {c.label}
        </span>
    )
}

// Stops pills — shows store names as small badges
function StopsPills({ stops }) {
    const visible = stops.slice(0, 2)
    const extra = stops.length - 2

    if (!stops.length) {
        return <p className="text-sm text-gray-500">—</p>
    }

    return (
        <div className="flex flex-wrap gap-1">
            {visible.map((s, i) => {
                const name = typeof s === "string" ? s : s?.store_name || "—"

                return (
                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        <MapPin size={9} /> {name.replace(' Store', '')}
                    </span>
                )
            })}
            {extra > 0 && (
                <span className="text-xs text-gray-400">+{extra} more</span>
            )}
        </div>
    )
}

// Actions cell — uses a controlled Sheet so it opens from the row
function ActionsCell({ row, table }) {
    const [detailOpen, setDetailOpen] = useState(false)
    const [mapOpen, setMapOpen] = useState(false)
    const trip = row.original
    console.log("column", trip);


    const {
        setEditTrip,
        setEditOpen,
        // setDriverHistory,
        // setDriverHistoryOpen,
        setTripDetail,
        setTripDetailOpen,
    } = table.options.meta || {}

    const [cancelTrip, { isLoading: isCancelling }] = useCancelTripMutation();

    const handleCancel = async () => {
        try {
            await cancelTrip(trip.id).unwrap();
        } catch (err) {
            console.error("Failed to cancel trip", err);

        }
    };

    return (
        <>

            <TripMapModal
                trip={trip}
                open={mapOpen}
                onClose={setMapOpen}
            />

            <div className="flex items-center gap-2 justify-end">
              
                {
                    trip.status === "scheduled" && (
                        <Button variant="outline" size="xs"
                            onClick={() => {
                                setEditTrip?.(trip)
                                setEditOpen?.(true)
                            }}
                            className="hover:bg-maroon cursor-pointer hover:text-white"><Pencil size={16} /></Button>
                    )
                }

                {(trip.status === "in_transit" || trip.status === "scheduled") && (
                    <DeleteModal
                        who={trip.tracking_code}
                        m1active="Trip will no longer be tracked"
                        onConfirm={handleCancel}
                        isLoading={isCancelling}
                        isCancel
                    />
                )}


                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal size={14} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border shadow-md w-36">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                setTripDetail?.(trip)
                                setTripDetailOpen?.(true)
                            }}
                        >
                            <Eye size={13} className="mr-2" /> View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMapOpen(true)}>
                            <MapPin size={13} className="mr-2" /> View on map
                        </DropdownMenuItem>
                        {/* {(trip.status === "in_transit" || trip.status === "scheduled") && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={handleCancelTrip}
                            >
                                <XCircle size={13} className="mr-2" /> Cancel trip
                            </DropdownMenuItem>
                        </>
                    )} */}
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </>
    )
}

export const columns = [
    {
        accessorKey: "tracking_code",
        header: "Trip ID",
        cell: ({ row }) => (
            <span className="font-mono text-sm font-medium text-maroon">
                {row.getValue("tracking_code")}
            </span>
        ),
    },
    {
        accessorKey: "truck",
        header: "Truck",
        cell: ({ row }) => {
            const { registration_no, driver_name, phone_number } = row.original;
            // console.log("truck", row.original);

            return (
                <div>
                    <p className="font-mono text-sm">{registration_no}</p>
                    <p className="text-xs text-gray-500">{driver_name}</p>
                    <p className="text-xs text-gray-500">{phone_number && `+91 ${phone_number}`}</p>
                </div>
            )
        }
    },
    //     {
    //   accessorKey: "gpsDevice",
    //   header: "GPS Device",
    //   cell: ({ row }) => {
    //     const device = row.getValue("gpsDevice")

    //     return (
    //       <div className="flex flex-col">
    //         <span className="font-mono text-sm text-gray-800">
    //           {device || "—"}
    //         </span>
    //       </div>
    //     )
    //   },
    // },
    {
        accessorKey: "source_dc_name",
        header: ({ column, table }) => {
            const currentValue = column.getFilterValue() || "all"
            const { pathname } = useLocation()
            return (
                <div className="flex items-center gap-2">
                    <span>Source DC</span>
                    {
                        pathname.startsWith('/admin') && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-6 min-w-20 text-[10px]">
                                        {currentValue === "all" ? "All" : currentValue}
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-40 bg-white border shadow-md">
                                    <DropdownMenuRadioGroup
                                        value={currentValue}
                                        onValueChange={(value) => {
                                            column.setFilterValue(
                                                value === "all" ? undefined : value
                                            )
                                            table.options.meta?.updatePage?.(1)
                                        }}
                                    >
                                        <DropdownMenuRadioItem value="all" className="text-xs">
                                            All
                                        </DropdownMenuRadioItem>

                                        {DCS.map((dc) => (
                                            <DropdownMenuRadioItem
                                                key={dc}
                                                value={dc}
                                                className="text-xs"
                                            >
                                                {dc}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    }

                </div>
            )
        },
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {row.getValue("source_dc_name")}
            </span>
        ),
    },
    {
        accessorKey: "stops",
        header: "Stops",
        cell: ({ row }) => (
            <StopsPills stops={row.original.stops} />
        ),
    },
    {
        accessorKey: "status",
        header: ({ column, table }) => {
            const currentValue = column.getFilterValue() || "all"
            return (
                <div className="flex items-center gap-2">
                    <span>Status</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-18 text-[10px]">
                                {currentValue === "all"
                                    ? "All"
                                    : currentValue === "in_transit"
                                        ? "In Transit"
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
                                    table.options.meta?.updatePage?.(1)
                                }}
                            >
                                <DropdownMenuRadioItem value="all" className="text-xs">
                                    All
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="in_transit" className="text-xs">
                                    In transit
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="completed" className="text-xs">
                                    Completed
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="scheduled" className="text-xs">
                                    Scheduled
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="cancelled" className="text-xs">
                                    Cancelled
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        cell: ({ row }) => (
            <StatusBadge status={row.getValue("status")} />
        ),
    },
    {
        accessorKey: "departed_at",
        header: "Departed",
        cell: ({ row }) => {
            const departed_at = row.getValue("departed_at")
            if (!departed_at) {
                return <p className="text-sm text-gray-500">—</p>
            }
            return (
                <span className="text-sm text-gray-500">
                    {format(parseISO(departed_at), "MMM d, hh:mm a") || "—"}
                </span>
            )
        }
    },
    {
        accessorKey: "eta",
        header: "ETA / Completed",
        cell: ({ row }) => {
            const trip = row.original
            if (trip.completed_at) return (
                <span className="text-sm text-green-600 font-medium">{format(parseISO(trip.completed_at), "MMM d, hh:mm a")}</span>
            )
            if (trip.eta) return (
                <span className="text-sm text-blue-600">{trip.eta}</span>
            )
            return <span className="text-sm text-gray-400">—</span>
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => <ActionsCell row={row} table={table} />,
    },
]