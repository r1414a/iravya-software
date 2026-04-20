// CreateTripModal.jsx (Complete & Fixed)
import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Plus, Route, X, GripVertical, AlertCircle, ChevronLeft } from "lucide-react"
import CreateFormSheetTrigger from "../CreateFormSheetTrigger"
import SearchDropdown from "./SearchDropdown"
import { 
    useAddTripMutation,
    useLazyGetTrucksQuery,
    useLazyGetDriversQuery,
    useLazyGetGpsDevicesQuery,
    useGetStoresQuery,
    useGetTrucksQuery,
    useGetGpsDevicesQuery,
    useGetDriversQuery,
} from "@/lib/features/trips/tripApi"
import { toast } from "sonner"

// ─── Validation Schema ───────────────────────────────────────────────────────
const TRIP_SCHEMA = z.object({
    departure_at: z.string().min(1, "Departure time is required"),
    truck: z.string().min(1, "Please select a truck"),
    gps_device: z.string().min(1, "Please select a GPS device"),
    driver: z.string().min(1, "Please select a driver"),
    delivery_stops: z.array(z.object({
        store_id: z.string(),
        longitude: z.number(),
        latitude: z.number(),
    })).min(1, "Add at least one delivery stop"),
})

// ─── Stops List Component ────────────────────────────────────────────────────
function StopsList({ stops, onRemove }) {
    if (stops.length === 0) return (
        <p className="text-xs text-gray-400 py-2">
            No stops added yet. Add at least one store.
        </p>
    )
    return (
        <div className="flex flex-col gap-2 mt-2">
            {stops.map((stop, index) => (
                <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
                >
                    <GripVertical size={14} className="text-gray-400 cursor-grab" />
                    <span className="text-xs font-medium text-gray-500 w-5">{index + 1}.</span>
                    <span className="text-xs flex-1">{stop.name}</span>
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X size={13} />
                    </button>
                </div>
            ))}
        </div>
    )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function CreateTripModal({ editingTrip = null, open, onClose }) {
    const isEdit = !!editingTrip

    const [step, setStep] = useState(1)
    const [selectedStops, setSelectedStops] = useState([])

    const [addTrip, { isLoading }] = useAddTripMutation()
    
    // Lazy queries - only fetch when needed
    // const [getTrucks, { data: trucksData, isLoading: loadingTrucks }] = useLazyGetTrucksQuery()
    // const [getDrivers, { data: driversData, isLoading: loadingDrivers }] = useLazyGetDriversQuery()
    // const [getGpsDevices, { data: devicesData, isLoading: loadingDevices }] = useLazyGetGpsDevicesQuery()
    
    // Stores query - always available
    // const { data: storesData } = useGetStoresQuery({ page: 1, limit: 100 })

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(TRIP_SCHEMA),
        defaultValues: {
            departure_at: "",
            truck: "",
            gps_device: "",
            driver: "",
            delivery_stops: [],
        },
    })

    const departureAt = watch("departure_at")
    const selectedTruck = watch("truck")
    const selectedDriver = watch("driver")
    const selectedGpsDevice = watch("gps_device")

    // Pre-fill form when editing
    useEffect(() => {
        if (editingTrip && open) {
            reset({
                departure_at: editingTrip.scheduled_at || "",
                truck: editingTrip.truck_id || "",
                gps_device: editingTrip.device_id || "",
                driver: editingTrip.driver_id || "",
                delivery_stops: editingTrip.stops || [],
            })
            setSelectedStops(editingTrip.stops || [])
            setStep(2)
        } else {
            reset({
                departure_at: "",
                truck: "",
                gps_device: "",
                driver: "",
                delivery_stops: [],
            })
            setSelectedStops([])
            setStep(1)
        }
    }, [editingTrip, open, reset])

    // Fetch available resources when departure time is set
    const handleContinue = async () => {
        let departure = departureAt

        // If empty, use current datetime
        if (!departure) {
            departure = new Date().toISOString().slice(0, 16)
            setValue("departure_at", departure)
        }

        try {
            // Fetch all available resources in parallel
            // await Promise.all([
            //     getTrucks({ departed_at: departure }),
            //     getDrivers({ departed_at: departure }),
            //     getGpsDevices({ departed_at: departure }),
            // ])

            setStep(2)
        } catch (err) {
            toast.error("Failed to load resources", {
                description: "Please try again",
            })
            console.error("Failed to fetch form data", err)
        }
    }

    const handleAddStop = (store) => {
        if (store && !selectedStops.find(s => s.store_id === store.id)) {
            const newStop = {
                store_id: store.id,
                name: store.name,
                longitude: store.longitude,
                latitude: store.latitude,
            }
            setSelectedStops(prev => [...prev, newStop])
            setValue("delivery_stops", [...selectedStops, newStop])
        }
    }

    const handleRemoveStop = (index) => {
        const updated = selectedStops.filter((_, i) => i !== index)
        setSelectedStops(updated)
        setValue("delivery_stops", updated)
    }

    const onSubmit = async (data) => {
        try {
            const payload = {
                truck: data.truck,
                gps_device: data.gps_device,
                driver: data.driver,
                delivery_stops: selectedStops.map(stop => ({
                    store_id: stop.store_id,
                    longitude: stop.longitude,
                    latitude: stop.latitude,
                    eta: null
                })),
                departure: data.departure_at
            }

            await addTrip(payload).unwrap()

            toast.success("Trip dispatched successfully", {
                description: `Trip has been ${isEdit ? 'updated' : 'created'}.`,
            })

            reset()
            setSelectedStops([])
            setStep(1)
            onClose(false)
        } catch (err) {
            toast.error("Failed to dispatch trip", {
                description: err?.data?.message || "Please try again",
            })
            console.error(err)
        }
    }

    // const trucks = trucksData?.data?.trucks || []
    // const drivers = driversData?.data?.drivers || []
    // const devices = devicesData?.data?.gpsDevices || []
    // const stores = storesData?.data?.stores || []

    return (
        <Sheet open={open} onOpenChange={onClose}>
            {!isEdit && <CreateFormSheetTrigger text="Dispatch Trip" />}

            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
                <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                    <SheetHeader className="border-b border-gray-200 px-4 sm:px-6 pt-5 pb-4">
                        <SheetTitle>
                            {isEdit ? "Edit trip" : "Dispatch new trip"}
                        </SheetTitle>
                        <SheetDescription>
                            {isEdit
                                ? "Update trip details"
                                : "Select a truck, add store stops, and schedule departure"}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-3 pb-3 sm:px-6 sm:py-4">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>
                                    {/* Step 1: Departure Time */}
                                    {step === 1 && (
                                        <div className="flex flex-col gap-4">
                                            <Field>
                                                <FieldLabel>
                                                    Scheduled departure <span className="text-red-500">*</span>
                                                </FieldLabel>
                                                <Input
                                                    type="datetime-local"
                                                    {...register("departure_at")}
                                                    className="text-sm"
                                                />
                                                <FieldDescription className="text-xs">
                                                    Leave blank to dispatch immediately
                                                </FieldDescription>
                                                {errors.departure_at && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.departure_at.message}
                                                    </p>
                                                )}
                                            </Field>

                                            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-md px-3 py-2.5">
                                                <AlertCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
                                                <p className="text-xs text-blue-700 leading-relaxed">
                                                    Available trucks, drivers, and GPS devices will be fetched based on the selected departure time.
                                                </p>
                                            </div>

                                            <Button
                                                type="button"
                                                onClick={handleContinue}
                                                className="bg-maroon hover:bg-maroon-dark text-white"
                                            >
                                                Continue
                                            </Button>
                                        </div>
                                    )}

                                    {/* Step 2: Trip Details */}
                                    {step === 2 && (
                                        <>
                                            {/* Back Button */}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setStep(1)}
                                                className="w-fit mb-2"
                                            >
                                                <ChevronLeft size={14} /> Back to date
                                            </Button>

                                            {/* Source DC */}
                                            <Field>
                                                <FieldLabel>Source data center</FieldLabel>
                                                <p className="text-sm font-semibold text-gray-700">
                                                    Pune Warehouse DC
                                                </p>
                                                <FieldDescription className="text-xs">
                                                    Automatically set from your account
                                                </FieldDescription>
                                            </Field>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {/* Truck */}
                                                <Field>
                                                    <FieldLabel>
                                                        Truck <span className="text-red-500">*</span>
                                                    </FieldLabel>
                                                    <Controller
                                                        name="truck"
                                                        control={control}
                                                        render={({ field }) => (
                                                           <SearchDropdown
    placeholder="Search truck..."
    value={field.value}
    onChange={field.onChange}
    displayKey="registration_no"
    fetchHook={useGetTrucksQuery}
    extraParams={{ departed_at: departureAt }}
    apiRes="trucks"
/>
                                                        )}
                                                    />
                                                    <FieldDescription className="text-xs">
                                                        Only idle trucks are shown
                                                    </FieldDescription>
                                                    {errors.truck && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {errors.truck.message}
                                                        </p>
                                                    )}
                                                </Field>

                                                {/* GPS Device */}
                                                <Field>
                                                    <FieldLabel>
                                                        GPS Device <span className="text-red-500">*</span>
                                                    </FieldLabel>
                                                    <Controller
                                                        name="gps_device"
                                                        control={control}
                                                        render={({ field }) => (
                                                           <SearchDropdown
    placeholder="Search GPS..."
    value={field.value}
    onChange={field.onChange}
    displayKey="device_id"
    fetchHook={useGetGpsDevicesQuery}
    extraParams={{ departed_at: departureAt }}
    apiRes="gpsDevices"
/>
                                                        )}
                                                    />
                                                    {errors.gps_device && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {errors.gps_device.message}
                                                        </p>
                                                    )}
                                                </Field>
                                            </div>

                                            {/* Driver */}
                                            <Field>
                                                <FieldLabel>
                                                    Driver <span className="text-red-500">*</span>
                                                </FieldLabel>
                                                <Controller
                                                    name="driver"
                                                    control={control}
                                                    render={({ field }) => (
                                                       <SearchDropdown
    placeholder="Search driver..."
    value={field.value}
    onChange={field.onChange}
    displayKey="driver_name"
    secondaryKey="driver_phone"
    fetchHook={useGetDriversQuery}
    extraParams={{ departed_at: departureAt }}
    apiRes="drivers"
/>
                                                    )}
                                                />
                                                {errors.driver && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.driver.message}
                                                    </p>
                                                )}
                                            </Field>

                                            {/* Delivery Stops */}
                                            <Field>
                                                <FieldLabel>
                                                    Delivery stops <span className="text-red-500">*</span>
                                                </FieldLabel>
                                                <div className="flex gap-2">
                                                    <SearchDropdown
    placeholder="Search store..."
    onChange={handleAddStop}
    displayKey="name"
    secondaryKey="city"
    fetchHook={useGetStoresQuery}
    apiRes="stores"
/>
                                                    <Button
                                                        type="button"
                                                        onClick={() => {
                                                            // Trigger from dropdown selection
                                                        }}
                                                        className="bg-maroon hover:bg-maroon-dark text-white shrink-0"
                                                        disabled
                                                    >
                                                        <Plus size={14} />
                                                    </Button>
                                                </div>
                                                <FieldDescription className="text-xs">
                                                    Add stops in order — drag to reorder
                                                </FieldDescription>
                                                <StopsList stops={selectedStops} onRemove={handleRemoveStop} />
                                                {errors.delivery_stops && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.delivery_stops.message}
                                                    </p>
                                                )}
                                            </Field>
                                        </>
                                    )}
                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </div>

                    {step === 2 && (
                        <SheetFooter className="flex flex-col sm:flex-row gap-2 items-center w-full border-t border-gray-200 px-4 sm:px-6 py-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-1/2 bg-maroon hover:bg-maroon-dark"
                            >
                                {isLoading ? "Dispatching..." : "Dispatch Trip"}
                                <Route className="ml-2" />
                            </Button>

                            <SheetClose className="w-full sm:w-1/2" asChild>
                                <Button variant="outline" className="w-full">
                                    Cancel
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    )}
                </form>
            </SheetContent>
        </Sheet>
    )
}