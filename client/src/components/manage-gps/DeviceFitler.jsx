import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
 
// showBrandFilter — passed by super admin, hidden for DC (DC only sees their own brand)
export default function DeviceFilter({ showBrandFilter = false }) {
    return (
        <section className="mt-10 px-10">
            <div className="flex w-full gap-4">
                <InputGroup className="max-w-xs">
                    <InputGroupInput placeholder="Search device ID, IMEI..." />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
 
                {/* Brand filter — super admin only */}
                {/* {showBrandFilter && (
                    <Select defaultValue="all_brands">
                        <SelectTrigger className="w-48">
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
                )} */}
 
                {/* Status filter — both see this */}
                {/* <Select defaultValue="all_status">
                    <SelectTrigger className="w-44">
                        <SelectValue placeholder="Filter by status..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md">
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="all_status">All status</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="in_transit">In transit</SelectItem>
                            <SelectItem value="at_store">At store</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select> */}
            </div>
        </section>
    )
}