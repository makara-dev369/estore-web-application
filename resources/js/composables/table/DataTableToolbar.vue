<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import Combobox from '@/composables/combobox/Combobox.vue';
import { ActionType } from '@/enums/action_menu';
import { PageData, TableInfo, ToolbarAction } from '@/types/table';
import { router } from '@inertiajs/vue3';
import { CrossCircledIcon } from '@radix-icons/vue';
import type { ColumnFiltersState, PaginationState, SortingState, Table } from '@tanstack/vue-table';
import { Search } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import { route } from 'ziggy-js';
import DataTableFacetedFilter from './DataTableFacetedFilter.vue';
import DataTableViewOptions from './DataTableViewOptions.vue';
// import { trans } from "laravel-vue-i18n";

interface DataTableToolbarProps<T> {
    table: Table<T>;
    data: PageData<T>;
    search: string;
    tableInfo: TableInfo;
    onActionClick: Function;
}

const props = defineProps<DataTableToolbarProps<any>>();
const pagination = ref<PaginationState>({
    pageIndex: props.data.current_page - 1,
    pageSize: props.data.per_page,
});
const filerCols = ref<ColumnFiltersState[]>(props.data.filter);

if (props.data.filter_by) {
    filerCols.value.push([
        {
            id: 'filter_by',
            value: props.data.filter_by,
        },
    ]);
}
const columnFilters = ref<ColumnFiltersState[]>(filerCols.value);
const sorting = ref<SortingState>([]);
const searchValue = ref(props.search);
const filter_toolbar = ref(props.tableInfo.filter_toolbar);

// Selected filter
const selectedFilter = ref(props.data.filter_by);
// Filter search valu
const filterSearchValue = ref(props.data.filter_value);

const getBaseParams = () => {
    let filters = {};
    if (columnFilters.value) {
        filters = columnFilters.value.reduce((acc: any, filter: { id: string | number; value: any }) => {
            acc[filter?.id] = filter.value;
            return acc;
        }, {});
    }

    return {
        page: 1,
        per_page: pagination.value.pageSize,
        table_id: props.tableInfo?.table_id,
        sort_field: sorting.value[0]?.id,
        sort_direction: sorting.value.length == 0 ? undefined : sorting.value[0]?.desc ? 'desc' : 'asc',
        search: searchValue.value,
        ...(props.data.filter_type ? { filter_type: props.data.filter_type } : {}),
        ...filters,
        ...(selectedFilter.value && filterSearchValue.value
            ? {
                  filter_by: selectedFilter.value,
                  filter_value: filterSearchValue.value,
              }
            : {}),
    };
};

const makeRequest = (params: any) => {
    router.get(
        typeof props.tableInfo.route === 'string' ? route(props.tableInfo.route) : route(props.tableInfo.route?.name, props.tableInfo.route?.params),
        params,
        { preserveState: true, preserveScroll: true },
    );
};

const handleSearch = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        makeRequest(getBaseParams());
    }
};

// Watch search value and update server-side search
watch(searchValue, () => {
    if (searchValue.value === null || searchValue.value === '') {
        makeRequest(getBaseParams()); // Call makeRequest when searchValue is empty/null
    }
});

// Method to handle event actions
const handleAction = (action: ToolbarAction) => {
    if (action.type == ActionType.Link) {
        router.get(typeof action.value === 'string' ? route(action.value) : route(action.value?.name, action.value?.params));
    }
    if (action.onClick) {
        props.onActionClick?.(action);
    }
};

// Apply the selected filter with search value
const applyFilter = () => {
    if (selectedFilter.value && filterSearchValue.value) {
        // Apply filters
        makeRequest(getBaseParams());
    }
};

// Handle filter search input
const handleFilterSearch = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        applyFilter();
    }
};

// Computed value to check if there are any active filters
const isFiltered = computed(() => props.table.getState().columnFilters.length > 0);

const resetFilters = () => {
    props.table.resetColumnFilters();
    columnFilters.value = [];
    selectedFilter.value = '';
    filterSearchValue.value = '';
    makeRequest(getBaseParams());
};
</script>
<template>
    <div class="flex items-end justify-between">
        <div class="flex flex-1 items-end space-x-2">
            <div class="relative" v-if="tableInfo.is_searchable ?? true">
                <Search class="text-muted-foreground absolute top-2 left-2.5 h-4 w-4" />
                <Input
                    type="search"
                    autocomplete="off"
                    v-model="searchValue"
                    @keydown="handleSearch"
                    placeholder="search"
                    class="bg-background h-8 w-full min-w-[250px] appearance-none pl-8 shadow-none"
                />
            </div>
            <div v-for="filter in filter_toolbar" :key="filter.title">
                <DataTableFacetedFilter :column="table.getColumn(filter.column)" :title="filter.title" :options="filter.data" />
            </div>

            <!-- Filter By -->
            <div class="grid gap-2" v-if="tableInfo.filter_by_option">
                <Label>
                    {{ tableInfo.filter_by_option.title }}
                </Label>
                <div class="flex items-center space-x-2">
                    <Combobox
                        :items="tableInfo.filter_by_option.data"
                        buttonClass="h-8 w-52"
                        v-model="selectedFilter"
                        placeholder="Filter by..."
                        defaultLabel="All"
                    />
                    <div class="relative" v-if="selectedFilter">
                        <Search class="text-muted-foreground absolute top-2 left-2.5 h-4 w-4" />
                        <Input
                            type="search"
                            autocomplete="off"
                            v-model="filterSearchValue"
                            @keydown="handleFilterSearch"
                            :placeholder="`Search in filter`"
                            class="bg-background h-8 w-full min-w-[200px] appearance-none pl-8 shadow-none"
                        />
                    </div>
                </div>
            </div>

            <Button v-if="isFiltered" variant="ghost" class="h-8 px-2 lg:px-3" @click="resetFilters">
                <!-- {{ trans('table.reset') }} -->
                Reset
                <CrossCircledIcon class="ml-2 h-4 w-4" />
            </Button>
            <!-- <DateRangePicker /> -->
        </div>
        <!-- More Action Button -->
        <div class="px-2">
            <div class="flex items-center space-x-2">
                <Button size="sm" class="ml-auto h-8" v-for="buton in tableInfo.button_toolbar" :key="buton.label" @click="handleAction(buton)">
                    <component class="mr-2 h-4 w-4" :is="buton.icon" v-if="buton.icon" />
                    {{ buton.label }}
                </Button>
            </div>
        </div>
        <DataTableViewOptions :table="table" v-if="!tableInfo.is_hide_manage_column" />
    </div>
</template>
