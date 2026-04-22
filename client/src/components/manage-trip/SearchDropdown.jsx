// SearchDropdown.jsx (Fixed & Complete)
import { useState, useMemo, useEffect } from "react"
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
    apiRes,
    clearOnSelect = false,
    isStore = false,
    initialSelected
}) {
    const [search, setSearch] = useState("")
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(initialSelected || null)
    const [hasInitialized, setHasInitialized] = useState(false)

    const { data, isLoading } = fetchHook({
        search,
        page: 1,
        limit: 100,
        ...extraParams,
    })

    // Safe access to items
    const items = useMemo(() => {
        if (apiRes) {
            return data?.data?.[apiRes] || []
        }
        return data?.data || []
    }, [data, apiRes])


    useEffect(() => {
        if (!hasInitialized && initialSelected) {
            setSelected(initialSelected)
            setHasInitialized(true)
        }
    }, [initialSelected, hasInitialized])


    useEffect(() => {
    if (!value || isStore) return;

    const found = items.find(item => item[valueKey] === value);

    if (found) {
        setSelected(found);
    }
}, [value, items]);


    const handleSelect = (item) => {
        setSelected(item) // 🔥 store locally
        setHasInitialized(true)
        onChange(isStore ? item : item[valueKey])

        setIsOpen(false)

        if (clearOnSelect) {
            setSearch("")
        } else {
            setSearch("") // optional
        }
    }

    return (
        <div className="relative w-full">
            <Input
                placeholder={placeholder}
                value={
                    search ||
                    (selected ? selected[displayKey] : "")
                }
                onChange={(e) => {
                    setSearch(e.target.value)
                    setIsOpen(true)
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className="text-sm"
            />

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                    {isLoading ? (
                        <div className="p-3 text-xs text-gray-500 text-center">
                            Loading...
                        </div>
                    ) : items.length === 0 ? (
                        <div className="p-3 text-xs text-gray-400 text-center">
                            No results found
                        </div>
                    ) : (
                        items.map(item => {
                            const isSelected = isStore
                                ? value?.store_id === item[valueKey]
                                : selected?.[valueKey] === item[valueKey];

                            return (
                                <div
                                    key={item[valueKey]}
                                    onClick={() => handleSelect(item)}
                                    className={`p-2.5 cursor-pointer hover:bg-gray-100 border-b last:border-0 transition-colors ${isSelected ? "bg-blue-50" : ""
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">
                                                {item[displayKey]}
                                            </p>
                                            {secondaryKey && item[secondaryKey] && (
                                                <p className="text-xs text-gray-500 truncate">
                                                    {item[secondaryKey]}
                                                </p>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <Check size={14} className="text-blue-600 shrink-0" />
                                        )}
                                    </div>
                                </div>
                            )

                        })
                    )}
                </div>
            )}

            {/* {initialSelected && !search && !isStore && (
    <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
        <Check size={12} />
        Selected: {initialSelected[displayKey]}
    </div>
)} */}
        </div>
    )
}