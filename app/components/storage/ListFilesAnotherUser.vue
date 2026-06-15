<script setup lang="ts">

import DownloadButton from './DownloadButton.vue';
import { formatFileSize } from '#imports';


//props
const props = defineProps({
	name: {
		type: String,
		required: true
	},
	storage_path: {
		type: String,
		required: true
	},
	size: {
		type: Number,
		required: true
	},
	mime_type: {
		type: String,
		required: true
	}

})

</script>

<template>


<div
	class="flex flex-col rounded-xl shadow-xl p-5"
>
	<div><span class="text-gray-400/80">Name:</span> <span class="">{{ props.name }}</span></div>
	<div><span class="text-gray-400/80">Size:</span> <span class="">{{ formatFileSize(props.size) }}</span></div>
	<div><span class="text-gray-400/80">Type:</span> <span class="">{{ props.mime_type }}</span></div>


	<div class="flex flex-col gap-2">
		<DownloadButton
			:storage_path="props.storage_path"
		/>
	</div>

</div>



</template>