import { useMemo } from "react"
import { columns } from "./report-table/column"
import { DataTable } from "./report-table/data-table"

export default function ReportTable({
    reports,
    setViewReport,
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
        setViewReport, 
        setViewOpen
    }), [
        setViewReport, 
        setViewOpen
    ])
    return (
        <section className="mt-6 px-4 lg:px-10">
            <div className="border rounded-lg">
                <DataTable
                    columns={columns}
                    data={reports}
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
            </div>
        </section>
    )
}