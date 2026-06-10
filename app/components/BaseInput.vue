<template>
  <div class="w-full">
    <!-- Лейбл (опционально) -->
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Основной инпут -->
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :readonly="readonly"
      :class="inputClasses"
      @input="onInput"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />

    <!-- Сообщение об ошибке -->
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>

    <!-- Хинт / вспомогательный текст -->
    <p v-if="hint && !error" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
// --- Пропсы с TypeScript ---
interface Props {
  // v-model значение
  modelValue: string | number;
  
  // Тип поля
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  
  // Отображение
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  
  // Состояния
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  
  // Размер (по аналогии с кнопкой)
  size?: 'sm' | 'md' | 'lg';
  
  // Вариант оформления (например, границы)
  variant?: 'default' | 'filled' | 'outline';
  
  // ID для связи с label (если не передан – сгенерируем)
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  label: undefined,
  placeholder: '',
  hint: '',
  error: '',
  disabled: false,
  required: false,
  readonly: false,
  size: 'md',
  variant: 'default',
  id: undefined,
});

// --- Эмиты событий ---
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
}>();

// --- Уникальный ID, если не передан ---
const id = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`);

// --- Tailwind классы для размеров и вариантов ---
const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-2.5 text-lg',
};

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  default: 'shadow-green-200/25',
  filled: '',
  outline: '',
};

// Базовые классы + динамические
const inputClasses = computed(() => {
  const base = 'w-full rounded-xl shadow-sm transition-all duration-200 focus:shadow-xl outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 read-only:bg-gray-50';
  
  const errorClass = props.error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : '';

  return [
    base,
    sizeClasses[props.size],
    variantClasses[props.variant],
    errorClass,
    props.disabled && 'pointer-events-none'
  ].filter(Boolean).join(' ');
});

// --- Обработка ввода ---
function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  let value: string | number = target.value;
  
  // Если тип number, преобразуем в число
  if (props.type === 'number') {
    value = value === '' ? '' : Number(value);
  }
  
  emit('update:modelValue', value);
}
</script>