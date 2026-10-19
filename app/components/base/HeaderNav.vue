<script setup lang="ts">

type item = {
	label: string,
	to?: string,
	active?: boolean
}
const props = defineProps<{
	items: item[]
}>();

</script>

<template>

	<div v-for="item_headr in props.items" class="" :class="item_headr.active ? 'text-green-200' : 'text-gray-500' ">
		<NuxtLink :to="item_headr.to">
			{{ item_headr.label }}
		</NuxtLink>
	</div>

</template>