<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue';
</script>

<template>

<div class="flex flex-col gap-5">

	<NuxtLink to="updates">
		<BaseButton>
			Обновления
		</BaseButton>
	</NuxtLink>

	<NuxtLink to="rules">
		<BaseButton>
			Правила
		</BaseButton>
	</NuxtLink>

</div>

</template>