<!-- components/ProfileCard.vue -->
<template>
  <div class="profile-card max-w-md w-full  rounded-2xl shadow-xl shadow-emerald-800/80 hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
    <!-- Верхняя акцентная полоса тёмно-зелёного цвета -->
    <div class="h-2 bg-green-800"></div>

    <div class="p-6 sm:p-8">
      <!-- Аватар с инициалами-заглушкой -->
      <div class="flex justify-center mb-6">
        <div class="relative">
          <div
            
            class="w-24 h-24 rounded-full bg-green-800 flex items-center justify-center text-white text-3xl font-bold shadow-md"
          >
            {{ initials }}
          </div>
        </div>
      </div>

      <!-- Список полей профиля -->
      <div class="space-y-4">
        <!-- Поле "Имя" (обязательное) -->
        <div class="flex items-start gap-3 border-b border-green-300/20 pb-2">
          <span class="text-green-600 font-medium w-24 flex-shrink-0">Имя:</span>
          <span class="text-green-500 font-semibold">{{ name }}</span>
        </div>

        <!-- Слот для добавления своих полей -->
        <slot name="extra-fields"></slot>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
    description: 'Полное имя пользователя'
  },
})

// Инициалы для заглушки аватара (если нет картинки)
const initials = computed(() => {
  if (!props.name) return '?'
  const parts = props.name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})
</script>