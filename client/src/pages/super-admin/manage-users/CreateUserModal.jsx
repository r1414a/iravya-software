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
import { Plus, UserRound } from "lucide-react"
import { useState } from "react"
import CreateFormSheetTrigger from "@/components/CreateFormSheetTrigger"

const SCOPE_OPTIONS = {
    "DC operator": ["Pune Warehouse DC", "Mumbai Warehouse DC", "Nashik DC", "Nagpur DC"],
    "Store manager": ["Koregaon Park Store", "Hinjawadi Store", "FC Road Store", "Baner Store", "Kothrud Store"],
}

const ROLE_HINT = {
    "DC operator": "Can dispatch trips and manage trucks from their assigned DC",
    "Store manager": "Can track deliveries coming to their assigned store",
}

export default function CreateUserModal() {
    const [selectedRole, setSelectedRole] = useState("DC operator")

    // Keep local role in sync when a different row is clicked
    const role = selectedRole || ""


    const showScope = role === "DC operator" || role === "Store manager"
    return (
        <div>
            <Sheet direction="right" className="">
                <CreateFormSheetTrigger text={'Create User'}/>
               
                <SheetContent className="bg-white">
                    <SheetHeader className="border-b border-gray-200">
                        <SheetTitle>Create new user</SheetTitle>
                        <SheetDescription>Set role and brand for created user</SheetDescription>
                    </SheetHeader>
                    <div className="pt-0 px-4 sm:p-4">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>
                                    <div className="flex gap-2">
                                        <Field>
                                            <FieldLabel htmlFor="f_name">First name</FieldLabel>
                                            <Input id="f_name" type="text" placeholder="Rahul" className="placeholder:text-sm text-sm sm:text-md"/>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="l_name">Last name</FieldLabel>
                                            <Input id="l_name" type="text" placeholder="Sharma" className="placeholder:text-sm text-sm sm:text-md"/>
                                        </Field>
                                    </div>

                                    <Field>
                                        <FieldLabel htmlFor="username">Email address</FieldLabel>
                                        <Input id="username" type="text" placeholder="rahul.sharma@westside.com" className="placeholder:text-sm text-sm sm:text-md"/>
                                        <FieldDescription className="text-xs">
                                            Invite will be sent to this email
                                        </FieldDescription>
                                    </Field>


                                    <Field>
                                        <FieldLabel>Role</FieldLabel>
                                        <Select
                                            defaultValue="DC operator"
                                            onValueChange={(val) => setSelectedRole(val)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a role..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border shadow-md">
                                                <SelectGroup>
                                                    <SelectLabel>Role</SelectLabel>
                                                    {/* <SelectItem value="Brand manager">Brand Manager</SelectItem> */}
                                                    <SelectItem value="DC operator">DC Operator</SelectItem>
                                                    <SelectItem value="Store manager">Store Manager</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {role && (
                                            <FieldDescription className="text-xs">
                                                {ROLE_HINT[role]}
                                            </FieldDescription>
                                        )}
                                    </Field>



                                    {/* Scope — only shown for DC operator and Store manager */}
                                    {showScope && (
                                        <Field>
                                            <FieldLabel>
                                                {role === "DC operator" ? "Assigned DC" : "Assigned store"}
                                            </FieldLabel>
                                            <Select defaultValue="">
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={`Select ${role === "DC operator" ? "data center" : "store"}...`} />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border shadow-md">
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            {role === "DC operator" ? "Data Centers" : "Stores"}
                                                        </SelectLabel>
                                                        {(SCOPE_OPTIONS[role] ?? []).map((opt) => (
                                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FieldDescription className="text-xs">
                                                {role === "DC operator"
                                                    ? "User will only see trucks and trips from this DC"
                                                    : "User will only see deliveries coming to this store"
                                                }
                                            </FieldDescription>
                                        </Field>
                                    )}

                                    {/* <Field>
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
                                    </Field> */}

                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </div>


                    <SheetFooter className="flex flex-col sm:flex-row gap-2 items-center w-full border-t border-gray-200">
                    <Button className='w-full sm:w-1/2 bg-maroon hover:bg-maroon-dark'>Create User <UserRound /></Button>
                    <SheetClose className='basis-1/2' asChild>
                        <Button className="w-full" variant="outline">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>

    )
}