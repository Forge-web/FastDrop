<script setup lang="ts">
const route = useRoute();

const { data: rule } = await useAsyncData(route.path, () => {
	return queryCollection('content').path(route.path).first();
})

useSeoMeta({
  title: rule.value?.title,
  description: rule.value?.description
})
</script>

<template>
	<div class="
	prose-ul:list-disc 
	prose-h1:text-xl prose-h1:mb-5 
	prose-p:mb-5 prose-p:text-red-200">
		<ContentRenderer v-if="rule" :value="rule" />
		<div v-else>Patch Note not found</div>
	</div>
</template>
