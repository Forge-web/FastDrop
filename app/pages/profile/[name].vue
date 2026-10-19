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
const publicFiles = ref();
const publicPosts = ref();
const stateMenu = ref<'files' | 'posts' | ''>('');



const getPublicFiles = async () => {
	const {data, error} = await supabase
		.from('user-files')
		.select('name, storage_path, size, mime_type')
		.eq('user_id', owner_id);
	
	if (data !== null)
		publicFiles.value = data
}

const getPublicPosts = async () => {
	const {data: posts, error} = await supabase.from('user-posts')
	.select()
	.match({user_id: owner_id, public: true});

	publicPosts.value = posts;
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
	await getPublicPosts();
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
			<div class="flex flex-col gap-5">
				<div v-if="publicFiles.length" v-for="item in publicFiles">
					<ListFilesAnotherUser
						:name="item.name"
						:storage_path="item.storage_path"
						:size="item.size"
						:mime_type="item.mime_type"
					/>
				</div>
				<div
					v-else
					class="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-dashed border-gray-700/60"
				>
						<div
						class="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 border border-green-400/20"
						>
							<svg class="w-7 h-7 text-green-300/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round"
								d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
							</svg>
						</div>
					<div class="text-gray-300 font-medium">Файлов пока нет</div>
				</div>
			</div>
		</div>

		<div
			v-if="stateMenu=='posts'"
			class="flex flex-col gap-5 p-5 rounded-xl"
		>
			<div class="">
				<GetPublicPosts 
					v-if="publicPosts.length"
					v-for="post in publicPosts"
					:body="post.body" 
					:created_at="post.created_at" 
				/>
				<div v-else class="flex justify-center text-center bg-gray-800/30 border border-dashed border-gray-700/50 p-8 rounded-xl text-gray-400">
					Тут пока нет постов
				</div>
			</div>
		</div>

	</div>

</template>