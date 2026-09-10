<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue';
import ListPosts from '~/components/posts/ListPosts.vue';
import ListFiles from '~/components/storage/ListFiles.vue';
import UploadFiles from '~/components/storage/UploadFiles.vue';
import type { Database } from '~/types/database.types';
import type { UserLimit } from '~/types/getLimitStorageUser.types';

definePageMeta({
	middleware: 'auth'
})

const supabase = useSupabaseClient<Database>();

const message = ref<{type: string, text: string}>();

const states = {
	listFalse: 'listFalse',
	uploadFiles: 'uploadFiles',
	posts: 'posts'
};


const limitStorage = ref<UserLimit>();
const currentFilesSize = ref();

const currentState = ref(states.uploadFiles);

const menuState = ref(false);

const signOut = async () => {
	const { error } = await supabase.auth.signOut();
	await reloadNuxtApp();
	if (error) {
		message.value = {type: 'error', text: error.message};
		return;
	}
	
}

const changeStatePage = (toChangeState: string) => {
	if (toChangeState == currentState.value) {
		currentState.value = '';
	} else {
		currentState.value = toChangeState;
	}
}

onMounted(async () => {
	limitStorage.value = await getLimitStorageUser() as UserLimit;
	currentFilesSize.value = limitStorage.value.use_of_limit as number
});

</script>

<template>

<div class="flex justify-center w-full">
	<div
		class="flex flex-col gap-10 w-full"
	>
		<div>
			<BaseButton 
				:variant="menuState ? 'selected' : 'primary'"
				@click="menuState = !menuState"
				class=""
			>
				Menu
			</BaseButton>
		</div>
		
		<div
			class="flex flex-col gap-5"
			:class="menuState ? '' : 'hidden'"
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
		<div class="flex gap-5" :class="menuState ? '' : 'hidden'">
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
			<BaseButton
				@click="changeStatePage(states.posts)"
				:variant="currentState==states.posts ? 'selected' : 'primary'"
			>
				Posts
			</BaseButton>
		</div>
		<!-- <div :class="menuState ? '' : 'hidden'">
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
		</div> -->
		

		<ListFiles v-if="currentState==states.listFalse" />
		<UploadFiles v-if="currentState==states.uploadFiles" />
		<div v-if="currentState==states.posts">
			<Suspense>
				<template #default>
					<ListPosts />
				</template>
				<template #fallback>
					<div>Loading...</div>
				</template>
			</Suspense>
		</div>
	</div>

</div>

</template>