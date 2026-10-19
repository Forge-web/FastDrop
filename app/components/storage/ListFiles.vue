<script setup lang="ts">
import type { JwtPayload, PostgrestError } from '@supabase/supabase-js';
import DownloadButton from './DownloadButton.vue';
import { formatFileSize } from '#imports';
import BaseButton from '../BaseButton.vue';
import type { Database, Tables } from '~/types/database.types.js';
import type { UserLimit } from '~/types/getLimitStorageUser.types.js';
import DonwloadButtonNew from './DonwloadButtonNew.vue';

const { errorToast, successToast } = useToast();

//ref
const message = ref<{ type: string; text: string }>();
const deletingIds = ref<string[]>([]);
const downloadingId = ref<string | null>(null);

//client
const supabase = useSupabaseClient<Database>();

//user
const user = useSupabaseUser();

//storage
const userFiles = ref<any[]>([]);
const loading = ref(false);

const loadUserFiles = async () => {
	if (!user.value) return;
	loading.value = true;
	const { data, error } = await supabase
		.from('user-files')
		.select('id, name, size, created_at, mime_type, storage_path')
		.eq('user_id', user.value.sub)
		.order('created_at', { ascending: false });
	loading.value = false;
	if (error) {
		errorToast();
		return;
	}
	userFiles.value = data || [];
};

const removeFile = async (file: Tables<'user-files'>, index: number) => {
	if (deletingIds.value.includes(file.id)) return;

	deletingIds.value = [...deletingIds.value, file.id];

	await new Promise((r) => setTimeout(r, 380));

	const { error: storageError } = await supabase.storage
		.from('user-files')
		.remove([file.storage_path]);

	if (storageError) {
		deletingIds.value = deletingIds.value.filter((id) => id !== file.id);
		errorToast();
		return;
	}

	const { error: dbError } = await supabase
		.from('user-files')
		.delete()
		.eq('storage_path', file.storage_path);

	if (dbError) {
		deletingIds.value = deletingIds.value.filter((id) => id !== file.id)
		errorToast();
		return;
	}

	userFiles.value.splice(index, 1);
	deletingIds.value = deletingIds.value.filter((id) => id !== file.id);
	successToast('Успешно удалено!');
};

// Склонение количества файлов
const fileCountLabel = computed(() => {
	const n = userFiles.value.length;
	if (n === 1) return '1 файл';
	if (n >= 2 && n <= 4) return `${n} файла`;
	return `${n} файлов`;
});

const onDownloadStart 	= (id: string) => {downloadingId.value = id};
const onDownloadEnd		= () => {downloadingId.value = null};

onMounted(async () => {
	await loadUserFiles();
});
</script>

<template>
	<div class="max-md:px-2 pt-2 pb-10 flex flex-col max-w-full gap-5 justify-center rounded-xl">
    <!-- Шапка -->
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div
          class="flex items-center justify-center w-11 h-11 rounded-xl bg-green-500/10 border border-green-400/20 shadow-lg shadow-green-400/10"
        >
          <svg class="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-100">Ваши файлы</h2>
          <p class="text-xs text-gray-400/70 mt-0.5">{{ fileCountLabel }}</p>
        </div>
      </div>
    </div>

    <!-- Загрузка -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="i in 2"
        :key="i"
        class="h-36 rounded-2xl bg-gray-800/40 border border-gray-700/40 animate-pulse"
      />
    </div>

    <!-- Список файлов -->
    <TransitionGroup
		v-else-if="userFiles.length"
		name="file-list"
		tag="div"
		class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
		<div
			v-for="(file, index) in userFiles"
			:key="file.id"
			class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 hover:border-green-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-green-400/10 backdrop-blur-sm"
			:class="[
				// — базовые стили карточки (у тебя уже есть) —
				'group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 backdrop-blur-sm',
				// — плавность и origin —
				'origin-center transition-[opacity,transform,filter,box-shadow,border-color] duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
				// — состояние «удаляется» vs «обычное» —
				deletingIds.includes(file.id)
					? 'opacity-0 scale-[0.88] -rotate-2 blur-[2px] pointer-events-none shadow-2xl shadow-red-500/30 ring-2 ring-red-400/70 border-red-400/50'
					: 'opacity-100 scale-100 rotate-0 blur-0 shadow-lg shadow-green-400/10',
			]"
		>
		<Transition name="bar">
			<div
				v-if="downloadingId === file.id"
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
              <div class="text-sm font-medium text-gray-100 truncate" :title="file.name">
                {{ file.name }}
              </div>
              <div class="text-xs text-gray-400/70 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{{ formatFileSize(file.size) }}</span>
                <span class="w-1 h-1 rounded-full bg-gray-600" />
                <span class="truncate">{{ file.mime_type || 'неизвестно' }}</span>
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
					:storage_path="file.storage_path" 
					:name="file.name" 
					@download-start="onDownloadStart(file.id)"
					@download-end="onDownloadEnd()"
				/>
			</div>
			<button
				class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-300/90 bg-red-500/5 border border-red-400/20 hover:bg-red-500/15 hover:border-red-400/40 hover:shadow-lg hover:shadow-red-400/20 duration-200 cursor-pointer"
				@click="removeFile(file, index)"
			>
				<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
				</svg>
				Удалить
			</button>
			</div>
        </div>
      </div>
    </TransitionGroup>

    <!-- Пустое состояние -->
	<div
		v-else
		class="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-dashed border-gray-700/60"
	>
			<div
			class="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 border border-green-400/20"
			>
				<svg class="w-7 h-7 text-green-300/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round"
					d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
				</svg>
			</div>
			<div class="text-gray-300 font-medium">Файлов пока нет</div>
			<div class="text-sm text-gray-500">Загрузите первый файл, чтобы он появился здесь</div>
		</div>
	</div>
</template>

<style scoped>
.file-list-enter-active,
.file-list-leave-active {
  transition: all 0.3s ease;
}
.file-list-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
.file-list-leave-to {
  opacity: 0;
  transform: translateX(-12px) scale(0.96);
}
.file-list-move {
  transition: transform 0.3s ease;
}

.file-move {
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Появление новых карточек (после загрузки / добавления) */
.file-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.file-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

/* Бегущая полоска во время загрузки*/
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