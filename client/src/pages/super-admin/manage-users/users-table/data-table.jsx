import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function DataTable({
    columns, 
    data,
    setPage, 
    columnFilters, 
    setColumnFilters,
    totalPages = 1,
    page = 1,
    onPrevious,
    onNext,
    isFetching = false, 
    meta 
}) {

    const table = useReactTable({
            data,
            columns,
            state: { columnFilters },
            onColumnFiltersChange: setColumnFilters,
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            manualFiltering: true,
            meta: {
                ...meta,
                updatePage: (newPage) => setPage(newPage)
            }
        })

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="font-bold">
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                 <TableBody>
                    {isFetching ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-center py-6 text-gray-500"
                            >
                                Loading users...
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="hover:bg-muted cursor-pointer"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-center py-6 text-gray-500"
                            >
                                No users found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-3">
                <div className="text-sm text-black font-semibold">
                    Page {page} of {totalPages}
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={onPrevious}
                        disabled={page <= 1 || isFetching}
                        className="bg-maroon text-xs hover:bg-maroon-dark cursor-pointer disabled:bg-gray-200 disabled:text-black"
                    >
                        Previous
                    </Button>
                    
                    <Button
                        onClick={onNext}
                        disabled={page >= totalPages || isFetching}
                        className="bg-maroon text-xs hover:bg-maroon-dark cursor-pointer disabled:bg-gray-200 disabled:text-black"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}