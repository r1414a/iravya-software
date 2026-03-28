import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Search } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function UsersFilter() {
    const [role, setRole] = useState("all_roles")
    return (
        <section className="mt-10 px-10">
            <div className="flex w-full justify-between">
                <div className="basis-1/2 flex gap-4">
                    <InputGroup className="max-w-xs">
                        <InputGroupInput placeholder="Search..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        {/* <InputGroupAddon align="inline-end">12 results</InputGroupAddon> */}
                    </InputGroup>

                    <div className="flex gap-4 w-full">
                        <Select defaultValue="all_brands">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select brand..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>Brands</SelectLabel>
                                    <SelectItem value="all_brands">All brands</SelectItem>
                                    <SelectItem value="tata_westside">Tata Westside</SelectItem>
                                    <SelectItem value="zudio">Zudio</SelectItem>
                                    <SelectItem value="tata_cliq">Tata Cliq</SelectItem>
                                    <SelectItem value="tanishq">Tanishq</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select defaultValue="all_roles">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>Role</SelectLabel>
                                    <SelectItem value="all_roles">All roles</SelectItem>
                                    <SelectItem value="brand_manager">Brand Manager</SelectItem>
                                    <SelectItem value="dc_operator">DC Operator</SelectItem>
                                    <SelectItem value="store_manager">Store Manager</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    </div>

                </div>
                <div className="basis-1/2 flex gap-2 justify-end">
                {
                    ["All", "Active", "Inactive"].map((tab) => (
                        <Button key={tab} className={`${tab === 'All' ? 'bg-[#701a40]' : 'bg-gray-200 text-black'} px-3`}>{tab}</Button>
                    ))
                    
                }
                </div>
            </div>
        </section>
    )
}