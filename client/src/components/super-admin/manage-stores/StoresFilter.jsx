import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Search } from "lucide-react"

export default function StoresFilter() {

    return (
        <section className="mt-10 px-10">
            <div className="flex w-full justify-between">

                {/* Left — search + brand + city dropdowns */}
                    <InputGroup className="max-w-xs">
                        <InputGroupInput placeholder="Search store name, city..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>

            </div>
        </section>
    )
}