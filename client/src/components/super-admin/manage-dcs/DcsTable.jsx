// DCsTable.jsx (Optimized)
import { useMemo } from "react"
import { DataTable } from "./dc-table/data-table"
import { columns } from "./dc-table/columns"

export default function DCsTable({ 
    dcs, 
    setEditDc, 
    setEditOpen, 
    setViewDc, 
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
        setEditDc,
        setEditOpen,
        setViewDc, 
        setViewOpen,
    }), [setEditDc, setEditOpen, setViewDc, setViewOpen,])

    return (
        <section className="mt-6 px-4 lg:px-10">
            <DataTable
                columns={columns}
                data={dcs}
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