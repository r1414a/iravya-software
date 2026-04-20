import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, KeyRound, Road } from "lucide-react"
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


function ActionsCell({ row, table }) {
    const driver = row.original
    console.log("driver", driver);

    const { pathname } = useLocation();
    const { setEditDriver, setEditOpen, setDriverHistory,
        setDriverHistoryOpen, setCurrentTrip, setCurrentTripOpen } = table.options.meta || {}

    // const [tripDetailsOpen, setTripDetailsOpen] = useState(false)

    const [deleteDriver, { isLoading: isDeleting }] = useDeleteDriverMutation();

    const handleDelete = async () => {
        try {
            await deleteDriver(driver.id).unwrap();
        } catch (err) {
            console.error("Failed to delete driver", err);

        }
    };


    return (
        <>

            {/* Will need to fetch trip details by trip id by api call */}
            {/* <TripDetailSheet
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
            /> */}

            <div className="flex items-center gap-2 justify-end">



                <Button variant="outline" size="xs"
                    onClick={() => {
                        setEditDriver?.(driver)
                        setEditOpen?.(true)
                    }}
                    className="hover:bg-maroon cursor-pointer hover:text-white"><Pencil size={16} /></Button>
                {
                    pathname.startsWith('/admin') && (
                        <DeleteModal
                            who={driver.full_name}
                            m1active="Driver will not be assignable to any trip"
                            onConfirm={handleDelete}
                            isLoading={isDeleting}
                        />
                    )
                }


                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border shadow-md w-40">

                        {
                            driver.driver_status === "On trip" && (
                                <DropdownMenuItem
                                    className="gap-2 text-sm cursor-pointer"
                                    onClick={() => {
                                        setCurrentTrip(driver)
                                        setCurrentTripOpen?.(true)
                                    }}
                                >
                                    <Road size={14} /> View trip details
                                </DropdownMenuItem>
                            )
                        }

                        <DropdownMenuItem
                            className="gap-2 text-sm cursor-pointer"
                            onClick={() => {
                                setDriverHistory?.(driver)
                                setDriverHistoryOpen?.(true)
                            }}
                        >
                            <KeyRound size={14} /> View trip history
                        </DropdownMenuItem>
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
                                <DropdownMenuRadioItem value="LMV" className="text-xs">
                                    LMV
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="HMV" className="text-xs">
                                    HMV
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="HGMV" className="text-xs">
                                    HGMV
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="HTV" className="text-xs">
                                    HTV
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        cell: ({ row }) => {
            const { licence_class, licence_expiry } = row.original
            return (
                <div className="-space-y-0.5">
                    <p className="text-sm font-mono">{row.original.licence_no}</p>
                    <p className="text-xs text-gray-400">{licence_class} · Exp {licence_expiry ? format(parseISO(licence_expiry), 'MMM yyyy') : "-"}</p>
                </div>
            )
        },
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
        cell: ({ row }) => {
            const { since } = row.original;
            return (<span className="text-sm text-gray-500">{since ? format(parseISO(since), 'MMM yyyy') : "-"}</span>)
        },
    },
    // Status
    {
        accessorKey: "driver_status",
        header: ({ column, table }) => {
            const currentValue = column.getFilterValue() || "all"

            return (
                <div className="flex items-center gap-2">
                    <span>Status</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-18 text-[10px]">
                                {currentValue}
                            </Button>
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
                                <DropdownMenuRadioItem value="available" className="text-xs">
                                    Available
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="on_trip" className="text-xs">
                                    On trip
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="inactive" className="text-xs">
                                    In active
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
        cell: ({ row, table }) => <ActionsCell row={row} table={table} />,
    },
]