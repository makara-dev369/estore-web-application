<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ActionType } from '@/enums/action_menu';
import { ToolbarAction } from '@/types/table';
import { router } from '@inertiajs/vue3';
import { DotsHorizontalIcon } from '@radix-icons/vue';
import type { Row } from '@tanstack/vue-table';
import { route } from 'ziggy-js';

interface DataTableRowActionsProps<T> {
    row: Row<T>;
    menuActions: ToolbarAction[];
}

const props = defineProps<DataTableRowActionsProps<any>>();

const getActionParams = (row: any, action: any): { [key: string]: any } => {
    const params: { [key: string]: any } = {};

    Object.keys(action.value.params).forEach((parameterKey) => {
        if (row.original && parameterKey in row.original) {
            params[parameterKey] = row.original[parameterKey];
        }
    });

    return params;
};
// Method to handle event actions
const handleAction = (action: ToolbarAction, row: any) => {
    if (action.type == ActionType.Link) {
        if (typeof action.value === 'object') {
            try {
                action.value.params = getActionParams(row, action);
                console.log(action);
            } catch (error) {
                console.error('Error getting action params:', error);
                action.value.params = {};
            }
        }
        router.get(typeof action.value === 'string' ? route(action.value) : route(action.value?.name, action.value?.params));
    }
    if (action.onClick) {
        action.onClick(row.original);
    }
};
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                <DotsHorizontalIcon class="h-4 w-4" />
                <span class="sr-only">Open menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-[160px]">
            <DropdownMenuItem v-for="action in menuActions" :key="action.label" class="px-0 py-0">
                <div class="h-full w-full cursor-pointer px-2 py-1.5" :class="action?.class" @click="handleAction(action, row)" v-if="!action.isHide">
                    <component class="mr-2 h-4 w-4" :is="action.icon" v-if="action.icon" />
                    {{ action.label }}
                </div>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
