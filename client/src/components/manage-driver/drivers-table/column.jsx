import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Truck, KeyRound, Ban, Filter, Road, Eye, Trash2 } from "lucide-react"
import EditDriverSheet from "./EditDriverSheet"
import TripHistorySheet from "./TripHistorySheet"
import { useState } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { FieldLabel } from "@/components/ui/field"
import TripDetailSheet from "../../manage-trip/TripDetailSheet"
import { useLocation } from "react-router-dom"
import DeleteModal from "@/components/DeleteModal"
import { getNameInitials } from "@/lib/utils/getNameInitials"
import { format, parseISO } from "date-fns"
import { useDeleteDriverMutation } from "@/lib/features/drivers/driverApi"


// Colour map for avatar initials — same ua-* palette as users


// Status badge styles
const statusStyles = {
    "Available": "bg-green-100 text-green-700",
    "On trip": "bg-blue-100 text-blue-700",
    "Inactive": "bg-gray-100 text-gray-500",
}


function ActionsCell({ row }) {
    const driver = row.original
    const { pathname } = useLocation();

    const [editOpen, setEditOpen] = useState(false)
    const [tripDetailsOpen, setTripDetailsOpen] = useState(false)
    const [historyOpen, setHistoryOpen] = useState(false)

      const [deleteDriver, { isLoading: isDeleting }] = useDeleteDriverMutation();

    const handleDelete = async () => {
        try {
            await deleteDriver(driver.id).unwrap();
            toast.success("Driver deleted successfully");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete driver");
        }
    };


    return (
        <>
            <EditDriverSheet
                driver={driver}
                open={editOpen}
                onClose={() => setEditOpen(false)}
            />

            {/* Will need to fetch trip details by trip id by api call */}
            <TripDetailSheet
                trip={{
                    id: "TRP-2840",
                    brand: "Zudio",
                    truck: "MH14CD5678",
                    driver: "Suresh M.",
                    sourceDC: "Mumbai Warehouse DC",
                    gpsDevice: "GPS-344-PUNE",
                    stops: [
                        { name: "Hinjawadi Store", status: "pending" },
                    ],
                    stopsCount: 1,
                    status: "in_transit",
                    departedAt: "Today, 08:15 AM",
                    eta: "Today, 10:30 AM",
                    completedAt: null,
                }}
                open={tripDetailsOpen}
                onClose={setTripDetailsOpen}
            />

            <TripHistorySheet
                driver={driver}
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
            />

            <div className="flex items-center gap-2 justify-end">

                {
                    pathname.startsWith('/admin') && (
                        <>
                            <Button variant="outline" size="xs" onClick={() => setEditOpen(true)} className="hover:bg-maroon cursor-pointer hover:text-white"><Pencil size={16} /></Button>

                            <DeleteModal
                                who={driver.name}
                                m1active="Driver will not be assignable to any trip"
                                onConfirm={handleDelete}
                                isLoading={isDeleting}
                            />
                            {/* <Button variant="outline" size="xs" className="hover:bg-maroon cursor-pointer text-red-600 hover:text-white"><Trash2 size={16} /></Button> */}
                        </>
                    )
                }


                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border shadow-md w-40">
                        {/* <DropdownMenuItem
                        className="gap-2 text-sm cursor-pointer"
                        onClick={() => setEditOpen(true)}
                    >
                        <Pencil size={14} /> Edit driver
                    </DropdownMenuItem> */}
                        {
                            driver.currentTrip && (
                                <DropdownMenuItem
                                    className="gap-2 text-sm cursor-pointer"
                                    onClick={() => setTripDetailsOpen(true)}
                                >
                                    <Road size={14} /> View trip details
                                </DropdownMenuItem>
                            )
                        }

                        <DropdownMenuItem
                            className="gap-2 text-sm cursor-pointer"
                            onClick={() => setHistoryOpen(true)}
                        >
                            <KeyRound size={14} /> View trip history
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem className="gap-2 text-sm cursor-pointer text-red-500">
                            <Ban size={14} /> Deactivate
                        </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    )
}


export const columns = [
    // Driver avatar + name + contact
    {
        accessorKey: "name",
        header: "Driver",
        cell: ({ row }) => {
            const { first_name, last_name, phone_number, full_name } = row.original
            return (
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-semibold p-1 bg-gold text-white`}>
                        {getNameInitials(first_name, last_name)}
                    </div>
                    <div className="-space-y-0.5">
                        <p className="font-medium text-sm">{full_name}</p>
                        <p className="text-xs text-gray-400">{phone_number}</p>
                    </div>
                </div>
            )
        },
    },
    // Licence number + class
    {
        accessorKey: "licence_class",
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
                                    : currentValue.toUpperCase()}
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
                <p className="text-sm font-mono">{row.original.licence_no}</p>
                <p className="text-xs text-gray-400">{row.original.licence_class} · Exp {format(parseISO(row.original.licence_expiry), 'MMM yyyy')}</p>
            </div>
        ),
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue(id)?.toLowerCase() === value.toLowerCase()
        }
    },
    // Current Trip(or "—")
    {
        accessorKey: "current_trip",
        header: ({ column }) => {
            const currentValue = column.getFilterValue() || "all"
            const isChecked = currentValue === "idle"

            return (
                <div className="flex items-center gap-2">
                    <span>Current trip</span>

                    <Checkbox
                        id="terms-checkbox-basic"
                        name="terms-checkbox-basic"
                        className="w-3 h-3 rounded-xs -mr-1 border border-gray-500"
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                            column.setFilterValue(
                                checked ? "idle" : undefined
                            )
                        }}
                    />
                    <FieldLabel htmlFor="terms-checkbox-basic" className="text-xs">
                        idle only
                    </FieldLabel>
                </div>
            )
        },
        cell: ({ row }) => {
            const trip = row.original.currentTrip
            return trip ? (
                <div className="flex items-center gap-1.5 text-sm">
                    <Road size={14} className="text-gray-400" />
                    <span>{trip}</span>
                </div>
            ) : (
                <span className="text-gray-400 text-sm">—</span>
            )
        },
        filterFn: (row, id, value) => {
            if (!value) return true

            const trip = row.getValue(id)

            // ✅ show only rows with NO driver
            return !trip
        },
    },
    // Total trips + this month
    {
        accessorKey: "trips",
        header: "Trips",
        cell: ({ row }) => (
            <div className="-space-y-0.5">
                <p className="text-sm font-medium">{row.original.total_trips} total</p>
                <p className="text-xs text-gray-400">{row.original.trips_this_month} this month</p>
            </div>
        ),
    },
    {
        accessorKey: "since",
        header: "Since",
        cell: ({ row }) => <span className="text-sm text-gray-500">{format(parseISO(row.original.licence_expiry), 'MMM yyyy')}</span>,
    },
    // Status
    {
        accessorKey: "driver_status",
        header: ({ column }) => {
            const currentValue = column.getFilterValue() || "all"

            return (
                <div className="flex items-center gap-2">
                    <span>Status</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-18 text-[10px]">
                                {currentValue}
                                {/* {currentValue === "all"
                                    ? "All"
                                    : currentValue === "on_trip"
                                        ? "On trip"
                                        : currentValue.charAt(0).toUpperCase() + currentValue.slice(1)} */}
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
                                <DropdownMenuRadioItem value="Available" className="text-xs">
                                    Available
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="On trip" className="text-xs">
                                    On trip
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        cell: ({ row }) => {
            const s = row.original.driver_status;

            // const label = s === "on_trip" ? "On trip" : s.charAt(0).toUpperCase() + s.slice(1)
            // const label = s
            return (
                <Badge className={`${statusStyles[s]} border-0 text-xs font-medium`}>
                    {s}
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