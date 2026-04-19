import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Store } from "lucide-react"
import { useEffect } from "react"
import { useAddStoreMutation, useUpdateStoreMutation } from "@/lib/features/stores/storeApi"
import { Controller, useForm } from "react-hook-form"
import { addressV, cityV, } from "@/validations/validations"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getCoordinatesFromAddress } from "@/lib/utils/getCoordinatesFromAddress"
import AssignManagerSelect from "../super-admin/manage-dcs/AssignManagerSelect"


const storeSchema = z.object({
    brand_id: z.string().min(1, "Brand is required"),
    name: z.string().min(2, "Store name must be at least 2 characters").max(100, "Store name is too long"),
    city: cityV,
    address: addressV,
    state: z.string().default("Maharashtra"),
    status: z.enum(["active", "inactive"]).optional(),
    store_code: z.string()
        .length(15, { message: "GSTIN must be exactly 15 characters" })
});


export default function StoreForm({ store, brands, open, onClose, managers, managerSearch, loadingManagers, setManagerSearch }) {
    const [addStore, { isLoading }] = useAddStoreMutation();
    const [updateStore, { isLoading: isUpdating }] = useUpdateStoreMutation();

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            brand_id: undefined,
            name: "",
            address: "",
            city: "",
            state: "Maharashtra",
            status: "active",
            store_code: ""
        },
    });


    useEffect(() => {
        if (store) {
            reset({
                brand_id: store?.brand_id ? String(store.brand_id) : undefined,
                name: store?.name || "",
                address: store?.address || "",
                city: store?.city || "",
                state: "Maharashtra",
                status: store?.status || "active",
                store_code: store?.store_code || ""
            });
        } else {
            reset({
                brand_id: undefined,
                name: "",
                address: "",
                city: "",
                state: "Maharashtra",
                status: "active",
                store_code: ""
            });
        }
    }, [store, reset]);

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
            onClose?.(false)
        }
    }, [isSubmitSuccessful, reset]);

    const selectedStatus = watch('status')

    const onSubmit = async (data) => {
        try {
            const { lat, lng } = await getCoordinatesFromAddress(data.address);

            const payload = {
                ...data,
                latitude: lat,
                longitude: lng,
            };
            if (store) {
                await updateStore({ id: store.id, ...payload }).unwrap();
            } else {
                await addStore(payload).unwrap();
            }
            onClose(false)
        } catch (err) {
            console.error(err);

        }
    }

    return (
        <Sheet direction="right" open={open} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
                <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                    <SheetHeader className="border-b border-gray-200">
                        <SheetTitle> {store ? "Edit store" : "Add new store"}</SheetTitle>
                        <SheetDescription>
                            {store
                                ? "Update store details"
                                : "Register a retail store and assign it to a brand"}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Brand */}
                                        <Field>
                                            <FieldLabel>Brand <span className="text-red-500">*</span></FieldLabel>
                                            <Controller
                                                name="brand_id"
                                                control={control}
                                                rules={{ required: "Brand is required" }}
                                                render={({ field }) => (
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select brand..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white border shadow-md">
                                                            <SelectGroup>
                                                                <SelectLabel>Brands</SelectLabel>
                                                                {
                                                                    brands?.map(b => (
                                                                        <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                                                                    ))
                                                                }
                                                                {/* <SelectItem value="Mumbai">Zudio</SelectItem>
                                                                <SelectItem value="Nashik">Tata Cliq</SelectItem>
                                                                <SelectItem value="Nagpur">Tanishq</SelectItem>
                                                                <SelectItem value="Kolhapur">Croma</SelectItem> */}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />

                                        </Field>

                                        {/* Store Code */}
                                        <Field>
                                            <FieldLabel>GSTIN (Store code) <span className="text-red-500">*</span></FieldLabel>
                                            <Input
                                                name="store_code"
                                                {...register("store_code", {
                                                    required: "GSTIN code is required",
                                                })}
                                                placeholder="27ABCDE1234F1Z5"
                                                className="placeholder:text-sm text-sm sm:text-md"
                                            />
                                            {/* <FieldDescription className="text-xs">
                                            Used to uniquely identify a store
                                        </FieldDescription> */}
                                            {errors.store_code && (
                                                <p className="text-red-500 text-xs">
                                                    {errors.store_code.message}
                                                </p>
                                            )}
                                        </Field>

                                    </div>

                                    {/* Store name + city */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Field className="basis-[65%]">
                                            <FieldLabel>Store name <span className="text-red-500">*</span></FieldLabel>
                                            <Input
                                                name="name"
                                                placeholder="Westside"
                                                {...register("name", {
                                                    required: "Store name is required",
                                                })}
                                                className="w-full placeholder:text-sm text-sm sm:text-md"
                                            />

                                            {errors.name && (
                                                <p className="text-red-500 text-xs">
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </Field>
                                        <Field className="basis-[35%]">
                                            <FieldLabel>
                                                City <span className="text-red-500">*</span>
                                            </FieldLabel>

                                            <Controller
                                                name="city"
                                                control={control}
                                                rules={{ required: "City is required" }}
                                                render={({ field }) => (
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select city..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white border shadow-md">
                                                            <SelectGroup>
                                                                <SelectLabel>Cities</SelectLabel>
                                                                <SelectItem value="Pune">Pune</SelectItem>
                                                                <SelectItem value="Mumbai">Mumbai</SelectItem>
                                                                <SelectItem value="Nashik">Nashik</SelectItem>
                                                                <SelectItem value="Nagpur">Nagpur</SelectItem>
                                                                <SelectItem value="Kolhapur">Kolhapur</SelectItem>
                                                                <SelectItem value="Amravati">Amravati</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />

                                            {errors.city && (
                                                <p className="text-red-500 text-xs">
                                                    {errors.city.message}
                                                </p>
                                            )}
                                        </Field>
                                    </div>

                                    {/* Full address */}
                                    <Field>
                                        <FieldLabel>Full address <span className="text-red-500">*</span></FieldLabel>
                                        <Input
                                            name="address"
                                            {...register("address", {
                                                required: "Address is required",
                                            })}
                                            placeholder="Shop no., mall/building, area, pincode"
                                            className="placeholder:text-sm text-sm sm:text-md"
                                        />
                                        <FieldDescription className="text-xs">
                                            Used to place the store pin on the map and compute geofence
                                        </FieldDescription>
                                        {errors.address && (
                                            <p className="text-red-500 text-xs">
                                                {errors.address.message}
                                            </p>
                                        )}
                                    </Field>

                                    {/* Status */}
                                    {
                                        store && (
                                            <Field>
                                                <FieldLabel>Status</FieldLabel>
                                                <Select value={selectedStatus}
                                                    onValueChange={(val) => setValue("status", val)}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border shadow-md">
                                                        <SelectGroup>
                                                            <SelectLabel>Status</SelectLabel>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="inactive">Inactive</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                <FieldDescription className="text-xs">
                                                    Inactive stores won't appear in new trip assignments.
                                                </FieldDescription>
                                            </Field>
                                        )
                                    }


                                    <Field>
                                        <FieldLabel>
                                            Assign Manager <span className="text-red-500">*</span>
                                        </FieldLabel>

                                        <AssignManagerSelect
                                            name={'store_manager'}
                                            managers={managers}
                                            control={control}
                                            errors={errors}
                                            setManagerSearch={setManagerSearch}
                                            managerSearch={managerSearch}
                                            loadingManagers={loadingManagers}
                                        />
                                    </Field>




                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </div>

                    <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200">
                        <Button type="submit" disabled={isLoading} className="basis-1/2 bg-maroon hover:bg-maroon-dark">
                            {/* {isEdit ? "Save Changes" : "Add Store"}  */}
                            {
                                store
                                    ? (isUpdating ? "Updating..." : "Update Store")
                                    : (isLoading ? "Adding..." : "Add Store")
                            }
                            <Store className="ml-1" size={15} />
                        </Button>
                        <SheetClose className="basis-1/2" asChild>
                            <Button className="w-full" variant="outline">Cancel</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}