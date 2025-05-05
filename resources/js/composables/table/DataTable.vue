<script setup lang="ts">
import type { ColumnDef, ColumnFiltersState, PaginationState, SortingState, Table as TTable, VisibilityState } from '@tanstack/vue-table';
import {
    FlexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from '@tanstack/vue-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { valueUpdater } from '@/lib/utils';
import { PageData, TableInfo, ToolbarAction } from '@/types/table';
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import { route } from 'ziggy-js';
import DataTablePagination from './DataTablePagination.vue';
import DataTableToolbar from './DataTableToolbar.vue';
interface DataTableProps<T> {
    columns: ColumnDef<T, any>[];
    data: PageData<T>;
    tableInfo: TableInfo;
}

const props = defineProps<DataTableProps<any>>();
const pagination = ref<PaginationState>({
    pageIndex: props.data.current_page - 1,
    pageSize: props.data.per_page,
});
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>(props.data.filter);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});

// Helper function to get base params
const getBaseParams = () => {
    let filters = {};
    if (columnFilters.value) {
        filters = columnFilters.value.reduce((acc: any, filter) => {
            acc[filter.id] = filter.value;
            return acc;
        }, {});
    }

    return {
        page: pagination.value.pageIndex + 1,
        per_page: pagination.value.pageSize,
        table_id: props.tableInfo?.table_id,
        sort_field: sorting.value[0]?.id,
        sort_direction: sorting.value.length == 0 ? undefined : sorting.value[0]?.desc ? 'desc' : 'asc',
        ...(props.data.search ? { search: props.data.search } : {}),
        ...(props.data.filter_type ? { filter_type: props.data.filter_type } : {}),
        ...filters,
    };
};

// Helper function to make route request
const makeRequest = (params: any) => {
    router.get(
        typeof props.tableInfo.route === 'string' ? route(props.tableInfo.route) : route(props.tableInfo.route?.name, props.tableInfo.route?.params),
        params,
        { preserveState: true, preserveScroll: true },
    );
};

const table = useVueTable({
    get data() {
        return props.data.data;
    },
    get columns() {
        return props.columns;
    },
    debugTable: false,
    state: {
        get sorting() {
            return sorting.value;
        },
        get columnFilters() {
            return columnFilters.value;
        },
        get columnVisibility() {
            return columnVisibility.value;
        },
        get rowSelection() {
            return rowSelection.value;
        },
        get pagination() {
            return pagination.value;
        },
    },
    enableRowSelection: true,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount: props.data.last_page,
    onPaginationChange: (updater) => {
        if (typeof updater === 'function') {
            pagination.value = updater(pagination.value);
        } else {
            pagination.value = updater;
        }
        makeRequest(getBaseParams());
    },
    onSortingChange: (updaterOrValue) => {
        if (typeof updaterOrValue === 'function') {
            sorting.value = updaterOrValue(sorting.value);
        } else {
            sorting.value = updaterOrValue;
        }
        makeRequest(getBaseParams());
    },
    onColumnFiltersChange: (updaterOrValue) => {
        if (typeof updaterOrValue === 'function') {
            columnFilters.value = updaterOrValue(columnFilters.value);
        } else {
            columnFilters.value = updaterOrValue;
        }
        makeRequest(getBaseParams());
    },
    onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
});

const setColumnVisibility = (table: TTable<any>, columnsToHide: string[]) => {
    columnsToHide.forEach((columnId) => {
        const column = table.getColumn(columnId);
        if (column) {
            column.toggleVisibility(false);
        }
    });
};

// Set Default Hide Columns
setColumnVisibility(table, props.tableInfo?.hidden_columns);
</script>

<template>
    <div class="space-y-4">
        <DataTableToolbar
            :data="data"
            :table="table"
            :search="props.data.search"
            :tableInfo="props.tableInfo"
            :onActionClick="(action: ToolbarAction, data: any) => action.onClick?.(data)"
        />
        <div class="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id">
                            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows.length">
                        <TableRow v-for="row in table.getRowModel().rows" :key="row.id" :data-state="row.getIsSelected() && 'selected'">
                            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                            </TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow>
                            <TableCell :colspan="props.columns.length" class="h-24 text-center"> No result </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>
        <DataTablePagination :table="table" v-if="!tableInfo.is_hide_pagination" />
    </div>
</template>
