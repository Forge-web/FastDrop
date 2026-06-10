<script setup lang="ts">

const client = useSupabaseClient();

async function search_user_result() {
	const {data, error} = await client
		.from('users')
		.select(`id, name`);
		// .eq('name', search_user_name.value);
	search_result.value = data;
};

let search_user_name = ref<string>('');
let search_result = ref();

</script>

<template>

<div class="relative w-full text-white grid grid-cols-1 gap-10 max-md:grid-cols-1 max-md:gap-10">
	
	<div class="w-full flex gap-10">
		<input 
			v-model="search_user_name" 
			class="text-green-200/70 text-warp py-2 px-5 w-full rounded-sm shadow-xl shadow-green-200/25 focus:outline-hidden focus:shadow-green-200/50 focus:border-0 focus:bg-gray-700/50" 
			placeholder="search" 
			type="text" 
		/>
		<button 
			class="p-5 text-green-200/70 hover:text-green-200 shadow-xl shadow-green-200/25 rounded-xl hover:shadow-green-200/50 cursor-pointer"
			@click="search_user_result"
		>
			search
		</button>
	</div>
	<div v-if="search_result">
		<pre>
			{{ search_result }}
		</pre>
	</div>
</div>

</template>