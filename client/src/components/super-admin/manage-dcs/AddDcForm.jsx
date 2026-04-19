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
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import { Plus, Warehouse } from "lucide-react"
import CreateFormSheetTrigger from "@/components/CreateFormSheetTrigger"
import { useAddDcMutation, useUpdateDcMutation } from "@/lib/features/dcs/dcApi"
import { Controller, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { addressV, cityV, emailV, fullNameV, phoneV } from "@/validations/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import AssignManagerSelect from "./AssignManagerSelect"


const dcSchema = z.object({
    name: z.string().min(2, "DC name must be at least 2 characters").max(100, "DC name is too long"),
    city: cityV,
    address: addressV,
    dc_manager: z.string().min(1, "Manager is required"),
    status: z
        .enum(["active", "inactive"])
        .default("active").optional(),
})

export default function AddDCForm({ dc, open, onClose, managers, managerSearch, loadingManagers, setManagerSearch }) {

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
        resolver: zodResolver(dcSchema),
        defaultValues: {
            name: "",
            city: "",
            address: "",
            dc_manager: "",
            status: "active",
        }
    })


    useEffect(() => {
        if (dc) {
            reset({
                name: dc.dc_name || "",
                city: dc.city || "",
                state: "Maharashtra",
                address: dc.address || "",
                dc_manager: dc.dc_manager || "",
                status: dc.status || "active",
            });
        } else {
            reset({
                name: "",
                city: "",
                state: "Maharashtra",
                address: "",
                dc_manager: "",
                status: "active",
            });
        }
    }, [dc, reset]);


    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
            onClose?.(false)
        }
    }, [isSubmitSuccessful, reset]);

    const selectedCity = watch('city')
    const selectedStatus = watch('status')

    const onSubmit = async (data) => {
        console.log("on submit", data);
        //get coordinates from address here
        const payload = {state: "Maharashtra", ...data}
        try {
            if (dc) {
                await updateDc({ id: dc.id, ...payload }).unwrap();
            } else {
                await addDc(payload).unwrap();
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
                        <SheetTitle>{dc ? "Edit warehouse" : 'Add new warehouse'}</SheetTitle>
                        <SheetDescription>
                            {
                                dc ?
                                    "Update warehouse details"
                                    :
                                    "Register a new data center and assign it to a brand"
                            }

                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-3 pb-3 sm:p-4">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>

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
                                                <p className="text-red-500 text-xs">
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
                                            <p className="text-red-500 text-xs">
                                                {errors.address.message}
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

                                    <Field>
                                        <FieldLabel>
                                            Assign Manager <span className="text-red-500">*</span>
                                        </FieldLabel>

                                        <AssignManagerSelect
                                            name={'dc_manager'} 
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