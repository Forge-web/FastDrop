<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue';
import ListFiles from '~/components/storage/ListFiles.vue';
import UploadFiles from '~/components/storage/UploadFiles.vue';
import type { Database } from '~/types/database.types';
import type { UserLimit } from '~/types/getLimitStorageUser.types';

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


const limitStorage = ref<UserLimit>(await getLimitStorageUser() as UserLimit);
const currentFilesSize = ref(limitStorage.value.use_of_limit as number);

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
		<div class="">
			<div v-if="typeof(limitStorage) == 'object' && typeof(limitStorage.limit) == 'number'" 
				class=""
			>
				{{ formatFileSize(currentFilesSize) }} / {{ formatFileSize(limitStorage.limit) }}
			</div>
			<div v-else
				class="text-red-200"
			>
				Не удалось рассчитать объем
			</div>
		</div>

		<ListFiles v-if="currentState==states.listFalse" />
		<UploadFiles v-if="currentState==states.uploadFiles" />
	</div>

</div>

</template>