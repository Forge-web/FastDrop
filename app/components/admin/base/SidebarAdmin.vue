<script setup lang="ts">
import type { SidebarItem } from '../types/Sidebar';

const props = defineProps<{
	items: SidebarItem[]
}>();

const openPages = ref<Object[]>([]);

function openPage(item: SidebarItem) {
	item.isOpen = !item.isOpen;
	if (item.isOpen) {
		openPages.value.push(item.pages)
	} else {
		const indexDelete = openPages.value.indexOf(item);
		openPages.value.splice(indexDelete, 1);
	}
}

</script>

<template>
	<div class="flex gap-10 w-full max-md:flex-col">
		
		<div class="shadow-lg shadow-green-200/20 rounded-xl p-3 wrap">
			<Button 
				v-for="item in props.items.values()"
				:class="item.isOpen ? 'opacity-100 shadow-lg' : 'opacity-40'"
				class="px-5 py-2 cursor-pointer hover:shadow-lg shadow-gray-200/40 rounded-md"
				@click="openPage(item)"
			>
				<div class="text-lg">{{ item.title }}</div>
			</Button>
		</div>
	
	
		<div class="max-md:min-h-auto max-md:min-w-auto flex flex-col min-h-150 shadow-lg shadow-green-200/20 rounded-xl max-w-200 min-w-200 items-center justify-start">
			<div v-for="page in openPages.values()">
				<component :is="page"/>
			</div>
		</div>
	</div>

</template>