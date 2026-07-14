<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue';

const { data: rules } = await useAsyncData(() => {
	return queryCollection('content').where('description', '=' ,'rulse').order('id', 'DESC').all()
})

</script>

<template>
	<div class="flex flex-col gap-6">
		<div v-for="rule in rules" key="update.id">
			<BaseButton>
				<NuxtLink :to="rule.path">
					{{ rule.title }}
				</NuxtLink>
			</BaseButton>
		</div>
	</div>
</template>
