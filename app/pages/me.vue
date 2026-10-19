<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue';
import ListPosts from '~/components/posts/ListPosts.vue';
import ListFiles from '~/components/storage/ListFiles.vue';
import UploadFiles from '~/components/storage/UploadFiles.vue';
import p2p from './storage/p2p.vue';
import type { Database } from '~/types/database.types';
import type { UserLimit } from '~/types/getLimitStorageUser.types';
import Sidebar from '~/components/base/Sidebar.vue';

definePageMeta({
	middleware: 'auth'
})

const user = useSupabaseUser();

const limitStorage = ref<UserLimit>();
const currentFilesSize = ref();

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
		<div class="">
			<div class="">
				  <table class="w-max text-sm">
					<tbody class="">
						<tr>
							<th class="px-4 py-3 text-left text-gray-500">
								Name:
							</th>
							<td class="px-4 py-3 text-green-400/80">{{ user?.user_metadata?.first_name }}</td>
						</tr>
						<tr>
							<th class="px-4 py-3 text-left text-gray-500">
								Email:
							</th>
							<td class="px-4 py-3 text-green-400/80">{{ user?.email }}</td>
						</tr>
					</tbody>
				</table>
				
			</div>
		</div>

	</div>

</div>

</template>