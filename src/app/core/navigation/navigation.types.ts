import { FuseNavigationItem } from '@fuse/components/navigation';

export interface Navigation
{
    compact: FuseNavigationItem[];
    default: FuseNavigationItem[];
    futuristic: FuseNavigationItem[];
    horizontal: FuseNavigationItem[];
}

export const defaults = [
    {
        id: 1,
        ids: "menu",
        title: "Menu",
        subtitle: "",
        type: "group",
        icon: "",
        label: "Label",
        link: "",
        layout: "default",
        parent: 0,
        settings: { upload: false, add: false, delete: false, },
        access: 0
    },
    {
        id: 2,
        ids: "menu.dashboard",
        title: "Dashboard",
        subtitle: "",
        type: "basic",
        icon: "",
        label: "Parent",
        link: "/dashboard",
        layout: "default",
        parent: 1,
        settings: { upload: false, add: false, delete: false, },
        access: 0
    },
    {
        id: 3,
        ids: "menu.track-completion",
        title: "Track Completion",
        subtitle: "",
        type: "basic",
        icon: "",
        label: "Parent",
        // link: "/report/report-view-crt/CRT--Update Employee Upload Template",
        link: "/search/track-completion",
        layout: "default",
        parent: 1,
        settings: { upload: false, add: false, delete: false, },
        access: 0
    },
    {
        id: 4,
        ids: "menu.users",
        title: "Users",
        subtitle: "",
        type: "basic",
        icon: "",
        label: "Parent",
        link: "/search/users",
        path: "CRT/users",
        layout: "default",
        parent: 1,
        settings: { upload: true, add: true, delete: true, },
        access: 0
    },
    //admin

    {
        id: 3,
        ids: "menu.crt-reports",
        title: "CRT Reports",
        subtitle: "",
        type: "basic",
        icon: "",
        label: "Parent",
        // link: "/report/report-view-crt/CRT--Update Employee Upload Template",
        link: "/search/crt-reports",
        layout: "default",
        parent: 1,
        settings: { upload: false, add: false, delete: false, },
        access: 1
    },

    // {
    //     id: 5,
    //     ids: "menu.client",
    //     title: "Client",
    //     subtitle: "",
    //     type: "collapsable",
    //     icon: "",
    //     label: "Parent",
    //     link: "",
    //     layout: "default",
    //     parent: 1,
    //     settings: { upload: false, add: false, delete: false, },
    //     access: 1
    // },
    // {
    //     id: 6,
    //     ids: "menu.client.client-list",
    //     title: "Client List",
    //     subtitle: "",
    //     type: "basic",
    //     icon: "",
    //     label: "Child",
    //     link: "/layout/view/client-list",
    //     layout: "default",
    //     parent: 5,
    //     settings: { upload: false, add: false, delete: false, },
    //     access: 1
    // },
    // {
    //     id: 7,
    //     ids: "menu.add-client",
    //     title: "Add Client",
    //     subtitle: "",
    //     type: "basic",
    //     icon: "",
    //     label: "Parent",
    //     link: "/layout/add-client/view",
    //     layout: "default",
    //     parent: 1,
    //     settings: { upload: false, add: false, delete: false, },
    //     access: 1
    // },
    // {
    //     id: 8,
    //     ids: "menu.user-management",
    //     title: "User Management",
    //     subtitle: "",
    //     type: "basic",
    //     icon: "",
    //     label: "Parent",
    //     link: "/layout/view/user-management",
    //     layout: "default",
    //     parent: 1,
    //     settings: { upload: false, add: false, delete: false, },
    //     access: 1
    // },
    // {
    //     id: 9,
    //     ids: "menu.generate-salad",
    //     title: "Generate Salad",
    //     subtitle: "",
    //     type: "collapsable",
    //     icon: "",
    //     label: "Parent",
    //     link: "/layout/generate-salad",
    //     layout: "default",
    //     parent: 1,
    //     settings: { upload: false, add: false, delete: false, },
    //     access: 1
    // },
    // {
    //     id: 10,
    //     ids: "menu.generate-salad.salad-information",
    //     title: "Salad Information",
    //     subtitle: "",
    //     type: "basic",
    //     icon: "",
    //     label: "Child",
    //     link: "/layout/view/salad-information",
    //     layout: "default",
    //     parent: 9,
    //     settings: { upload: false, add: false, delete: false, },
    //     access: 1
    // },
    // {
    //     id: 11,
    //     ids: "menu.salad-form.salad-form",
    //     title: "Salad Form",
    //     subtitle: "",
    //     type: "basic",
    //     icon: "",
    //     label: "Child",
    //     link: "/layout/view/salad-form",
    //     layout: "default",
    //     parent: 9,
    //     settings: { upload: false, add: false, delete: false, },
    //     access: 1
    // }
]