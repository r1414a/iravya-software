import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"

export default function SearchDropdown({
    placeholder,
    value,
    onChange,
    displayKey,
    secondaryKey,
    valueKey = "id",
    fetchHook,
    extraParams = {},
    apiRes, // ✅ FIX: instead of `key`
}) {
    const [search, setSearch] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const { data, isLoading } = fetchHook({
        search,
        page: 1,
        limit: 10,
        ...extraParams,
    })

    // ✅ SAFE ACCESS
    const items = data?.data?.[apiRes] || []

    const selectedItem = items.find(item => item[valueKey] === value)

    return (
        <div className="relative">
            <Input
                placeholder={placeholder}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                    setIsOpen(true)
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            />

            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border shadow-md max-h-60 overflow-y-auto z-50">
                    {isLoading ? (
                        <div className="p-2 text-xs text-gray-500">Loading...</div>
                    ) : items.length === 0 ? (
                        <div className="p-2 text-xs text-gray-400">No results</div>
                    ) : (
                        items.map(item => (
                            <div
                                key={item[valueKey]}
                                onClick={() => {
                                    onChange(item[valueKey])
                                    setIsOpen(false)
                                    setSearch("")
                                }}
                                className="p-2 cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <p>{item[displayKey]}</p>
                                        {secondaryKey && (
                                            <p className="text-xs text-gray-500">
                                                {item[secondaryKey]}
                                            </p>
                                        )}
                                    </div>
                                    {value === item[valueKey] && <Check size={14} />}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {selectedItem && (
                <p className="text-xs text-green-600 mt-1">
                    Selected: {selectedItem[displayKey]}
                </p>
            )}
        </div>
    )
}