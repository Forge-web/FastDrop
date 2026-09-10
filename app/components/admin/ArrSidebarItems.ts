import type { SidebarItem } from './types/Sidebar.js';
import Users from './Users.vue';

export default <SidebarItem[]>[
	{
		title: "users",
		pages: Users,
		active: true,
		isOpen: false
	},
];