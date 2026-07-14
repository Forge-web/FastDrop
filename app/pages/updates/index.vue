<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue';

const { data: updates } = await useAsyncData(() => {
	return queryCollection('content').where('description', '=' ,'updates').order('id', 'DESC').all()
})

</script>

<template>
	<div class="flex flex-col gap-6">
		<div v-for="update in updates" key="update.id">
			<BaseButton>
				<NuxtLink :to="update.path">
					{{ update.title }}
				</NuxtLink>
			</BaseButton>
		</div>
	</div>
</template>
