<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-icons/vue';
import type { Table } from '@tanstack/vue-table';

interface DataTablePaginationProps<T> {
    table: Table<T>;
}

const props = defineProps<DataTablePaginationProps<any>>();
const pageSizes = [5, 10, 15, 30, 40, 50, 100];
</script>

<template>
    <div class="flex items-center justify-between px-2 py-4">
        <div class="text-muted-foreground flex-1 text-sm">
            {{ table.getFilteredSelectedRowModel().rows.length }}
            <!-- {{ trans('table.of') }} -->
            of
            {{ table.getFilteredRowModel().rows.length }}
            <!-- {{ trans('table.selected') }} -->
            selected
        </div>
        <div class="flex items-center space-x-6 lg:space-x-8">
            <div class="flex items-center space-x-2">
                <!-- <p class="text-sm font-medium">{{ trans('table.rows_per_page') }}</p> -->
                <p class="text-sm font-medium">row per page</p>

                <Select
                    :model-value="table.getState().pagination.pageSize.toString()"
                    @update:model-value="(value) => table.setPageSize(Number(value))"
                >
                    <SelectTrigger class="h-8 w-[70px]">
                        <SelectValue :placeholder="table.getState().pagination.pageSize.toString()" />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem v-for="pageSize in pageSizes" :key="pageSize" :value="pageSize.toString()">
                            {{ pageSize }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div class="flex w-[140px] items-center justify-center text-sm font-medium">
                <!-- {{ trans('table.page') }}  -->
                Page
                {{ table.getState().pagination.pageIndex + 1 }}
                <!-- {{ trans('table.of') }} -->
                of
                {{ table.getPageCount() }}
            </div>
            <div class="flex items-center space-x-2">
                <Button variant="outline" class="hidden h-8 w-8 p-0 lg:flex" :disabled="!table.getCanPreviousPage()" @click="table.setPageIndex(0)">
                    <DoubleArrowLeftIcon class="h-4 w-4" />
                </Button>
                <Button variant="outline" class="h-8 w-8 p-0" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
                    <ChevronLeftIcon class="h-4 w-4" />
                </Button>
                <Button variant="outline" class="h-8 w-8 p-0" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
                    <ChevronRightIcon class="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    class="hidden h-8 w-8 p-0 lg:flex"
                    :disabled="!table.getCanNextPage()"
                    @click="table.setPageIndex(table.getPageCount() - 1)"
                >
                    <DoubleArrowRightIcon class="h-4 w-4" />
                </Button>
            </div>
        </div>
    </div>
</template>
