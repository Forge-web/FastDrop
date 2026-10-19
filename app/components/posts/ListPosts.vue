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

	<div class="flex flex-col gap-6 justify-center rounded-xl w-full">
		<h2 class="text-2xl font-bold tracking-tight text-gray-100">POSTS</h2>		
		
		<div class="w-max">
			<AddPost @refresh-posts="getPosts"/>
		</div>

		<div class="w-full flex flex-col gap-3">
			<div 
				v-if="posts?.length" 
				v-for="post in posts"
				:key="post.post_id"
				class="group relative z-0 flex flex-col gap-4 p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-800/60 hover:border-green-400/30 hover:shadow-lg hover:shadow-green-500/10"
			>
				<div class="flex justify-between items-start gap-3">
					<div class="flex w-full" @click="addStateMenu(post.post_id)">
						<div class="w-full break-words flex flex-col gap-2">
							<div class="flex items-center gap-2 text-sm">
								<span class="text-gray-400">public:</span>
								<span 
									:class="post.public 
										? 'bg-green-500/15 text-green-400 border-green-500/30' 
										: 'bg-red-500/15 text-red-400 border-red-500/30'"
									class="px-2 py-0.5 text-xs font-semibold rounded-full border"
								>
									{{ post.public }}
								</span>
							</div>
							<div class="max-w-80 text-gray-200 leading-relaxed">
								{{ post.body }}
							</div>
						</div>
					</div>
					
					<CopyButton :text="post.body"/>
				</div>

				<div v-if="stateActionsMenu === post.post_id" class="z-0 pt-3 border-t border-gray-700/50">
					<ActionsPost @refresh-posts-actions="getPosts" :post_id="post.post_id"/>
				</div>
			</div>

			<div v-else class="flex justify-center text-center bg-gray-800/30 border border-dashed border-gray-700/50 p-8 rounded-xl text-gray-400">
				У вас пока нет постов
			</div>
		</div>
	</div>

</template>