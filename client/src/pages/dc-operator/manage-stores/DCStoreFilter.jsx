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

export default function DCStoreFilter() {
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
                                    <SelectLabel>City</SelectLabel>
                                    
                                    <SelectItem value="All City">All City</SelectItem>
                                    <SelectItem value="Pune">Pune</SelectItem>
                                    <SelectItem value="Nashik">Nashik</SelectItem>
                                    <SelectItem value="Nagpur">Nagpur</SelectItem>
                                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                                    
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select defaultValue="all_roles">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>State</SelectLabel>
                                    
                                    <SelectItem value="All State">All State</SelectItem>
                                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                                    <SelectItem value="Kerala">Kerala</SelectItem>
                                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                                    <SelectItem value="Uttarpradesh">Uttarpradesh</SelectItem>
                
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select defaultValue="all_roles">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>Country</SelectLabel>
                                    
                                    <SelectItem value="All coutry">All coutry</SelectItem>
                                    <SelectItem value="America">America</SelectItem>
                                    <SelectItem value="Britan">Britan</SelectItem>
                                    <SelectItem value="Denmark">Denmark</SelectItem>
                                    <SelectItem value="India">India</SelectItem>
                                    <SelectItem value="Japan">Japan</SelectItem>
                                    
                
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    </div>

                </div>
                
            </div>
        </section>
    )
}