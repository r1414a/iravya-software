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
import { Plus, UserRound, LocateFixed } from "lucide-react"

export default function AddGPSDeviceModel() {
    return (
       <div>
                        <Drawer direction="right" className="">
                            <DrawerTrigger className="flex items-center bg-[#701a40] text-white rounded-md text-sm h-8 px-2"><Plus className="w-4 h-4 mr-2" />
                                Add new device</DrawerTrigger>
                            <DrawerContent className="bg-white">
                                <DrawerHeader className="border-b border-gray-200">
                                    <DrawerTitle>Add new device</DrawerTitle>
                                    <DrawerDescription>Assign Truck and add retired hitory</DrawerDescription>
                                </DrawerHeader>
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
                                                    <FieldLabel htmlFor="username">SIM Number</FieldLabel>
                                                    <Input id="username" type="text" placeholder="" />
                                                    {/* <FieldDescription className="text-xs">
                                                        Invite will be sent to this email
                                                    </FieldDescription> */}
                                                </Field>

                                                <Field>
                                                    <FieldLabel htmlFor="username">Firmware Version</FieldLabel>
                                                    <Input id="username" type="text" placeholder="" />
                                                    {/* <FieldDescription className="text-xs">
                                                        Invite will be sent to this email
                                                    </FieldDescription> */}
                                                </Field>

                                                <Field>
                                                    <FieldLabel htmlFor="username">Mannufactured At</FieldLabel>
                                                    <Input id="username" type="text" placeholder="" />
                                                    {/* <FieldDescription className="text-xs">
                                                        Invite will be sent to this email
                                                    </FieldDescription> */}
                                                </Field>


                                                <Field>
                                                    <FieldLabel>Truck</FieldLabel>
                                                    <Select>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a role..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white border shadow-md">
                                                            <SelectGroup>
                                                                <SelectLabel>Role</SelectLabel>
                                                                <SelectItem value="brand_manager">MH 04 AB 1234</SelectItem>
                                                                <SelectItem value="dc_operator">MH 12 TR 9087</SelectItem>
                                                                <SelectItem value="store_manager">MH 43 XY 6677</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                    <FieldDescription className="text-xs">
                                                        Brand managers can see all trucks and trips for their brand
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
                                                            <SelectValue placeholder="Select brand..." />
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
                                <DrawerFooter className="flex flex-row items-center w-full border-t border-gray-200">
                                    <Button className='basis-1/2'>Add new device<LocateFixed /></Button>
                                    <DrawerClose  className='basis-1/2' asChild>
                                        <Button className="w-full" variant="outline">Cancel</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    </div>

    )
}