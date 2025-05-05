import DataTableColumnHeader from "@/composables/table/DataTableColumnHeader.vue";
import { Product } from "@/types/product";
import { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: ({ column }) =>
            h(DataTableColumnHeader, {
                column,
                title: "Name"
            }),
        cell: ({ row }) => {
            return h("span", row.getValue('name'))
        }
    },
    {
        accessorKey: "price",
        header: ({ column }) =>
            h(DataTableColumnHeader, {
                column,
                title: "Price"
            }),
        cell: ({ row }) => {
            return h("span", row.getValue('price'))
        }
    },
]