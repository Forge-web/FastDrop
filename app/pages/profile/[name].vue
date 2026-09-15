<script setup lang="ts">
import ListFilesAnotherUser from '~/components/storage/ListFilesAnotherUser.vue';
import GetPublicPosts from '~/components/posts/GetPublicPosts.vue';
import type { Database } from '~/types/database.types';

const supabase = useSupabaseClient<Database>();

const route = useRoute();
const userName = route.params.name as string;


const getOwnerID = async () => {
	const {data: ownerData} = await supabase
		.from('users')
		.select('auth_id')
		.eq('name', userName);
	
	if (ownerData !== null && ownerData[0]?.auth_id !== undefined)
		return  ownerData[0].auth_id;
	
	else return;

}


const owner_id = await getOwnerID() as string;
console.log(owner_id)
const publicFiles = ref();
const stateMenu = ref<'files' | 'posts' | ''>('');



const getPublicFiles = async () => {
	const {data, error} = await supabase
		.from('user-files')
		.select('name, storage_path, size, mime_type')
		.eq('user_id', owner_id);
	
	if (data !== null)
		publicFiles.value = data
}


const changeStateMenu = (state: 'files' | 'posts' | '') => {
	if (stateMenu.value !== state) {
		stateMenu.value = state
	} else {
		stateMenu.value = ''
	}
}


onMounted(async () => {
	await getPublicFiles();
});

</script>

<template>

	<div class="flex flex-col justify-center gap-10">

		<div class="text-xl w-full">
			Профиль: <span> {{ userName }} </span>
		</div>

		<div class="flex gap-5">
			<div>
				<BaseButton
					:variant="stateMenu == 'files' ? 'selected' : 'primary'"
					@click="changeStateMenu('files')"
				>
					Files
				</BaseButton>
			</div>

			<div>
				<BaseButton 
					:variant="stateMenu == 'posts' ? 'selected' : 'primary'"
					@click="changeStateMenu('posts')"
				>
					Posts
				</BaseButton>
			</div>
		</div>

		<div
			v-if="stateMenu=='files'"
			class="flex flex-col gap-2 p-5 rounded-xl"
		>
			<div class="text-xl">
				Files
			</div>
			<div class="flex flex-col gap-5">
				<div v-for="item in publicFiles">
					<ListFilesAnotherUser
						:name="item.name"
						:storage_path="item.storage_path"
						:size="item.size"
						:mime_type="item.mime_type"
					/>
				</div>
			</div>
		</div>

		<div
			v-if="stateMenu=='posts'"
			class="flex flex-col gap-5 p-5 rounded-xl"
		>
			<div class="text-xl">
				Posts
			</div>

			<div class="">
				<GetPublicPosts :user_id="owner_id" />
			</div>
		</div>

	</div>

</template>