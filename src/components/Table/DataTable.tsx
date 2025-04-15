import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    SortingState,
    ColumnDef,
} from '@tanstack/react-table';
import React from 'react';
import { useState, useMemo } from 'react';

interface DataTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T, any>[];
    isLoading?: boolean;
    enableSearch?: boolean;
    searchPlaceholder?: string;
    enablePagination?: boolean;
    enableSorting?: boolean;
    noDataMessage?: string;
    setPage?: (page: number) => void;
    setLimit?: (limit: number) => void;
}

export function DataTable<T extends object>({
    data,
    columns,
    isLoading = false,
    enableSearch = true,
    searchPlaceholder = "Search...",
    enableSorting = true,
    noDataMessage = "No data available",
}: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    // Ensure data is an array
    const tableData = Array.isArray(data) ? data : [];

  // Add S/N column to the beginning of columns array
  const columnsWithSN: ColumnDef<T, any>[] = React.useMemo(() => {
    return [
      {
        id: "serialNumber",
        header: "S/N",
        cell: ({ row }) => {
          // Calculate the serial number based on the current page and row index
          const pageIndex = table.getState().pagination.pageIndex || 0;
          const pageSize = table.getState().pagination.pageSize || 10;
          const rowIndex = row.index + 1;
          return (pageIndex * pageSize + rowIndex).toString();
        },
        enableSorting: false, // Disable sorting for the S/N column
      },
      ...columns,
    ];
  }, [columns]);

  
    const table = useReactTable({
        data: tableData,
        columns: columnsWithSN,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableSorting,
    });

    // Handle page change

    // Handle rows per page change
    // const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const newPageSize = parseInt(event.target.value, 10);
    //     setPageSize(newPageSize);
    //     setPageIndex(0);
    //     if (setLimit) setLimit(newPageSize);
    // };

    return (
        <div className="w-full p-6 bg-gray-50 rounded-lg">
            {/* Search */}
            {enableSearch && (
                <div className="flex justify-end mb-4">
                    <div className="relative w-1/2">
                        <input
                            type="text"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading && (
                    <div className="w-full h-1 bg-red-200">
                        <div className="h-full bg-red-500 animate-pulse"></div>
                    </div>
                )}
                <table className="min-w-full">
                    <thead className="bg-red-900 hi">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {enableSorting && header.column.getCanSort() && (
                                                <span>
                                                    {{
                                                        asc: '↑',
                                                        desc: '↓',
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columnsWithSN.length} className="px-6 py-12 text-center">
                                    <p className="text-sm text-gray-500">{noDataMessage}</p>
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {/* {enablePagination && (
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                            Page {pageIndex + 1} of {table.getPageCount()}
                        </span>
                        <select
                            value={pageSize}
                            onChange={handleRowsPerPageChange}
                            className="px-2 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            {[5, 10, 25, 50].map(size => (
                                <option key={size} value={size}>
                                    Show {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPageIndex(0)}
                            disabled={pageIndex === 0}
                            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            First
                        </button>
                        <button
                            onClick={() => setPageIndex(pageIndex - 1)}
                            disabled={pageIndex === 0}
                            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPageIndex(pageIndex + 1)}
                            disabled={pageIndex === table.getPageCount() - 1}
                            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                        <button
                            onClick={() => setPageIndex(table.getPageCount() - 1)}
                            disabled={pageIndex === table.getPageCount() - 1}
                            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Last
                        </button>
                    </div>
                </div>
            )} */}
        </div>
    );
}