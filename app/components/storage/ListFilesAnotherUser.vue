<script setup lang="ts">
import DonwloadButtonNew from './DonwloadButtonNew.vue';

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


const downloading = ref<boolean>(false);
const message = ref<{ type: string; text: string }>();

const onDownloadStart 	= () => {downloading.value = true};
const onDownloadEnd		= () => {downloading.value = false};
</script>

<template>

<TransitionGroup
		name="file-list"
		tag="div"
		class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
		<div
			class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 hover:border-green-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-green-400/10 backdrop-blur-sm"
		>
		<Transition name="bar">
			<div
				v-if="downloading === true"
				class="absolute inset-x-0 top-0 h-0.5 overflow-hidden"
			>
				<div class="h-full w-1/3 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-shimmer" />
			</div>
		</Transition>
        <!-- Акцентная линия сверху (проявляется на hover) -->
        <div
          class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <div class="p-5 flex flex-col gap-4 h-full">
          <!-- Информация о файле -->
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-green-500/10 border border-green-400/20 group-hover:bg-green-500/15 group-hover:border-green-400/30 transition-colors duration-300"
            >
				<svg class="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
				</svg>
            </div>
            <div class="flex-1 min-w-0">
				<div class="text-sm font-medium text-gray-100 truncate" :title="name">
					{{ name }}
				</div>
				<div class="text-xs text-gray-400/70 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
					<span>{{ formatFileSize(size) }}</span>
					<span class="w-1 h-1 rounded-full bg-gray-600" />
					<span class="truncate">{{ mime_type || 'неизвестно' }}</span>
				</div>
            </div>
          </div>

          <!-- Ошибка -->
          <div v-if="message?.type === 'error'" class="text-xs text-red-400/70">
            {{ message.text }}
          </div>

          <!-- Действия -->
		<div class="flex flex-col items-center justify-between gap-2 pt-3 border-t border-gray-700/40 mt-auto">
			<div class="flex-1 min-w-0">
				<DonwloadButtonNew 
					:storage_path="storage_path" 
					:name="name" 
					@download-start="onDownloadStart()"
					@download-end="onDownloadEnd()"
				/>
			</div>
			</div>
        </div>
      </div>
    </TransitionGroup>

	
</template>

<style scoped>

@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
.animate-shimmer {
  animation: shimmer 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.bar-enter-active,
.bar-leave-active { transition: opacity 0.2s ease; }
.bar-enter-from,
.bar-leave-to { opacity: 0; }

</style>