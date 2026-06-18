<script setup lang="ts">
import ListFilesAnotherUser from '~/components/storage/ListFilesAnotherUser.vue';
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

const getPublicFiles = async () => {
	const {data, error} = await supabase
		.from('user-files')
		.select('name, storage_path, size, mime_type')
		.eq('user_id', owner_id);
	
	if (data !== null)
		publicFiles.value = data
}


const publicFiles = ref();


onMounted(async () => {
	await getPublicFiles();
});

</script>

<template>

	<div class="flex flex-col justify-center gap-10 max-md:px-10">

		<div class="text-xl w-full">
			Профиль: <span> {{ userName }} </span>
		</div>

		<div class="flex flex-col gap-2">
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

</template>