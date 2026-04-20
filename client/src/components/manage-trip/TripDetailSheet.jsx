import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { MapPin, Truck, User } from "lucide-react"
import { useGetDriverCurrentTripQuery } from "@/lib/features/drivers/driverApi"
import { format, parseISO } from "date-fns"
import { useGetTruckRecentTripQuery } from "@/lib/features/trucks/truckApi"

const statusStyles = {
  in_transit: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
}


export default function TripDetailSheet({ entity, type, open, onClose }) {
  console.log(entity);
  

  const { data: driverTrip, isLoading: driverLoading } =
    useGetDriverCurrentTripQuery(entity?.id, {
      skip: type !== "driver" || !entity?.id
    })

  const { data: truckTrip, isLoading: truckLoading } =
    useGetTruckRecentTripQuery(entity?.id, {
      skip: type !== "truck" || !entity?.id
    })

  const isLoading =
  type === "driver"
    ? driverLoading
    : type === "truck"
    ? truckLoading
    : false

const trip =
  type === "driver"
    ? driverTrip?.data?.[0]
    : type === "truck"
    ? truckTrip?.data?.[0]
    : entity   // ✅ FIX: use passed trip directly


  
  if (!entity) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
        <SheetHeader className="border-b border-gray-200">
          <SheetTitle>Trip Details</SheetTitle>
          <SheetDescription>
            Complete overview of this trip
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <p className="text-sm text-gray-400 ps-4">Loading deliveries...</p>
        ) : !trip ? (
          <p className="text-sm text-gray-400 ps-4">No deliveries found</p>
        ) : (
          <div className="p-3 sm:p-4 flex flex-col gap-6 text-sm flex-1 overflow-y-auto" >

            {/* Top Info */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Trip ID</p>
                <p className="font-mono text-xs sm:text-sm text-maroon font-semibold">{trip.tracking_code}</p>
              </div>
              {/* {
                trip.gpsDevice &&
                <div>
                  <p className="text-xs text-gray-500">GPS Device</p>
                  <p className="font-mono text-xs sm:text-sm text-maroon font-semibold">{trip.gpsDevice}</p>
                </div>
              } */}


              <Badge className={`${statusStyles[trip.status]} border-0 text-xs`}>
                {trip.status?.replace("_", " ") || "_"}
              </Badge>
            </div>

            {/* Truck + Driver */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Truck size={16} />
                <div>
                  <p className="text-xs text-gray-500">Truck</p>
                  <p className="font-medium text-xs sm:text-sm">{trip.registration_no}</p>
                  <p className="text-muted-foreground text-xs">Model: {trip.model}</p>
                  <p className="text-muted-foreground text-xs">Capacity: {trip.capacity} T</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User size={16} />
                <div>
                  <p className="text-xs text-gray-500">Driver</p>
                  <p className="font-medium text-xs sm:text-sm">{trip.driver_name}</p>
                  <p className="text-muted-foreground text-xs">{trip.phone_number}</p>
                </div>
              </div>
            </div>

            {/* Source */}
            <div className="flex justify-between">
              <div>
              <p className="text-xs text-gray-500 mb-1">Source DC</p>
              <p className="font-medium text-xs sm:text-sm">{trip.source_dc_name}</p>
              </div>
              <div>
              <p className="text-xs text-gray-500 mb-1">Distance</p>
              <p className="font-medium text-xs sm:text-sm">{Math.floor(trip?.distance) || 0} km</p>
              </div>
            </div>

            {/* Stops */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Stops</p>
              <div className="flex flex-col gap-2">
                {!trip.stops ?
                  <p className="text-sm text-gray-500">_</p>
                :
                trip.stops.map((stop, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 border px-3 py-2 rounded-md ${stop.status === "confirmed"
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50"
                      }`}
                  >
                    <span className="text-xs text-gray-500">{i + 1}.</span>
                    <MapPin size={14} />
                    <span className="text-xs sm:text-sm">{stop.store_name}</span>

                    {stop.status === "confirmed" && (
                      <span className="ml-auto text-xs text-green-600">Done</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Departed</p>
                <p className="text-xs sm:text-sm">{trip.departed_at ? format(parseISO(trip?.departed_at), "MMM d, hh:mm a") : "—"}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  {trip.completedAt ? "Completed" : "ETA"}
                </p>
                <p className="text-xs sm:text-sm">{trip.completed_at ? format(parseISO(trip?.completed_at), "MMM d, hh:mm a"): "—"}</p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}