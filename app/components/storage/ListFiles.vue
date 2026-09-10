<script setup lang="ts">
import type { JwtPayload, PostgrestError } from '@supabase/supabase-js';
import DownloadButton from './DownloadButton.vue';
import { formatFileSize } from '#imports';
import BaseButton from '../BaseButton.vue';
import type { Database, Tables } from '~/types/database.types.js';
import type { UserLimit } from '~/types/getLimitStorageUser.types.js';


const {errorToast, successToast} = useToast();

//ref
const message = ref<{type: string, text: string}>();

//client
const supabase = useSupabaseClient<Database>();

//user
const user = useSupabaseUser();


//storage
const userFiles = ref<any[]>([]);
// const limitStorage = ref<UserLimit>(await getLimitStorageUser() as UserLimit);
// const currentSizeFiles = ref();


const loadUserFiles = async () => {
	if (!user.value) return
	const { data, error } = await supabase
		.from('user-files')
		.select('id, name, size, created_at, mime_type, storage_path')
		.eq('user_id', user.value.sub)
		.order('created_at', { ascending: false})
	if (error) {
		errorToast();
		return;
	} else {
		userFiles.value = data || []
	} 
}


const removeFile = async (file: Tables<'user-files'>, index: number) => {
	const {data: storageData, error: storageError} = await supabase.storage
		.from('user-files')
		.remove([file.storage_path])
	
	const {data: dbData, error: dbError} = await supabase
		.from('user-files')
		.delete()
		.eq('storage_path', file.storage_path)

	if (storageError) {
		// message.value = {type: 'error', text: storageError.message}
		errorToast();
		return;
	}
		

	if (dbError) {
		// message.value = {type: 'error', text: dbError.message}
		errorToast();
		return;
	}

	// currentSizeFiles.value -= file.size as number;
	userFiles.value.splice(index, 1);

	successToast('Успешно удалено!');
}


onMounted(async () => {
	await loadUserFiles();
	// limitStorage.value = await getLimitStorageUser() as UserLimit;
	// currentSizeFiles.value = limitStorage.value.use_of_limit as number;
});

</script>

<template>

<div class="">
	<div class="max-md:px-2 pt-2 pb-10 flex flex-col max-w-full gap-5 justify-center rounded-xl">
		<div class="text-xl ">Фаши файлы</div>
		
		<div v-for="file, index in userFiles" :key="file.id"
			class="w-full flex flex-col self-center px-5 py-2 rounded-xl shadow-lg shadow-green-200/20"
		>
		
			<div><span class="text-gray-400/80">Name:</span> <span class="">{{ file.name }}</span></div>
			<div><span class="text-gray-400/80">Size:</span> <span class="">{{ formatFileSize(file.size) }}</span></div>
			<div><span class="text-gray-400/80">Type:</span> <span class="">{{ file.mime_type }}</span></div>
			<div v-if="message?.type=='error'" class="text-red-400/50">{{ message.text }}</div>
		

			<div class="flex flex-col gap-2 px-5">
				<div class="w-max">
					<DownloadButton
						:storage_path="file.storage_path"
					/>
				</div>
				<div class="w-max">
					<button 
						class="text-red-300/90 inline-flex items-center justify-center px-4 py-2 rounded-md font-medium duration-200 cursor-pointer hover:shadow-xl hover:shadow-red-300/30"
						@click="removeFile(file, index)"
					>
						<svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
							<g clip-rule="evenodd" fill="#28303f" fill-rule="evenodd">
								<path d="m10.773 1.22711c.2929.29289.2929.76776 0 1.06066l-8.48528 8.48523c-.29289.2929-.76776.2929-1.06066 0-.292889-.2928-.292889-.7677 0-1.06061l8.48529-8.48528c.29285-.292896.76775-.292896 1.06065 0z" opacity=".4" fill="#28303f" style="fill: rgb(242, 64, 64);"></path>
								<path d="m10.7729 10.773c-.2929.2929-.7678.2929-1.06067 0l-8.48528-8.48528c-.292893-.29289-.292892-.76776 0-1.06066.29289-.29289.76777-.29289 1.06066 0l8.48529 8.48529c.2929.29285.2929.76775 0 1.06065z" fill="#28303f" style="fill: rgb(242, 64, 64);"></path>
							</g>
						</svg>
						Удалить
					</button>
				</div>
			</div>
			
		</div>
	</div>
</div>

</template>