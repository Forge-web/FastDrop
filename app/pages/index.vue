<script setup lang="ts">
import CardUser from '~/components/CardUser.vue';

const client = useSupabaseClient();

async function search_user_result() {
	if (search_user_name.value != '') {
		const {data, error} = await client
			.from('users')
			.select(`id, name`);
			// .eq('name', search_user_name.value);
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
			<input 
				v-model="search_user_name"
				class="text-green-200/70 text-warp py-2 px-5 w-full rounded-sm shadow-lg shadow-green-200/25 focus:outline-hidden focus:shadow-green-200/50 focus:border-0 focus:bg-gray-700/50" 
				placeholder="search" 
				type="text" 
			/>
			<button 
				class="p-5 text-green-200/70 hover:text-green-200 shadow-lg shadow-green-200/25 rounded-xl hover:shadow-green-200/50 cursor-pointer"
				type="submit"
			>
				search
			</button>
		</form>
	</div>
	<div v-if="search_result">
		<div v-for="_user in search_result" >
			<NuxtLink :to="{name: 'profile-name', params:{name: _user.name}}">
				<CardUser
					:name="_user.name"
				/>
			</NuxtLink>
		</div>
	</div>
</div>

</template>