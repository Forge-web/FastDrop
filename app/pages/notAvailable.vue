<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue';

const appConfig = useAppConfig();

</script>

<template>

<div class="flex flex-col gap-10">

	<div class="text-center text-xl text-red-200/80">
		Страница недоступна
	</div>

	<div>
		<NuxtLink :to="appConfig.notavailable.navigateToPage.toString()">
			<BaseButton>
				Уйти
			</BaseButton>
		</NuxtLink>
	</div>

</div>

</template>