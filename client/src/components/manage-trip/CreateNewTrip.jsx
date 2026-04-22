// CreateTripModal.jsx (Complete - Works for Add & Edit)
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
    useGetTrucksQuery,
    useGetDriversQuery,
    useGetGpsDevicesQuery,
    useGetStoresQuery,
} from "@/lib/features/trips/tripApi"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { selectUser } from "@/lib/features/auth/authSlice"
import { format } from "date-fns"


// ─── Validation Schema ───────────────────────────────────────────────────────
const TRIP_SCHEMA = z.object({
    departure_at: z.string().min(1, "Departure time is required"),
    truck: z.string().min(1, "Please select a truck"),
    // gps_device: z.string().min(1, "Please select a GPS device"),
    driver: z.string().min(1, "Please select a driver"),
    delivery_stops: z.array(z.object({
        store_id: z.string(),
        longitude: z.number(),
        latitude: z.number(),
    })).min(1, "Add at least one delivery stop"),
})

// ─── Stops List Component ────────────────────────────────────────────────────
function StopsList({ stops, onRemove }) {
    console.log(stops);

    if (stops.length === 0) return (
        <p className="text-xs text-gray-400 py-2 italic">
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
                    {/* <GripVertical size={14} className="text-gray-400 cursor-grab" /> */}
                    <span className="text-xs font-medium text-gray-500 w-5">{index + 1}.</span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{stop.name}</p>
                        {stop.address && (
                            <p className="text-[10px] text-gray-500">{stop.address}</p>
                        )}
                    </div>
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
export default function CreateTripModal({ truck, open, onClose }) {
    const isEdit = !!truck
    console.log("isEdit", truck);


    const { user } = useSelector(selectUser)
    const [step, setStep] = useState(1)
    const [resourcesFetched, setResourcesFetched] = useState(false)

    const [addTrip, { isLoading }] = useAddTripMutation()

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
            // gps_device: "",
            driver: "",
            delivery_stops: []
        },
    })

    const departureAt = watch("departure_at")
    const selectedTruck = watch("truck")
    const selectedDriver = watch("driver");
    const stops = watch("delivery_stops") || [];
    // const selectedGpsDevice = watch("gps_device")

    console.log("selectedDriver", selectedDriver, selectedTruck);


    // Pre-fill form when editing
    useEffect(() => {
        if (truck && open) {
            const departureTime = truck.scheduled_at
                ? format(new Date(truck.scheduled_at), "yyyy-MM-dd'T'HH:mm")
                : "";

            // Parse stops from truck
            const stops = truck.stops?.map(stop => ({
                store_id: stop.store_id,
                name: stop.store_name,
                address: stop.store_address,
                longitude: stop.longitude || 0,
                latitude: stop.latitude || 0,
            })) || []

            reset({
                departure_at: departureTime,
                truck: truck.truck_id || "",
                // gps_device: truck.device_id || "",
                driver: truck.driver_id || "",
                delivery_stops: stops
            })

            // setSelectedStops(stops)
            setStep(2)
            setResourcesFetched(true)
        } else {
            reset({
                departure_at: "",
                truck: "",
                // gps_device: "",
                driver: "",
                delivery_stops: []
            })
            // setSelectedStops([])
            setStep(1)
            setResourcesFetched(false)
        }
    }, [truck, open, reset])

    // Continue to step 2
    const handleContinue = () => {
        let departure = departureAt

        // If empty, use current datetime
        if (!departure) {
            departure = new Date().toISOString().slice(0, 16)
            setValue("departure_at", departure)
        }

        setStep(2)
        setResourcesFetched(true)
    }

    const handleAddStop = (store) => {
        if (!store) return;

        const current = watch("delivery_stops") || [];

        if (current.some(s => s.store_id === store.id)) return;

        const updated = [
            ...current,
            {
                store_id: store.id,
                name: store.name,
                address: store.address,
                longitude: Number(store.longitude),
                latitude: Number(store.latitude),
            }
        ];

        setValue("delivery_stops", updated, { shouldValidate: true });
    }

    const handleRemoveStop = (index) => {
        const current = watch("delivery_stops") || [];

        const updated = current.filter((_, i) => i !== index);

        setValue("delivery_stops", updated, { shouldValidate: true });
    }

    console.log("selectedStops", stops);


    const onSubmit = async (data) => {
        // Validate stops
        if (stops.length === 0) {
            toast.error("Validation error", {
                description: "Please add at least one delivery stop",
            })
            return
        }

        try {
            const payload = {
                truck: data.truck,
                // gps_device: data.gps_device,
                driver: data.driver,
                delivery_stops: data.delivery_stops,
                departure: data.departure_at
            }
            console.log(payload);

            await addTrip(payload).unwrap()

            toast.success("Trip dispatched successfully", {
                description: `Trip has been ${isEdit ? 'updated' : 'created'}.`,
            })

            reset()
            // setSelectedStops([])
            setStep(1)
            setResourcesFetched(false)
            onClose(false)
        } catch (err) {
            toast.error("Failed to dispatch trip", {
                description: err?.data?.message || "Please try again",
            })
            console.error(err)
        }
    }

    const onError = (errors) => {
        console.log("FORM ERRORS:", errors);
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            {/* {!isEdit && <CreateFormSheetTrigger text="Dispatch Trip" />} */}

            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
                <form onSubmit={handleSubmit(onSubmit, onError)} className="h-full flex flex-col">
                    <SheetHeader className="border-b border-gray-200 px-4 sm:px-6 pt-5 pb-4">
                        <SheetTitle>
                            {isEdit ? "Edit trip" : "Dispatch new trip"}
                        </SheetTitle>
                        <SheetDescription>
                            {isEdit
                                ? "Update trip details and stops"
                                : "Select a truck, add store stops, and schedule departure"}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-3 pb-3 sm:p-4">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup className="gap-3">
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
                                                onClick={() => {
                                                    setStep(1)
                                                    setResourcesFetched(false)
                                                }}
                                                className="w-fit mb-2"
                                            >
                                                <ChevronLeft size={14} /> Back to date
                                            </Button>

                                            {/* Source DC */}
                                            <Field>
                                                <FieldLabel>Source data center</FieldLabel>
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {user.source_dc_name}
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
                                                                fetchHook={useGetTrucksQuery}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                displayKey="registration_no"
                                                                secondaryKey="model"
                                                                valueKey="id"
                                                                apiRes="trucks"
                                                                extraParams={{ departed_at: departureAt }}
                                                                initialSelected={
                                                                    isEdit && truck
                                                                        ? {
                                                                            id: truck.truck_id,
                                                                            registration_no: truck.registration_no,
                                                                            model: truck.model
                                                                        }
                                                                        : null
                                                                }
                                                            />
                                                        )}
                                                    />
                                                    <FieldDescription className="text-xs">
                                                        Only available trucks are shown
                                                    </FieldDescription>
                                                    {errors.truck && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {errors.truck.message}
                                                        </p>
                                                    )}
                                                </Field>

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
                                                                fetchHook={useGetDriversQuery}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                displayKey="driver_name"
                                                                secondaryKey="phone_number"
                                                                valueKey="id"
                                                                apiRes="drivers"
                                                                extraParams={{ departed_at: departureAt }}
                                                                initialSelected={
                                                                    isEdit && truck
                                                                        ? {
                                                                            id: truck.driver_id,
                                                                            driver_name: truck.driver_name,
                                                                            phone_number: truck.phone_number
                                                                        }
                                                                        : null
                                                                }
                                                            />
                                                        )}
                                                    />
                                                    {errors.driver && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {errors.driver.message}
                                                        </p>
                                                    )}
                                                </Field>

                                                {/* GPS Device */}
                                                {/* <Field>
                                                    <FieldLabel>
                                                        GPS Device <span className="text-red-500">*</span>
                                                    </FieldLabel>
                                                    <Controller
                                                        name="gps_device"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <SearchDropdown
                                                                placeholder="Search GPS..."
                                                                fetchHook={useGetGpsDevicesQuery}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                displayKey="device_id"
                                                                secondaryKey="imei"
                                                                valueKey="id"
                                                                apiRes="gps_devices"
                                                                extraParams={{ departed_at: departureAt }}
                                                            />
                                                        )}
                                                    />
                                                    {errors.gps_device && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {errors.gps_device.message}
                                                        </p>
                                                    )}
                                                </Field> */}
                                            </div>



                                            {/* Delivery Stops */}
                                            <Field>
                                                <FieldLabel>
                                                    Delivery stops <span className="text-red-500">*</span>
                                                </FieldLabel>
                                                <div className="flex gap-2">
                                                    <div className="flex-1">
                                                        <SearchDropdown
                                                            placeholder="Search store..."
                                                            fetchHook={useGetStoresQuery}
                                                            onChange={handleAddStop}
                                                            displayKey="name"
                                                            secondaryKey="address"
                                                            valueKey="id"
                                                            apiRes="stores"
                                                            clearOnSelect
                                                            isStore
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        className="bg-maroon hover:bg-maroon-dark text-white shrink-0"
                                                        disabled
                                                    >
                                                        <Plus size={14} />
                                                    </Button>
                                                </div>
                                                <FieldDescription className="text-xs">
                                                    Select stores to add as delivery stops
                                                </FieldDescription>
                                                <StopsList stops={stops} onRemove={handleRemoveStop} />
                                                {stops.length === 0 && (
                                                    <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
                                                        <AlertCircle size={12} />
                                                        At least one stop is required
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
                                disabled={isLoading || stops.length === 0}
                                className="w-full sm:w-1/2 bg-maroon hover:bg-maroon-dark"
                            >
                                {isLoading
                                    ? "Dispatching..."
                                    : isEdit
                                        ? "Update Trip"
                                        : "Dispatch Trip"}
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