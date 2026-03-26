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
import { Plus, UserRound } from "lucide-react"

export default function CreateUserModal() {
    return (
       <div>
                        <Drawer direction="right" className="">
                            <DrawerTrigger className="flex items-center bg-[#701a40] text-white rounded-md text-sm h-8 px-2"><Plus className="w-4 h-4 mr-2" />
                                Create User</DrawerTrigger>
                            <DrawerContent className="bg-white">
                                <DrawerHeader className="border-b border-gray-200">
                                    <DrawerTitle>Create new user</DrawerTitle>
                                    <DrawerDescription>Set role and brand for created user</DrawerDescription>
                                </DrawerHeader>
                                <div className="p-4">
                                    <FieldGroup>
                                        <FieldSet>
                                            <FieldGroup>
                                                <div className="flex gap-2">
                                                    <Field>
                                                        <FieldLabel htmlFor="f_name">First name</FieldLabel>
                                                        <Input id="f_name" type="text" placeholder="Rahul" />
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel htmlFor="l_name">Last name</FieldLabel>
                                                        <Input id="l_name" type="text" placeholder="Sharma" />
                                                    </Field>
                                                </div>

                                                <Field>
                                                    <FieldLabel htmlFor="username">Email address</FieldLabel>
                                                    <Input id="username" type="text" placeholder="rahul.sharma@westside.com" />
                                                    <FieldDescription className="text-xs">
                                                        Invite will be sent to this email
                                                    </FieldDescription>
                                                </Field>


                                                <Field>
                                                    <FieldLabel>Role</FieldLabel>
                                                    <Select>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a role..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white border shadow-md">
                                                            <SelectGroup>
                                                                <SelectLabel>Role</SelectLabel>
                                                                <SelectItem value="brand_manager">Brand Manager</SelectItem>
                                                                <SelectItem value="dc_operator">DC Operator</SelectItem>
                                                                <SelectItem value="store_manager">Store Manager</SelectItem>
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

                                            </FieldGroup>
                                        </FieldSet>
                                    </FieldGroup>
                                </div>
                                <DrawerFooter className="flex flex-row items-center w-full border-t border-gray-200">
                                    <Button className='basis-1/2'>Create User <UserRound /></Button>
                                    <DrawerClose  className='basis-1/2' asChild>
                                        <Button className="w-full" variant="outline">Cancel</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    </div>

    )
}