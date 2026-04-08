import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
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
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { BookUser } from "lucide-react"
import { useUpdateDriverMutation } from "@/lib/features/drivers/driverApi"
import { useForm } from "react-hook-form"
import { LICENCE_CLASSES } from "@/constants/constant"
import { format, parseISO } from "date-fns"


export default function EditDriverSheet({ driver, open, onClose }) {
    if (!driver) return null

    const { full_name, phone_number, licence_no, licence_class, licence_expiry, driver_status } = driver

    console.log(full_name, phone_number, licence_no, licence_class, licence_expiry, driver_status);

    const [updateDriver, { isLoading }] = useUpdateDriverMutation();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        // resolver: zodResolver(createUserSchema),
        defaultValues: { full_name, phone_number, licence_no, licence_class, licence_expiry: licence_expiry ? format(parseISO(licence_expiry), 'yyyy-MM-dd') : "", driver_status }
    })

    const selectedClass = watch("licence_class")
    const selectedStatus = watch("driver_status")

    const onSubmit = async (data) => {
        try {
            await updateDriver({ id: driver.id, ...data })
        } catch (err) {
            console.error("Error while editing driver.", err);

        }
    }

    return (
        <Sheet open={open} onOpenChange={onClose} direction="right">
            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
                <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                    <SheetHeader className="border-b border-gray-200">
                        <SheetTitle>Edit driver</SheetTitle>
                        <SheetDescription>
                            Update details for {driver.full_name}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>

                                    {/* Name + Phone */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Field>
                                            <FieldLabel>Full name</FieldLabel>
                                            <Input
                                                {...register("full_name")}
                                                placeholder="e.g. Ravi Deshmukh"
                                                className="text-sm"
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Phone number</FieldLabel>
                                            <Input
                                                {...register("phone_number")}
                                                placeholder="+91 98XXX XXXXX"
                                                className="text-sm"
                                            />
                                        </Field>
                                    </div>

                                    {/* Licence number + class */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Field>
                                            <FieldLabel>Licence number</FieldLabel>
                                            <Input
                                                {...register("licence_no")}
                                                className="font-mono text-sm"
                                                placeholder="MH1220190012345"

                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Licence class</FieldLabel>
                                            <Select
                                                value={selectedClass}
                                                onValueChange={(val) => setValue("licence_class", val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border shadow-md text-sm">
                                                    <SelectGroup>
                                                        <SelectLabel>Class</SelectLabel>
                                                        {LICENCE_CLASSES.map(c => (
                                                            <SelectItem key={c.type} value={c.type}>{c.full}</SelectItem>
                                                        ))}
                                                        {/* <SelectItem value="all_licences">All classes</SelectItem>
                                                    <SelectItem value="lmv">LMV - light motor vehicles/cars</SelectItem>
                                                    <SelectItem value="hmv">HMV - heavy motor vehicles</SelectItem>
                                                    <SelectItem value="hgmv">HGMV - heavy goods motor vehicle</SelectItem>
                                                    <SelectItem value="htv">HTV - heavy transport vehicle</SelectItem> */}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    </div>

                                    {/* Licence expiry */}
                                    <Field>
                                        <FieldLabel>Licence expiry</FieldLabel>
                                        <Input type="date" className="text-sm" {...register("licence_expiry")} />
                                    </Field>

                                    {/* Status */}
                                    <Field>
                                        <FieldLabel>Status</FieldLabel>
                                        <Select
                                            value={selectedStatus}
                                            onValueChange={(val) => setValue("driver_status", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border shadow-md">
                                                <SelectGroup>
                                                    <SelectLabel>Status</SelectLabel>
                                                    <SelectItem value="Available" className="text-sm">Available</SelectItem>
                                                    <SelectItem value="On trip" className="text-sm">On trip</SelectItem>
                                                    <SelectItem value="Inactive" className="text-sm">Inactive</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FieldDescription className="text-xs">
                                            Setting to inactive hides this driver from dispatch forms
                                        </FieldDescription>
                                    </Field>

                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </div>

                    <SheetFooter className="flex flex-col sm:flex-row gap-2 items-center w-full border-t border-gray-200">
                        <Button type="submit" className='w-full sm:w-1/2 bg-maroon hover:bg-maroon-dark'>Save changes <BookUser /></Button>
                        <SheetClose className='basis-1/2' asChild>
                            <Button className="w-full" variant="outline">Cancel</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}