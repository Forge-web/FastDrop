<script setup lang="ts">
import ListFiles from '~/components/user/listFiles.vue';


const user = useSupabaseUser();


</script>

<template>

<div class="flex justify-center">

	<div class="flex flex-col gap-10"
		v-if="!user"
	>	
		<div>
			<p class="text-red-300/80 text-wrap max-w-50">
				Выполните вход в аккаунт, чтобы иметь полный функционал над файлами
			</p>
		</div>
		<div class="flex flex-col max-w-50 gap-10">
			<button 
				class="p-5 text-green-200 shadow-xl shadow-green-200/25 rounded-xl hover:shadow-green-200/50 cursor-pointer"
				@click="navigateTo('/login')"
			>
				LogIn
			</button>
			<button 
				class="p-5 text-green-200 shadow-xl shadow-green-200/25 rounded-xl hover:shadow-green-200/50 cursor-pointer"
				@click="navigateTo('/register')"
			>
				Register
			</button>
		</div>
	</div>

	<div v-else>
		<ListFiles />
	</div>

</div>

</template>