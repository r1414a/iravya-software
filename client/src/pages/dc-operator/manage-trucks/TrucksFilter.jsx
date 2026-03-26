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
 
export default function TrucksFilter() {
    return (
        <section className="mt-10 px-10">
            <div className="flex w-full justify-between">
                <div className="basis-1/2 flex gap-4">
                    <InputGroup className="max-w-xs">
                        <InputGroupInput placeholder="Search reg. no. or driver..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
 
                    <div className="flex gap-4 w-full">
                        {/* Filter by truck type */}
                        <Select defaultValue="all_types">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Truck type..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>Type</SelectLabel>
                                    <SelectItem value="all_types">All types</SelectItem>
                                    <SelectItem value="mini_truck">Mini truck</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="heavy">Heavy</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
 
                        {/* Filter by driver assignment */}
                        <Select defaultValue="all_assignment">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Driver assigned..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>Driver</SelectLabel>
                                    <SelectItem value="all_assignment">All trucks</SelectItem>
                                    <SelectItem value="assigned">Driver assigned</SelectItem>
                                    <SelectItem value="unassigned">No driver</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
 
                {/* Status tabs — Idle / In transit / Maintenance mirror Active / Inactive pattern */}
                <div className="basis-1/2 flex gap-2 justify-end">
                    {["All", "Idle", "In transit", "Maintenance"].map((tab) => (
                        <Button
                            key={tab}
                            className={`${tab === "All" ? "bg-[#701a40]" : "bg-gray-200 text-black"} px-3`}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>
            </div>
        </section>
    )
}