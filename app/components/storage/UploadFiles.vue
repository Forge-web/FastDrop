<script setup lang="ts">
import type { Database } from '~/types/database.types';
import DragDropFile from './DragDropFile.vue';
import type { UserLimit } from '~/types/getLimitStorageUser.types.js';

type BodyFile = {
  lastModified: number,
  lastModifiedDate: any,
  name: string,
  size: number,
  type: string,
  webkitRelativePath: string,
}

enum StatusUploadFile {
  uploading = 'Загрузка...',
  done = 'Успешно',
  error = 'Ошибка',
}

type bucketFiles = {
  body: BodyFile,
  status: StatusUploadFile

}[]

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const uploadingFile = ref(false);
const fileUploadProgress = ref(0);
const uploadedFiles = ref<bucketFiles>([]);
const limitStorage = ref<UserLimit>(await getLimitStorageUser() as UserLimit);
const currentBucketSize = ref(0);

const message = ref<{type: string, text: string}>();

const uploadToStorage = async (file: bucketFiles[0]) => {
  if (user && user.value) {
    try {
        // Создаём путь: user-files/{user_id}/{timestamp}_{original_name}
        const timestamp = Date.now()
        // const safeName = file.body.name.replace(/[^a-zA-Z0-9.-]/g, '')
        const safeName = file.body.name;
        const filePath = `${user.value.sub}/${timestamp}_${safeName}`
    
        // Загружаем в Storage
        const { data, error: uploadError } = await supabase.storage
          .from('user-files')
          .upload(filePath, file.body, {
            cacheControl: '3600',
            upsert: false
          })
    
        if (uploadError) throw uploadError
    
        // Получаем публичный URL (если bucket публичный) или создаём signed URL
        // Для приватных файлов лучше не хранить постоянный URL, а генерировать при скачивании.
        // Здесь сохраним путь, а URL будем запрашивать динамически.
    
        // Сохраняем метаданные в таблицу
        const { error: dbError } = await supabase
          .from('user-files')
          .insert({
            user_id: user.value.sub,
            name: file.body.name,
            storage_path: filePath,
            size: file.body.size,
            mime_type: file.body.type,
          })
        
          file.status = StatusUploadFile.done;
        
        if (dbError) throw dbError
    
        // Обновляем список
      } catch (err: any) {
        message.value = { type: 'error', text: err.message + " " + err }
        file.status = StatusUploadFile.error;
      } finally {
        uploadingFile.value = false
        fileUploadProgress.value = 0
      }
  }
}

const itrUploadToStorage = async () => {
  if (currentBucketSize.value <= limitStorage.value.available_limit.valueOf() && currentBucketSize.value <= 52_428_800)
    uploadedFiles.value.forEach(async file => {
      await uploadToStorage(file)    
    });
  else {
    uploadedFiles.value.forEach(file => {
      file.status = StatusUploadFile.error
    });
    message.value = {type: 'error', text: 'Размер загружаемых файлов > доступного лимита'}
    return;
  }
}

const handleUploadFiles = async (files: BodyFile[]) => {
  files.forEach(async file=> {
    let fileData = {body: file, status:StatusUploadFile.uploading};
    currentBucketSize.value += file.size;
    uploadedFiles.value.push(fileData)
  })
  await itrUploadToStorage();
}

</script>

<template>

<div class="">
	
	<!-- <div class="border-2 border-gray-300 rounded-lg p-6 text-center bg-card transition-colors duration-300 text-foreground border-dashed">
    <p></p>
	</div> -->
	
  <DragDropFile @files="handleUploadFiles"/>

  <div v-if="uploadedFiles.length" class="mt-6">
      <h2 class="text-xl font-semibold mb-2 text-green-200/90">Загружаем файлы:</h2>
      <ul class="text-green-200/90 flex flex-col gap-5">
        <li v-for="(file, index) in uploadedFiles" :key="file.body.name"
          class="flex flex-col gap-2 px-5 py-2 rounded-xl shadow-xl"
          :class="
          [
            file.status==StatusUploadFile.uploading ? 'shadow-gray-200/20' : '',
            file.status==StatusUploadFile.done ? 'shadow-green-200/20' : '',
            file.status==StatusUploadFile.error ? 'shadow-red-400/30 text-red-400' : '',
          ]
          "
        >
          <div class="flex gap-3 justify-between">  
            <p>{{ file.body.name }}</p>
            <div class="self-center">
              <svg v-if="file.status==StatusUploadFile.uploading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          
          <div>
            {{ formatFileSize(file.body.size) }}
          </div>
          
        </li>
      </ul>
  </div>
  
  <div v-if="message"
    class="text-red-200 flex flex-col my-5 gap-5"
  >
    <p class="text-lg">{{ message.type }}</p>
    <p>{{ message.text }}</p>
  </div>

	<div v-if="uploadingFile" class="mt-2 w-full bg-gray-200 rounded-full h-2.5">
		<div class="bg-indigo-600 h-2.5 rounded-full" :style="{ width: `${fileUploadProgress}%` }"></div>
	</div>
</div>

</template>