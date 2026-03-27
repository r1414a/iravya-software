import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
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
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Plus, UserRound, LocateFixed ,Truck } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function AddGPSDeviceModel() {
    return (
        <>
       <div>
            <Sheet>
                <SheetTrigger className="flex items-center bg-maroon hover:bg-maroon-dark text-white rounded-md text-sm h-8 px-2">
                    <Plus className="w-4 h-4 mr-1" />
                    Add new device
                </SheetTrigger>
                <SheetContent className="bg-white min-w-[500px] flex flex-col">
                    <SheetHeader className="border-b border-gray-200 pb-4">
                        <SheetTitle>Add new device</SheetTitle>
                        <SheetDescription>
                            Assign truck and add retired history.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="px-4 py-6 space-y-6 flex-1 overflow-y-auto">
                        
                        <div className="p-4">
                                    <FieldGroup>
                                        <FieldSet>
                                            <FieldGroup>
                                                <div className="flex gap-2">
                                                    <Field>
                                                        <FieldLabel htmlFor="f_name">IMEI</FieldLabel>
                                                        <Input id="f_name" type="text" placeholder="356938-03-564380-9" />
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel htmlFor="l_name">Model</FieldLabel>
                                                        <Input id="l_name" type="text" placeholder="FMC130" />
                                                    </Field>
                                                </div>

                                                <Field>
                                                    <FieldLabel htmlFor="simmnumber">SIM Number</FieldLabel>
                                                    <Input id="username" type="text" placeholder="+91 9876543210" />
                                                    {/* <FieldDescription className="text-xs">
                                                        Invite will be sent to this email
                                                    </FieldDescription> */}
                                                </Field>

                                                <Field>
                                                    <FieldLabel htmlFor="firmware">Firmware Version</FieldLabel>
                                                    <Input id="username" type="text" placeholder="03.27.05.Rev.45" />
                                                    {/* <FieldDescription className="text-xs">
                                                        Invite will be sent to this email
                                                    </FieldDescription> */}
                                                </Field>

                                                <Field>
                                                    <FieldLabel htmlFor="manufactured">Mannufactured At</FieldLabel>
                                                    <Input id="username" type="text" placeholder="Gujarat, India" />
                                                    {/* <FieldDescription className="text-xs">
                                                        Invite will be sent to this email
                                                    </FieldDescription> */}
                                                </Field>


                                                <Field>
                                                    <FieldLabel>Truck</FieldLabel>
                                                    <Select>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a Truck..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white border shadow-md">
                                                            <SelectGroup>
                                                                <SelectLabel>Truck</SelectLabel>
                                                                <SelectItem value="brand_manager">MH 04 AB 1234</SelectItem>
                                                                <SelectItem value="dc_operator">MH 12 TR 9087</SelectItem>
                                                                <SelectItem value="store_manager">MH 43 XY 6677</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                    <FieldDescription className="text-xs">
                                                        Brand managers can assign trucks to GPS devices
                                                    </FieldDescription>

                                                </Field>

                                                <Field>
                                                    <FieldLabel>Brand</FieldLabel>
                                                    <Select>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select brand..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white border shadow-md">
                                                            <SelectGroup>
                                                                <SelectLabel>Brand</SelectLabel>
                                                                <SelectItem value="tata_westside">Tata Westside</SelectItem>
                                                                <SelectItem value="zudio">Zudio</SelectItem>
                                                                <SelectItem value="tata_cliq">Tata Cliq</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>

                                                <Field>
                                                    <FieldLabel>Status</FieldLabel>
                                                    <Select>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Set status..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white border shadow-md">
                                                            <SelectGroup>
                                                                <SelectLabel>Brand</SelectLabel>
                                                                <SelectItem value="tata_westside">Active</SelectItem>
                                                                <SelectItem value="zudio">In-active</SelectItem>
                                                                
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>

                                            </FieldGroup>
                                        </FieldSet>
                                    </FieldGroup>
                                </div>
                
                    </div>    
                
                    <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200">
                        <Button className='basis-1/2 bg-maroon hover:bg-maroon-dark'>Add Device <LocateFixed /></Button>
                        <SheetClose className='basis-1/2' asChild>
                            <Button className="w-full" variant="outline">Cancel</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    </>

    )
}