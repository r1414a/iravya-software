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
import { Plus, Warehouse } from "lucide-react"
import CreateFormSheetTrigger from "@/components/CreateFormSheetTrigger"
import { useAddDcMutation, useUpdateDcMutation } from "@/lib/features/dcs/dcApi"
import { Controller, useForm } from "react-hook-form"
import { useEffect } from "react"

export default function AddDCForm({ dc = null, open, onClose }) {

    // console.log(dc);

    const [addDc, { isLoading }] = useAddDcMutation()
    const [updateDc, { isLoading: isUpdating }] = useUpdateDcMutation();

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        defaultValues: {
            name: dc?.dc_name || "",
            city: dc?.city || "",
            state: "Maharashtra",
            address: dc?.address || "",
            contact_name: dc?.dc_manager_name || "",
            contact_phone: dc?.dc_manager_phone || "",
            contact_email: dc?.dc_manager_email || "",
            status: dc?.status || "active",
        },
    })


    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
            // onClose?.(false)
        }
    }, [isSubmitSuccessful, reset]);

    const selectedCity = watch('city')
    const selectedStatus = watch('status')

    const onSubmit = async (data) => {
        console.log(data);

        try {
            // const payload = {
            //     name: data.name,
            //     city: data.city,
            //     address: data.address,
            //     dc_manager_name: data.contact_name,
            //     dc_manager_phone: data.contact_phone,
            //     dc_manager_email: data.contact_email,
            //     status: data.status,
            // };

            if (dc) {
                await updateDc({ id: dc.id, ...data }).unwrap();
            } else {
                await addDc(data).unwrap();
            }

        } catch (err) {
            console.error(err);

        }
    }

    return (
        <Sheet direction="right" open={open} onOpenChange={onClose}>
            {
                dc ?
                    null
                    :
                    <CreateFormSheetTrigger text='Add a DC' />
            }

            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
                <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                    <SheetHeader className="border-b border-gray-200">
                        <SheetTitle>Add new warehouse</SheetTitle>
                        <SheetDescription>
                            Register a new data center and assign it to a brand
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-3 pb-3 sm:p-4">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>

                                    {/* Brand */}
                                    {/* <Field>
                                    <FieldLabel>Brand <span className="text-red-500">*</span></FieldLabel>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select brand..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border shadow-md">
                                            <SelectGroup>
                                                <SelectLabel>Brands</SelectLabel>
                                                <SelectItem value="tata_westside">Tata Westside</SelectItem>
                                                <SelectItem value="zudio">Zudio</SelectItem>
                                                <SelectItem value="tata_cliq">Tata Cliq</SelectItem>
                                                <SelectItem value="tanishq">Tanishq</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FieldDescription className="text-xs">
                                        This DC will only manage trucks and trips for this brand
                                    </FieldDescription>
                                </Field> */}

                                    {/* DC name + city */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Field>
                                            <FieldLabel>DC name <span className="text-red-500">*</span></FieldLabel>
                                            <Input
                                                {...register("name", {
                                                    required: "DC name is required",
                                                })}
                                                placeholder="Pune DC"
                                                className="placeholder:text-sm text-sm sm:text-md"
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </Field>

                                        <Field>
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
                </SelectGroup>
            </SelectContent>
        </Select>
    )}
/>

                                            {errors.city && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.city.message}
                                                </p>
                                            )}
                                        </Field>

                                        {/* <Field>
                                            <FieldLabel>City <span className="text-red-500">*</span></FieldLabel>
                                            <Select
                                                value={selectedCity}
                                                onValueChange={(val) => setValue("city", val)}
                                            >
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
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </Field> */}
                                    </div>

                                    {/* Full address */}
                                    <Field>
                                        <FieldLabel>Full address <span className="text-red-500">*</span></FieldLabel>
                                        <Input
                                            {...register("address", {
                                                required: "Address is required",
                                            })}
                                            placeholder="Plot no., area, pincode"
                                            className="placeholder:text-sm text-sm sm:text-md"
                                        />
                                        <FieldDescription className="text-xs">
                                            Used to geocode the DC location on the map
                                        </FieldDescription>
                                        {errors.address && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.address.message}
                                            </p>
                                        )}
                                    </Field>

                                    {/* Geofence radius */}
                                    {/* <Field>
                                    <FieldLabel>Geofence radius (metres)</FieldLabel>
                                    <Input type="number" placeholder="e.g. 300" defaultValue={300} />
                                    <FieldDescription className="text-xs">
                                        Truck entering this radius triggers a "returned to DC" event
                                    </FieldDescription>
                                </Field> */}

                                    {/* Contact person */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Field>
                                            <FieldLabel>Operator name</FieldLabel>
                                            <Input
                                                {...register("contact_name")}
                                                placeholder="e.g. Suresh Pawar"
                                                className="placeholder:text-sm text-sm sm:text-md"
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Operator phone</FieldLabel>
                                            <Input
                                                {...register("contact_phone", {
                                                    pattern: {
                                                        value: /^[0-9+\-\s()]{10,15}$/,
                                                        message: "Enter a valid phone number",
                                                    },
                                                })}
                                                placeholder="+91 98XXX XXXXX"
                                                className="placeholder:text-sm text-sm sm:text-md"
                                            />
                                            {errors.contact_phone && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.contact_phone.message}
                                                </p>
                                            )}
                                        </Field>
                                    </div>

                                    <Field>
                                        <FieldLabel>Operator email</FieldLabel>
                                        <Input
                                            {...register("contact_email", {
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Enter a valid email",
                                                },
                                            })}
                                            type="email"
                                            placeholder="operator@brand.com"
                                            className="placeholder:text-sm text-sm sm:text-md"
                                        />
                                        <FieldDescription className="text-xs">
                                            A user account with DC operator role will be created for this email
                                        </FieldDescription>
                                        {errors.contact_email && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.contact_email.message}
                                            </p>
                                        )}
                                    </Field>

                                    {
                                        dc &&
                                        <Field>
                                            <FieldLabel>Status</FieldLabel>
                                            <Select
                                                value={selectedStatus}
                                                onValueChange={(val) => setValue("status", val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border shadow-md">
                                                    <SelectGroup>
                                                        <SelectLabel>Status</SelectLabel>
                                                        {/* <SelectItem value="Available" className="text-sm">Available</SelectItem> */}
                                                        <SelectItem value="active" className="text-sm">Active</SelectItem>
                                                        <SelectItem value="inactive" className="text-sm">Inactive</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FieldDescription className="text-xs">
                                                Setting to inactive hides this dc from dispatch forms
                                            </FieldDescription>
                                        </Field>
                                    }


                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </div>


                    <SheetFooter className="flex flex-col sm:flex-row gap-2 items-center w-full border-t border-gray-200">
                        <Button type="submit" disabled={isLoading} className='w-full sm:w-1/2 bg-maroon hover:bg-maroon-dark'>
                        {
                       dc 
  ? (isUpdating ? "Updating..." : "Update Warehouse")
  : (isLoading ? "Adding..." : "Add Warehouse")
                        } 
                        <Warehouse /></Button>
                        <SheetClose className='basis-1/2' asChild>
                            <Button className="w-full" variant="outline">Cancel</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}