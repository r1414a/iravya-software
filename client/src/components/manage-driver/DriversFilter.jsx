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
 
export default function DriversFilter() {
    return (
        <section className="mt-10 px-10">
            <div className="flex w-full justify-between">
                <div className="basis-1/2 flex gap-4">
                    <InputGroup className="max-w-xs">
                        <InputGroupInput placeholder="Search drivers by name or mobile number..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
 
                        {/* Filter by truck assignment */}
                        {/* <Select defaultValue="all_trucks">
                            <SelectTrigger className="w-56">
                                <SelectValue placeholder="Select truck..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>Truck</SelectLabel>
                                    <SelectItem value="all_trucks">All trucks</SelectItem>
                                    <SelectItem value="idle">Idle</SelectItem>
                                    <SelectItem value="MH12AB1234">MH12AB1234</SelectItem>
                                    <SelectItem value="MH14CD5678">MH14CD5678</SelectItem>
                                    <SelectItem value="MH12XY9090">MH12XY9090</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select> */}
                </div>
 
            </div>
        </section>
    )
}