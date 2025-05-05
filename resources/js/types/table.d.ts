import { ActionType } from "@/enums/action_menu";
import { RouteParams, RouteName } from "ziggy-js";
import type { Component } from "vue";
interface PageData<T> {
    id: unknown;
    data: T[];
    current_page: number;
    per_page: number;
    last_page: number;
    total: number;
    filter?: any;
    filter_type?: string;
    search: string;
    sort_field: string;
    sort_direction: string;

    filter_by?: string; // filter by column name
    filter_value?: string; // filter value
}
interface TableInfo {
    table_id?: string;
    is_searchable?: boolean;
    route: RouteConfig | string;
    is_hide_manage_column?: boolean;
    is_hide_pagination?: boolean;
    hidden_columns: string[];
    button_toolbar: ToolbarAction[];
    filter_toolbar?: filterToolbar[];
    filter_by_option?: filterByOption
}

interface ToolbarAction {
    value: RouteConfig | string;
    type: ActionType;
    isHide?: boolean;
    label: string;
    class?: string;
    icon?: Component;
    onClick?: (data?: any) => void;
}
interface filterToolbar {
    title: string;
    column: string;
    data: filterToolbarData[];
}
interface filterByOption {
    title: string;
    data: filterToolbarData[];
}
interface filterToolbarData {
    value: string;
    label: string;
    icon?: Component;
}

interface RouteConfig<T extends RouteName = RouteName> {
    name: T;
    params?: RouteParams<T>;
}
export type { PageData, TableInfo, RouteConfig, ToolbarAction };
