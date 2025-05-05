<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon, EyeNoneIcon } from '@radix-icons/vue';
import type { Column } from '@tanstack/vue-table';

interface DataTableColumnHeaderProps<T> {
    column: Column<T, any>;
    title: string;
}

defineProps<DataTableColumnHeaderProps<any>>();
</script>

<script lang="ts">
export default {
    inheritAttrs: false,
};
</script>

<template>
    <div v-if="column.getCanSort()" :class="cn('flex items-center space-x-2', $attrs.class ?? '')">
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="sm" class="data-[state=open]:bg-accent -ml-3 h-8">
                    <span>{{ title }}</span>
                    <ArrowDownIcon v-if="column.getIsSorted() === 'desc'" class="ml-2 h-4 w-4" />
                    <ArrowUpIcon v-else-if="column.getIsSorted() === 'asc'" class="ml-2 h-4 w-4" />
                    <CaretSortIcon v-else class="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem @click="column.toggleSorting(false)">
                    <ArrowUpIcon class="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                    <!-- {{ trans("table.asc") }} -->
                    asc
                </DropdownMenuItem>
                <DropdownMenuItem @click="column.toggleSorting(true)">
                    <ArrowDownIcon class="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                    <!-- {{ trans('table.desc') }} -->
                    desc
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="column.toggleVisibility(false)">
                    <EyeNoneIcon class="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                    <!-- {{ trans('table.hide') }} -->
                    hide
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>

    <div v-else :class="$attrs.class">
        {{ title }}
    </div>
</template>
