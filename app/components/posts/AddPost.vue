<script setup lang="ts">
import type { Database } from '~/types/database.types';

const emit = defineEmits(['refreshPosts']);

const {errorToast, successToast} = useToast();

const supabase = useSupabaseClient<Database>();
const user = getUser();

const modalState = ref(false);

//Field post
const addPostBody = ref('');
const publicPost = ref(false);


async function cancelPostModal() {
	modalState.value = false;
	addPostBody.value = '';
	
}

async function addPost() {
	
	const {error} = await supabase.from('user-posts')
		.insert({
			user_id: user?.user_metadata.sub as string,
			body: addPostBody.value,
			public: publicPost.value
		})

	if (error) {
		errorToast('Что-то пошло не так. Попробуйте позже.');	
		return;
	}

	await cancelPostModal();
	emit('refreshPosts');
	return;
}


</script>

<template>

<BaseButton @click="modalState = !modalState">
	Add
</BaseButton>


<Teleport to="#teleports">
	<div v-if="modalState" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
	
		<div class="flex flex-col gap-5 rounded-lg shadow-lg max-w-md w-full mx-4 p-6 transform transition-all">

			<BaseButton 
				@click="cancelPostModal"
				class="w-max"
			>
				Cancel
			</BaseButton>

			<div>
				<label for="user-text" class="text-lg">Text</label>
				<textarea id="user-text" v-model="addPostBody" class="w-full shadow-lg shadow-green-200/30 p-3 bg-gray-900/30 rounded-lg placeholder-green-700/50 focus:outline-none resize-y" rows="10" />
			</div>

			<div>
				<label class="flex items-center space-x-3 cursor-pointer">
					<!-- Скрываем нативный чекбокс -->
					<input type="checkbox" class="sr-only peer" v-model="publicPost">
					
					<!-- Рисуем свой квадрат -->
					<span class="w-6 h-6 flex items-center justify-center border-2 border-green-200/20 rounded-md peer-checked:bg-green-900/20 peer-checked:border-green-700 transition-colors duration-200">
						<!-- Галочка (SVG) – появляется при checked -->
						<svg class="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
						</svg>
					</span>
					
					<!-- Текст подписи -->
					<span class="text-lg text-gray-700">Public</span>
				</label>
			</div>

			<BaseButton 
				@click="addPost"
			>
				Save
			</BaseButton>

		</div>
	
	</div>
</Teleport>


</template>