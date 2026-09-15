<script setup lang="ts">
import type { Database, Tables } from '~/types/database.types.js';
import AddPost from './AddPost.vue';
import ActionsPost from './ActionsPost.vue';
import CopyButton from './CopyButton.vue'


const {errorToast, successToast} = useToast();

const supabase = useSupabaseClient<Database>();

const stateActionsMenu = ref('');
const posts = ref<Tables<'user-posts'>[]>();

async function getPosts() {
	const {data, error} = await supabase.from('user-posts')
		.select()
		.eq('user_id', getUser()?.user_metadata.sub as string);
	
	if (data) posts.value = data.reverse();
}	

function addStateMenu(item_id: string){
	if (stateActionsMenu.value === item_id) {
		stateActionsMenu.value = '';
	} else {
		stateActionsMenu.value = item_id;
	}
}

await getPosts();

onMounted(async () => {
	await getPosts()
});

</script>

<template>

	<div class="flex flex-col gap-5 justify-center rounded-xl w-full">
		<div class="text-xl">POSTS</div>		
		
		<div class="w-max">
			<AddPost @refresh-posts="getPosts"/>
		</div>

		<div class="w-full flex flex-col gap-3 ">
			<div v-if="posts?.length" v-for="post in posts"
				class="z-0 flex flex-col gap-5 p-3 bg-gray-900/20 rounded-xl cursor-pointer hover:shadow-lg hover:shadow-green-200/20"
			>
				<div class="flex justify-between">
					<div class="flex w-full" @click="addStateMenu(post.post_id)">
						<div class="w-full break-words flex flex-col gap-2">
							<div>
								public: 
								<span :class="post.public ? 'text-green-500/50':'text-red-500/50'">{{ post.public }}</span>
							</div>
							<div class="max-w-80">
								{{ post.body }}
							</div>
						</div>
					</div>
					
					<CopyButton :text="post.body"/>
				</div>

				<div v-if="stateActionsMenu === post.post_id" class="z-0">
					<ActionsPost @refresh-posts-actions="getPosts" :post_id="post.post_id"/>
				</div>
			</div>

			<div v-else class="flex justify-center text-center bg-gray-600/20 p-5 rounded-xl">
				У вас пока нет постов
			</div>
		</div>
	</div>

</template>