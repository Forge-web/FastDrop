<script setup lang="ts">

definePageMeta({
	keepalive: true
})

import CardUser from '~/components/CardUser.vue';

const client = useSupabaseClient();

async function search_user_result() {
	if (search_user_name.value != '') {
		const {data, error} = await client
			.from('users')
			.select(`id, name`)
			.eq('name', search_user_name.value);
		search_result.value = data;
	} else {
		search_result.value = '';
	}
};

let search_user_name = ref<string>('');
let search_result = ref();

</script>

<template>

<div class="relative w-full text-white flex flex-col gap-15">
	
	<div class="w-full flex gap-10">
		<form @submit.prevent="search_user_result"
			class="flex gap-5 w-full"
		>
			<UiInput
				v-model="search_user_name"
				placeholder="search" 
				type="text"
				@clear-input="search_user_name = ''"
			/>
			<BaseButton 
				class="w-max text-green-200/70 hover:text-green-200 shadow-lg shadow-green-200/25 rounded-xl hover:shadow-green-200/50 cursor-pointer"
				type="submit"
			>
				<Icon name="solar:minimalistic-magnifer-linear" />
			</BaseButton>
		</form>
	</div>
	<div v-if="!search_result" class="self-center">
		<NuxtLink to="rules" class="text-green-200/80">
			Правила
		</NuxtLink>
		<div class="text-red-200/70">
			Ваши файлы видны всем!
			В данный момент функция приватных файлов в разработке
		</div>
	</div>
	<div v-if="search_result" class="w-full">
		<div v-for="_user in search_result" 
			class="w-full flex flex-col items-center"
		>
			<NuxtLink class="w-full" :to="{name: 'profile-name', params:{name: _user.name}}">
				<CardUser
					:name="_user.name"
				/>
			</NuxtLink>
		</div>
	</div>
</div>

</template>