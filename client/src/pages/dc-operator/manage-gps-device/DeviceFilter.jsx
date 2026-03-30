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