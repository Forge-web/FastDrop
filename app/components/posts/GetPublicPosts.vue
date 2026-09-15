<script setup lang="ts">
import { getObjectDate } from '#imports';
import type { Database } from '~/types/database.types';
import CopyButton from './CopyButton.vue';

const props = defineProps<{
	user_id: string
}>();

const supabase = useSupabaseClient<Database>()
const {errorToast, successToast} = useToast();

const {data, error} = await supabase.from('user-posts')
	.select()
	.match({user_id: props.user_id, public: true})

if (error) {
	errorToast('Ошибка при получении постов')
}

</script>

<template>

<div class="flex flex-col gap-5">
	<div v-for="post in data" class="flex p-5 shadow-lg shadow-gray-200/10 justify-between rounded-xl">
		<div class="flex flex-col gap-5">
			<div class="flex gap-2 text-gray-200/30">
				<div>{{ getObjectDate(post.created_at)?.date }}</div>
				<div>{{ getObjectDate(post.created_at)?.time }}</div>
			</div>
			<div class="text-lg">{{ post.body }}</div>
		</div>

		<div>
			<CopyButton :text="post.body" />
		</div>
		
	</div>
</div>

</template>
