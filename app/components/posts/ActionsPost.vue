<script setup lang="ts">
import type { Database } from '~/types/database.types';

const emit = defineEmits(['refreshPostsActions']);

const props = defineProps<{
	post_id: string
}>();

const {errorToast, successToast} = useToast();

const supabase = useSupabaseClient<Database>();
const messageErrorDelete = ref('');


async function checkOwnerPost() {
	const {data, error} = await supabase.from('user-posts')
		.select()
		.eq('post_id', props.post_id)
		
	if (data && getUser()?.user_metadata.sub === data[0]?.user_id) {
		return true;
	} else {
		return false;
	}
} 


async function deletePostById() {
	messageErrorDelete.value = '';
	const isOwner = await checkOwnerPost();
	if (isOwner) {
		const {error} = await supabase.from('user-posts')
			.delete()
			.eq('post_id', props.post_id)
		
		if (error) {
			errorToast();
		}
	} else {
		errorToast();
	}
	emit('refreshPostsActions');
	successToast();
	return;
}


</script>

<template>

	<div class="flex flex-col gap-5">
		<BaseButton @click="deletePostById" variant="danger" 
			class="w-max z-50 shadow-sm shadow-red-200/20 text-red-200/80 hover:shadow-red-200/80 hover:text-red-200">
			delete
		</BaseButton>
		<div v-if="messageErrorDelete" class="text-red-200/80">{{ messageErrorDelete }}</div>
	</div>
	
</template>