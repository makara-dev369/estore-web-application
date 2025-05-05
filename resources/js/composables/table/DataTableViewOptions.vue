<script setup lang="ts">
import { MixerHorizontalIcon } from '@radix-icons/vue';
import type { Table } from '@tanstack/vue-table';
import { computed } from 'vue';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { trans } from "laravel-vue-i18n";

interface DataTableViewOptionsProps<T> {
    table: Table<T>;
}
const props = defineProps<DataTableViewOptionsProps<any>>();
const columns = computed(() => props.table.getAllColumns().filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()));
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm" class="ml-auto hidden h-8 lg:flex">
                <MixerHorizontalIcon class="mr-2 h-4 w-4" />
                <!-- {{ trans('table.view') }} -->
                View
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-[150px]">
            <DropdownMenuLabel>
                <!-- {{ trans('table.toggle') }} -->
                toggle
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
                v-for="column in columns"
                :key="column.id"
                class="capitalize"
                :checked="column.getIsVisible()"
                @update:checked="(value: any) => column.toggleVisibility(!!value)"
            >
                {{ column.id }}
            </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
