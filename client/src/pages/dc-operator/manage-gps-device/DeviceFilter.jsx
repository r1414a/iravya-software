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

export default function GpsDeviceFilter() {
    return (
        <section className="mt-10 max-w-400 mx-auto px-10">
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
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a truck..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>Truck</SelectLabel>
                                    <SelectItem value="MH 04 AB 1234">MH 04 AB 1234</SelectItem>
                                    <SelectItem value="MH 12 TR 9087">MH 12 TR 9087</SelectItem>
                                    <SelectItem value="MH 43 XY 6677">MH 43 XY 6677</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a brand..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>Brand</SelectLabel>
                                    <SelectItem value="Tata Westside">Tata Westside</SelectItem>
                                    <SelectItem value="Zudio">Zudio</SelectItem>
                                    <SelectItem value="Tata Cliq">Tata Cliq</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    </div>

                </div>
                {/* <div className="basis-1/2 flex gap-2 justify-end">
                {
                    ["All", "Active", "Inactive"].map((tab) => (
                        <Button key={tab} className={`${tab === 'All' ? 'bg-[#701a40]' : 'bg-gray-200 text-black'} px-3`}>{tab}</Button>
                    ))
                    
                }
                </div> */}
            </div>
        </section>
    )
}