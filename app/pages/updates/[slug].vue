<script setup lang="ts">
const route = useRoute();

const { data: update } = await useAsyncData(route.path, () => {
	return queryCollection('content').path(route.path).first();
})

useSeoMeta({
  title: update.value?.title,
  description: update.value?.description
})
</script>

<template>
	<div class="
	prose-ul:list-disc 
	prose-h1:text-2xl prose-h1:mb-5
	prose-h2:text-xl prose-h2:mb-5
	prose-p:mb-5 prose-p:text-red-200
	">
	<div class="mb-2 text-gray-200/80">{{ update?.title }}</div>
		<ContentRenderer v-if="update" :value="update" />
		<div v-else>Patch Note not found</div>
	</div>
</template>
