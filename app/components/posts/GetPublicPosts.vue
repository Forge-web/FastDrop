<script setup lang="ts">
import { getObjectDate } from '#imports';
import type { Database } from '~/types/database.types';
import CopyButton from './CopyButton.vue';

const props = defineProps<{
	body: string,
	created_at: string,
}>();

const supabase = useSupabaseClient<Database>()
const {errorToast, successToast} = useToast();


</script>

<template>
<div class="flex flex-col gap-6 justify-center rounded-xl w-full">
	<div class="w-full flex flex-col gap-3">
		<div 
			class="group relative z-0 flex flex-col gap-4 p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-800/60 hover:border-green-400/30 hover:shadow-lg hover:shadow-green-500/10"
		>
			<div class="flex justify-between items-start gap-3">
				<div class="flex w-full">
					<div class="w-full break-words flex flex-col gap-2">
						<div class="flex gap-2 text-gray-200/30">
							<div>{{ getObjectDate(created_at)?.date }}</div>
							<div>{{ getObjectDate(created_at)?.time }}</div>
						</div>
						<div class="max-w-80 text-gray-200 leading-relaxed">
							{{ body }}
						</div>
					</div>
				</div>
				
				<CopyButton :text= "body"/>
			</div>

		</div>
	</div>
</div>

</template>
