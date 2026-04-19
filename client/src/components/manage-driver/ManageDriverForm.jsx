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
import { BookUser } from "lucide-react"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { useAddDriverMutation, useUpdateDriverMutation } from "@/lib/features/drivers/driverApi"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { LICENCE_CLASSES } from "@/constants/constant"
import { z } from "zod";
import { firstNameV, lastNameV, phoneV } from "@/validations/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSelector } from "react-redux"
import { selectUser } from "@/lib/features/auth/authSlice"

const DRIVER_STATUS = {
    AVAILABLE: "available",
    INACTIVE: "inactive",
    ON_TRIP: "on_trip"
};

export const driverSchema = z.object({
    first_name: firstNameV,
    last_name: lastNameV,
    phone_number: phoneV,
    licence_no: z
        .string()
        .min(5, "Licence number is required"),
    licence_class: z.string().min(1, "Licence class is required"),
    licence_expiry: z
        .string()
        .min(1, "Licence expiry is required")
        .refine((date) => new Date(date) > new Date(), {
            message: "Licence expiry must be in the future",
        }),
   status: z.enum(["available", "inactive"]).optional()
});


const normalizeStatus = (status) => {
    if (!status) return DRIVER_STATUS.AVAILABLE;

    return status.toLowerCase().replace(" ", "_");
};

export default function ManageDriverForm({ driver, open, onClose }) {
    console.log(driver);

    const {user} = useSelector(selectUser);
     const isadmin = user.role === 'super_admin'
    const [addDriver, { isLoading }] = useAddDriverMutation();
    const [updateDriver, { isLoading: isUpdating }] = useUpdateDriverMutation()

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        resolver: zodResolver(driverSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            phone_number: "",
            licence_no: "",
            licence_class: "",
            licence_expiry: "",
             status: DRIVER_STATUS.AVAILABLE
        }
    })


    useEffect(() => {
        if (driver) {
            reset({
                first_name: driver?.first_name || "",
                last_name: driver?.last_name || "",
                phone_number: driver?.phone_number || "",
                licence_no: driver?.licence_no || "",
                licence_class: driver?.licence_class || "",
                licence_expiry: driver?.licence_expiry
                    ? driver.licence_expiry.split("T")[0]
                    : "",
                status: normalizeStatus(driver?.driver_status),
            });
        } else {
            reset({
                first_name: "",
                last_name: "",
                phone_number: "",
                licence_no: "",
                licence_class: "",
                licence_expiry: "",
                status: DRIVER_STATUS.AVAILABLE

            });
        }
    }, [driver, reset]);

    const licenceClassValue = watch("licence_class");
    const selectedStatus = watch('status')


    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);


    const onSubmit = async (data) => {
        try {
            console.log(data);
            const payload = {
                first_name: data.first_name,
                last_name: data.last_name,
                phone_number: data.phone_number,
                licence_no: data.licence_no,
                licence_class: data.licence_class,
                licence_expiry: data.licence_expiry,
                status: data.status || "available"
            };
            if (driver) {
                await updateDriver({ id: driver.id, ...payload }).unwrap();
            } else {
                await addDriver(payload).unwrap();
            }
            onClose(false)
        } catch (err) {
            console.error(err)
        }
    }

    const onError = (errors) => {
        console.log("FORM ERRORS:", errors);
    };

    return (

        <Sheet direction="right" open={open} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
                <form onSubmit={handleSubmit(onSubmit, onError)} className="h-full flex flex-col">
                    <SheetHeader className="border-b border-gray-200">
                        <SheetTitle>{driver ? "Edit driver" : "Create new driver"}</SheetTitle>
                        <SheetDescription>{driver ? "Update driver details" : "Add driver details and licence information"}</SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Field>
                                            <FieldLabel>First name</FieldLabel>
                                            <Input 
                                            id="first_name"
                                                type="text"
                                                {...register("first_name")} 
                                                placeholder="Rahul"
                                                className="placeholder:text-sm text-sm sm:text-md"/>
                                            {errors.first_name && (
                                                <p className="text-red-500 text-[10px] ml-1">{errors.first_name.message}</p>
                                            )}
                                        </Field>

                                        <Field>
                                            <FieldLabel>Last name</FieldLabel>
                                            <Input 
                                            id="last_name"
                                                type="text"
                                            {...register("last_name")} 
                                            placeholder="Sharma"
                                                className="placeholder:text-sm text-sm sm:text-md"
                                            />
                                            {errors.last_name && (
                                                <p className="text-red-500 text-[10px] ml-1">{errors.last_name.message}</p>
                                            )}
                                        </Field>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Field>
                                            <FieldLabel>Phone number</FieldLabel>
                                            <Input {...register("phone_number")} placeholder="+91 98XXX XXXXX" className="placeholder:text-sm text-sm sm:text-md" />
                                            {errors.phone_number && (
                                                <p className="text-red-500 text-[10px] ml-1">{errors.phone_number.message}</p>
                                            )}
                                        </Field>
                                        <Field>
                                            <FieldLabel>Licence number</FieldLabel>
                                            <Input {...register("licence_no")} placeholder="MH1220190012345" className="placeholder:text-sm text-sm sm:text-md" />
                                            {errors.licence_no && (
                                                <p className="text-red-500 text-[10px] ml-1">{errors.licence_no.message}</p>
                                            )}
                                        </Field>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                        <Field>
                                            <FieldLabel>Licence class</FieldLabel>
                                            <Select value={licenceClassValue} onValueChange={(val) => setValue("licence_class", val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select class" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border shadow-md">
                                                    <SelectGroup>
                                                        <SelectLabel>Class</SelectLabel>
                                                        {/* <SelectItem value="all_licences">All classes</SelectItem> */}
                                                        {LICENCE_CLASSES.map(c => (
                                                            <SelectItem key={c.type} value={c.type}>{c.full}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {errors.licence_class && (
                                                <p className="text-red-500 text-[10px] ml-1">{errors.licence_class.message}</p>
                                            )}
                                        </Field>

                                        <Field>
                                            <FieldLabel>Licence expiry</FieldLabel>
                                            <Input {...register("licence_expiry")} min={new Date().toISOString().split("T")[0]} type="date" className="text-xs" />
                                            {errors.licence_expiry && (
                                                <p className="text-red-500 text-[10px] ml-1">{errors.licence_expiry.message}</p>
                                            )}
                                        </Field>
                                    </div>


                                    {/* Status */}
                                    {
                                        driver && normalizeStatus(driver?.driver_status) !== DRIVER_STATUS.ON_TRIP && isadmin && (
                                            <Field>
                                                <FieldLabel>Status</FieldLabel>

                                                <Select
                                                    value={selectedStatus}
                                                    onValueChange={(val) =>
                                                        setValue("status", val, { shouldValidate: true })
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>

                                                    <SelectContent className="bg-white border shadow-md">
                                                        <SelectGroup>
                                                            <SelectLabel>Status</SelectLabel>

                                                            <SelectItem value="available">Available</SelectItem>
                                                            <SelectItem value="inactive">Inactive</SelectItem>

                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>

                                                {/* 🔴 Restriction message */}
                                                {driver?.driver_status === "On trip" && (
                                                    <p className="text-[10px] ml-1 text-red-500">
                                                        Cannot change status while driver is on a trip
                                                    </p>
                                                )}
                                            </Field>
                                        )
                                    }



                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </div>

                    <SheetFooter className="flex flex-col sm:flex-row gap-2 items-center w-full border-t border-gray-200">
                        <Button type="submit" className='w-full sm:w-1/2 bg-maroon hover:bg-maroon-dark'>
                            {
                                driver
                                    ? (isUpdating ? "Updating..." : "Update Driver")
                                    : (isLoading ? "Adding..." : "Add Driver")
                            }
                            <BookUser /></Button>
                        <SheetClose className='basis-1/2' asChild>
                            <Button className="w-full" variant="outline">Cancel</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}