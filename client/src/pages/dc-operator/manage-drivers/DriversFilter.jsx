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
 
export default function DriversFilter() {
    return (
        <section className="mt-10 px-10">
            <div className="flex w-full justify-between">
                <div className="basis-1/2 flex gap-4">
                    <InputGroup className="max-w-xs">
                        <InputGroupInput placeholder="Search drivers..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
 
                    <div className="flex gap-4 w-full">
                        {/* Filter by truck assignment */}
                        <Select defaultValue="all_trucks">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select truck..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>Truck</SelectLabel>
                                    <SelectItem value="all_trucks">All trucks</SelectItem>
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    <SelectItem value="MH12AB1234">MH12AB1234</SelectItem>
                                    <SelectItem value="MH14CD5678">MH14CD5678</SelectItem>
                                    <SelectItem value="MH12XY9090">MH12XY9090</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
 
                        {/* Filter by licence class */}
                        <Select defaultValue="all_licences">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Licence class..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>Licence class</SelectLabel>
                                    <SelectItem value="all_licences">All classes</SelectItem>
                                    <SelectItem value="lmv">LMV - light motor vehicles/cars</SelectItem>
                                    <SelectItem value="hmv">HMV - heavy motor vehicles</SelectItem>
                                    <SelectItem value="hgmv">HGMV - heavy goods motor vehicle</SelectItem>
                                    <SelectItem value="htv">HTV - heavy transport vehicle</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
 
                {/* Status tabs — mirrors the All / Active / Inactive pattern */}
                <div className="basis-1/2 flex gap-2 justify-end">
                    {["All", "Available", "On trip", "Inactive"].map((tab) => (
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