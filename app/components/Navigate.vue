<script setup lang="ts">

import BaseButton from './BaseButton.vue';

const {navigateToUrl = '/', textButton = 'Перейти'} = defineProps<{
	navigateToUrl?: string,
	textButton?: string
}>();

</script>

<template>
	<div class="flex flex-col max-w-85 gap-10">
		<div class="wrap text-gray-200/80">
			Вы авторизованы, перейдите на другую страницу по кнопке ниже или по любой другой ссылке на панели вверху сайта
		</div>
		<NuxtLink :to="navigateToUrl">
			<BaseButton>
				{{textButton}}
			</BaseButton>
		</NuxtLink>
	</div>
</template>