<script setup>
import { ref } from 'vue'

const props = defineProps({
  // URL файла для скачивания
  storage_path: {
    type: String,
    required: true
  },
  // Текст на кнопке
  buttonText: {
    type: String,
    default: 'Скачать'
  },
  // Дополнительные CSS-классы для кнопки (переопределяют базовые стили)
  customClass: {
    type: String,
    default: ''
  }
})

const isLoading = ref(false);
const error = ref('');
const supabase = useSupabaseClient();

const downloadFile = async () => {
  if (!props.storage_path) return

  isLoading.value = true
  error.value = ''
  try {
    const { data } = await supabase.storage
		.from('user-files')
		.getPublicUrl(props.storage_path, {download: true});
	
	const link = document.createElement('a');
	link.href = data.publicUrl;
	document.body.appendChild(link);
  link.click();
	document.body.removeChild(link);

  } catch (err) {
    console.error('Download error:', err)
    error.value = err.message || 'Не удалось скачать файл. Попробуйте позже.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <button
    :disabled="isLoading"
    :class="[
      'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium',
      customClass,
      {
        'duration-200 cursor-pointer hover:shadow-xl hover:shadow-green-300/30': !customClass && !isLoading,
        'bg-gray-400 cursor-not-allowed': isLoading,
      }
    ]"
    @click="downloadFile"
  >
    <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
    </svg>
    {{ buttonText }}
  </button>
  <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
</template>