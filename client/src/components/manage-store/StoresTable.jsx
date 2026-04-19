
// StoresTable.jsx (Optimized)
import { useMemo } from "react"
import { DataTable } from "./store-table/data-table"
import { columns } from "./store-table/columns"

export default function StoresTable({ 
    stores, 
    brands, 
    setEditStore, 
    setEditOpen,
    setViewStore, 
    setViewOpen, 
    setPage,
    columnFilters,
    setColumnFilters, 
    totalPages, 
    page, 
    onPrevious, 
    onNext, 
    isFetching 
}) {
    const meta = useMemo(() => ({
        brands,
        setEditStore,
        setEditOpen,
        setViewStore,
        setViewOpen
    }), [brands, setEditStore, setEditOpen, setViewStore, setViewOpen])

    return (
        <section className="mt-6 px-4 lg:px-10">
            <DataTable
                columns={columns}
                data={stores}
                meta={meta}
                setPage={setPage}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                totalPages={totalPages}
                page={page}
                onPrevious={onPrevious}
                onNext={onNext}
                isFetching={isFetching}
            />
        </section>
    )
}