<script setup lang="ts">
import { CheckIcon, PlusCircledIcon } from '@radix-icons/vue';
import type { Column } from '@tanstack/vue-table';
import type { Component } from 'vue';
import { computed } from 'vue';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DataTableFacetedFilter {
    column?: Column<any, any>;
    title?: string;
    options: {
        label: string;
        value: string;
        icon?: Component;
    }[];
}
const props = defineProps<DataTableFacetedFilter>();

const facets = computed(() => props.column?.getFacetedUniqueValues());
const selectedValues = computed(() => new Set(props.column?.getFilterValue() as string[]));

const filterFunction = (
    val: string[] | number[] | false[] | true[] | Record<string, any>[],
    term: string,
): string[] | number[] | false[] | true[] | Record<string, any>[] => {
    if (Array.isArray(val) && typeof val[0] === 'object') {
        return (val as { label: string; value: string; icon?: Component }[]).filter(
            (i: { label: string; value: string; icon?: Component }, index: number) => i.label.toLowerCase().includes(term.toLowerCase()),
        );
    }
    return val;
};
</script>

<template>
    <Popover>
        <PopoverTrigger as-child>
            <Button variant="outline" size="sm" class="h-8 border-dashed">
                <PlusCircledIcon class="mr-2 h-4 w-4" />
                {{ title }}
                <template v-if="selectedValues.size > 0">
                    <Separator orientation="vertical" class="mx-2 h-4" />
                    <Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
                        {{ selectedValues.size }}
                    </Badge>
                    <div class="hidden space-x-1 lg:flex">
                        <Badge v-if="selectedValues.size > 2" variant="secondary" class="rounded-sm px-1 font-normal">
                            {{ selectedValues.size }} selected
                        </Badge>

                        <template v-else>
                            <Badge
                                v-for="option in options.filter((option) => selectedValues.has(option.value))"
                                :key="option.value"
                                variant="secondary"
                                class="rounded-sm px-1 font-normal"
                            >
                                {{ option.label }}
                            </Badge>
                        </template>
                    </div>
                </template>
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[200px] p-0" align="start">
            <Command :filter-function="filterFunction">
                <CommandInput :placeholder="title" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                        <CommandItem
                            v-for="option in options"
                            :key="option.value"
                            :value="option"
                            @select="
                                (e) => {
                                    const isSelected = selectedValues.has(option.value);
                                    if (isSelected) {
                                        selectedValues.delete(option.value);
                                    } else {
                                        selectedValues.add(option.value);
                                    }
                                    const filterValues = Array.from(selectedValues);
                                    column?.setFilterValue(filterValues.length ? filterValues : undefined);
                                }
                            "
                        >
                            <div
                                :class="
                                    cn(
                                        'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                        selectedValues.has(option.value) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible',
                                    )
                                "
                            >
                                <CheckIcon :class="cn('h-4 w-4')" />
                            </div>
                            <component :is="option.icon" v-if="option.icon" class="text-muted-foreground mr-2 h-4 w-4" />
                            <span>{{ option.label }}</span>
                        </CommandItem>
                    </CommandGroup>

                    <template v-if="selectedValues.size > 0">
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem
                                :value="{ label: 'Clear filters' }"
                                class="justify-center text-center"
                                @select="column?.setFilterValue(undefined)"
                            >
                                Clear filters
                            </CommandItem>
                        </CommandGroup>
                    </template>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>
