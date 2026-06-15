<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue';
import ListFiles from '~/components/storage/ListFiles.vue';
import UploadFiles from '~/components/storage/UploadFiles.vue';
import type { Database } from '~/types/database.types';

definePageMeta({
	middleware: ['auth']
})

const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();

const message = ref<{type: string, text: string}>();

const states = {
	listFalse: 'listFalse',
	uploadFiles: 'uploadFiles'
};

const currentState = ref(states.uploadFiles);


const signOut = async () => {
	const { error } = await supabase.auth.signOut();
	if (error) {
		message.value = {type: 'error', text: error.message};
	}
	reloadNuxtApp();
}

const changeStatePage = (toChangeState: string) => {
	console.log(toChangeState);
	if (toChangeState == currentState.value) {
		currentState.value = '';
	} else {
		currentState.value = toChangeState;
	}
}

</script>

<template>

<div class="flex justify-center">

	<!-- <div class="flex flex-col gap-10"
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
	</div> -->

	<div
		class="flex flex-col gap-10"
	>

		<div 
			class="flex flex-col gap-5"
		>
			<BaseButton @click="signOut">
				Выйти из аккаунта
			</BaseButton>
			<BaseButton
				v-if="currentState==states.listFalse"
				disabled
			>
				Удалить все файлы
			</BaseButton>
		</div>
		<div class="flex gap-5 ">
			<BaseButton 
				@click="changeStatePage(states.listFalse)" 
				:variant="currentState==states.listFalse ? 'selected': 'primary'"
			>
				Список файлов
			</BaseButton>
			<BaseButton
				@click="changeStatePage(states.uploadFiles)" 
				:variant="currentState==states.uploadFiles ? 'selected': 'primary'"
			>
				Загрузить файлы
			</BaseButton>
		</div>

		<ListFiles v-if="currentState==states.listFalse" />
		<UploadFiles v-if="currentState==states.uploadFiles" />
	</div>

</div>

</template>