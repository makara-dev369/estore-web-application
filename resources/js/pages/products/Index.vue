<script setup lang="ts">
import DataTable from '@/composables/table/DataTable.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { BreadcrumbItem } from '@/types';
import { Product } from '@/types/product';
import { PageData, TableInfo } from '@/types/table';
import { Head } from '@inertiajs/vue3';
import { columns } from './data/columns';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: '/products',
    },
];

const tableInfo: TableInfo = {
    route: 'products.index',
    hidden_columns: [],
    button_toolbar: [],
};
const props = defineProps<{
    data: PageData<Product>;
}>();
</script>

<template>
    <Head title="Products" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <h2 class="font-bold">Product List</h2>
            <DataTable :data="data" :columns="columns" :tableInfo="tableInfo" />
        </div>
    </AppLayout>
</template>
