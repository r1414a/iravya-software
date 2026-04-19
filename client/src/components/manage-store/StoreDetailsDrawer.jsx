

// StoreDetailsDrawer.jsx (Fixed - Added missing DialogDescription)
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
    MapPin,
    CheckCircle2,
    Clock,
    Truck,
} from "lucide-react"
import { useGetStoreDeliveriesQuery } from "@/lib/features/stores/storeApi"
import { TRIP_STATUS_COLORS } from "@/constants/constant"

const STATUS_STYLES = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
}

export default function StoreDetailDrawer({ store, open, onClose }) {
    const { data, isLoading } = useGetStoreDeliveriesQuery(store?.id, {
        skip: !store?.id
    })

    const allTrips = data?.data || []

    if (!store) return null

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
                <SheetHeader className="px-4 sm:px-6 pt-6 pb-4 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                            <SheetTitle className="text-lg sm:text-xl font-bold break-words">
                                {store.name}
                            </SheetTitle>

                            <SheetDescription className="text-xs sm:text-sm text-gray-500 mt-0.5 flex items-center gap-1 flex-wrap">
                                <MapPin size={12} /> {store.city} · {store.brand_name}
                            </SheetDescription>
                        </div>

                        <Badge
                            className={`${STATUS_STYLES[store.status]} border-0 text-xs font-medium sm:mt-2 self-start sm:self-auto`}
                        >
                            {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                        </Badge>
                    </div>

                    <p className="text-xs text-gray-400 mt-1 break-words">
                        {store.address}
                    </p>
                </SheetHeader>

                <div className="overflow-y-auto px-4 sm:px-6 pb-4 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-4">
                        Recent deliveries
                    </p>

                    <div className="flex flex-col gap-3">
                        {isLoading ? (
                            <p className="text-sm text-gray-400">Loading deliveries...</p>
                        ) : !allTrips.length ? (
                            <p className="text-sm text-gray-400">No deliveries found</p>
                        ) : (
                            allTrips.map((trip) => (
                                <div
                                    key={trip.trip_id}
                                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                    <div className="mt-0.5 rounded-full p-1 bg-green-100 shrink-0">
                                        <CheckCircle2 size={13} className="text-green-600" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <p className="text-xs font-mono text-gray-500 truncate">
                                                {trip.tracking_code}
                                            </p>

                                            <Badge className={`text-[10px] ${TRIP_STATUS_COLORS[trip.trip_status]?.className || ""}`}>
                                                {trip.trip_status}
                                            </Badge>
                                        </div>

                                        <p className="text-sm font-medium flex items-center gap-1 flex-wrap">
                                            <Truck size={11} className="text-gray-400 shrink-0" />
                                            {trip.truck_number || "No Truck"} · {trip.driver_name || "No Driver"}
                                        </p>

                                        <p className="text-xs text-gray-400 break-words">
                                            From {trip.dc_name}
                                        </p>

                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock size={10} />
                                            {new Date(trip.departed_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
