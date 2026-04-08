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
import CreateFormSheetTrigger from "../CreateFormSheetTrigger"
import { useAddDriverMutation } from "@/lib/features/drivers/driverApi"
import { useForm } from "react-hook-form"
import { useEffect } from "react"


const LICENCE_CLASSES = ["LMV", "HMV", "HGMV", "HTV"]

export default function ManageDriverForm() {
    const [addDriver, { isLoading }] = useAddDriverMutation()
 
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {
            isSubmitSuccessful
        }
    } = useForm({
        defaultValues: {
            full_name: "",
            phone: "",
            licence_no: "",
            licence_class: "",
            licence_expiry: "",
        }
    })

    useEffect(() => {
  if (isSubmitSuccessful) {
    reset();
  }
}, [isSubmitSuccessful, reset]);


    const onSubmit = async (data) => {
        try {
            await addDriver(data).unwrap()
        } catch (err) {
            console.error(err)
        }
    }
    return (

        <Sheet direction="right">
           <CreateFormSheetTrigger text='Create Driver'/>
            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col h-full">
                    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                <SheetHeader className="border-b border-gray-200">
                    <SheetTitle>Create new driver</SheetTitle>
                    <SheetDescription>Add driver details and licence information</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                    <FieldGroup>
                        <FieldSet>
                            <FieldGroup>
                                <div  className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field>
                                        <FieldLabel>Full name</FieldLabel>
                                        <Input {...register("full_name")} placeholder="Ravi Deshmukh" className="placeholder:text-sm text-sm sm:text-md"/>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Phone number</FieldLabel>
                                        <Input {...register("phone")} placeholder="+91 98XXX XXXXX" className="placeholder:text-sm text-sm sm:text-md"/>
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field>
                                        <FieldLabel>Licence number</FieldLabel>
                                        <Input {...register("licence_no")} placeholder="MH1220190012345" className="placeholder:text-sm text-sm sm:text-md" />
                                    </Field>


                                    <Field>
                                        <FieldLabel>Licence class</FieldLabel>
                                        <Select onValueChange={(val) => setValue("licence_class", val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select class" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border shadow-md">
                                                <SelectGroup>
                                                    <SelectLabel>Class</SelectLabel>
                                                    {/* <SelectItem value="all_licences">All classes</SelectItem> */}
                                                     {LICENCE_CLASSES.map(c => (
                                                         <SelectItem key={c} value={c}>{c}</SelectItem>
                                                         ))}
                                                   {/*  <SelectItem value="lmv">LMV - light motor vehicles/cars</SelectItem>
                                                    <SelectItem value="hmv">HMV - heavy motor vehicles</SelectItem>
                                                    <SelectItem value="hgmv">HGMV - heavy goods motor vehicle</SelectItem>
                                                    <SelectItem value="htv">HTV - heavy transport vehicle</SelectItem> */}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </div>

                                <Field>
                                    <FieldLabel>Licence expiry</FieldLabel>
                                    <Input {...register("licence_expiry")} type="date" className="text-xs"/>
                                </Field>

                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </div>

                <SheetFooter className="flex flex-col sm:flex-row gap-2 items-center w-full border-t border-gray-200">
                    <Button type="submit" className='w-full sm:w-1/2 bg-maroon hover:bg-maroon-dark'>Add Driver <BookUser /></Button>
                    <SheetClose className='basis-1/2' asChild>
                        <Button className="w-full" variant="outline">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}