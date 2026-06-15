<template>
  <div
    class="relative"
    @dragenter.prevent="setActive"
    @dragover.prevent="setActive"
    @dragleave.prevent="setInactive"
    @drop.prevent="handleDrop"
  >
    <!-- Область drag-and-drop -->
    <div
      :class="[
        'flex flex-col items-center justify-center w-full p-8 transition-all rounded-lg cursor-pointer',
        isActive
          ? 'border-blue-500 bg-blue-50'
          : 'shadow-lg shadow-green-200/30',
      ]"
      @click="triggerFileInput"
    >
      <svg
        class="w-12 h-12 mb-4 text-green-200/70"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        ></path>
      </svg>
      <p class="mb-2 text-sm text-green-200/70">
        <span class="font-semibold">Нажмите для выбора</span> или перетащите файлы
      </p>
      <p class="text-xs text-green-200/50">Поддерживаются любые файлы</p>
	  <p class="text-xs text-green-200/50">max size: {{ maxSizeMB }} MB</p>
    </div>

    <!-- Скрытый input для выбора файлов -->
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      multiple
      @change="handleFileSelect"
    />

    <!-- Отображение ошибок -->
    <div v-if="errorMessage" class="mt-2 text-sm text-red-600">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// События компонента
const emit = defineEmits(['files']);

// Состояния
const isActive = ref(false);
const errorMessage = ref('');
const fileInputRef = ref(null);

// Параметры (можно вынести в props)
const acceptTypes = ref([]); // например ['image/jpeg', 'image/png']
const maxSizeMB = ref(50);    // максимальный размер файла в МБ

// Установка активного состояния (при перетаскивании над зоной)
const setActive = () => {
  isActive.value = true;
};

// Сброс активного состояния
const setInactive = () => {
  isActive.value = false;
};

// Обработка события drop
const handleDrop = (event) => {
  setInactive();
  const files = Array.from(event.dataTransfer.files);
  processFiles(files);
};

// Обработка выбора через input
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  processFiles(files);
  // Очищаем input, чтобы повторный выбор того же файла срабатывал
  if (fileInputRef.value) fileInputRef.value.value = '';
};

// Триггер скрытого input
const triggerFileInput = () => {
  fileInputRef.value.click();
};

// Основная валидация и эмит файлов
const processFiles = (files) => {
  errorMessage.value = '';

  if (!files.length) {
    errorMessage.value = 'Файлы не выбраны';
    return;
  }

  // Проверка по типу (если заданы acceptTypes)
  if (acceptTypes.value.length) {
    const invalidType = files.some(
      (file) => !acceptTypes.value.includes(file.type)
    );
    if (invalidType) {
      errorMessage.value = `Недопустимый тип файла. Разрешены: ${acceptTypes.value.join(', ')}`;
      return;
    }
  }

  // Проверка по размеру
  const oversized = files.filter((file) => file.size > maxSizeMB.value * 1024 * 1024);
  if (oversized.length) {
    errorMessage.value = `Файлы превышают максимальный размер (${maxSizeMB.value} МБ): ${oversized.map(f => f.name).join(', ')}`;
    return;
  }

  // Передаём файлы родительскому компоненту
  emit('files', files);
};

// Можно также добавить сброс ошибки при начале нового drag
</script>