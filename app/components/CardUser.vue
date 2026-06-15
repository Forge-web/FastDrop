<script setup lang="ts">

const props = defineProps({
  name: {
    type: String,
    required: true,
    description: 'Полное имя пользователя'
  },
})

</script>

<template>

  <div class="px-5 py-3 cursor-pointer max-w-md w-full rounded-sm shadow-xl shadow-green-200/20 hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">    
      <!-- Список полей профиля -->
      <div class="space-y-4">
        <!-- Поле "Имя" (обязательное) -->
        <div class="flex items-center gap-3 justify-center">
          <!-- <span class="text-gray-500 font-medium w-24 flex-shrink-0">Имя:</span> -->
          <span class="text-green-200/70 font-semibold">{{ name }}</span>
        </div>
      </div>
  </div>

</template>