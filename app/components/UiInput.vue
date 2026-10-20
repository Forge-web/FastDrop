<script setup lang="ts">
interface Props {
  modelValue?: string | number;
  variant?: 'primary' | 'danger' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  readonly?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  id?: string;
  name?: string;
  autocomplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  variant: 'primary',
  size: 'md',
  disabled: false,
  readonly: false,
  type: 'text',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'clear-input', event: any): void;
}>();

const inputId = computed(() => props.id ?? `input-${Math.random().toString(36).slice(2, 9)}`);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleClearInput = () => {
	emit('clear-input', '')
}

// Tailwind классы для каждого варианта
const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary:
    'text-green-300 bg-gray-800/60 border border-gray-700/60 shadow-md shadow-green-500/5 ' +
    'placeholder:text-gray-500/70 ' +
    'hover:border-green-400/40 hover:bg-gray-800/80 hover:shadow-lg hover:shadow-green-500/15 ' +
    'focus:border-green-400/60 focus:bg-gray-800/90 focus:shadow-lg focus:shadow-green-500/20 focus:text-green-200',
  danger:
    'text-red-300 bg-red-500/5 border border-red-500/30 shadow-md shadow-red-500/5 ' +
    'placeholder:text-red-300/40 ' +
    'hover:bg-red-500/10 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/20 ' +
    'focus:border-red-400/60 focus:bg-red-500/10 focus:shadow-lg focus:shadow-red-500/25 focus:text-red-200',
  disabled:
    'text-gray-500/70 bg-gray-800/30 border border-gray-700/40 shadow-sm placeholder:text-gray-500/40',
};

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-6 py-3 text-lg rounded-xl',
};

const wrapperSizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const inputClasses = computed(() => {
  const baseClasses =
    'w-full font-medium outline-none transition-all duration-200 ' +
    'focus-visible:ring-2 focus-visible:ring-green-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none ' +
    'read-only:cursor-default read-only:opacity-90';

  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
  ]
    .filter(Boolean)
    .join(' ');
});

const labelClasses = computed(() => {
  if (props.variant === 'danger' || props.error) return 'text-red-300/90';
  if (props.disabled) return 'text-gray-500/70';
  return 'text-green-300/90';
});

const hintClasses = computed(() => {
  if (props.error) return 'text-red-300/80';
  if (props.disabled) return 'text-gray-500/60';
  return 'text-gray-400/80';
});
</script>

<template>
  <div class="w-full flex flex-col gap-1.5 relative" :class="wrapperSizeClasses[size]">
    <label
      v-if="label"
      :for="inputId"
      class="font-medium text-sm transition-colors duration-200"
      :class="labelClasses"
    >
      {{ label }}
    </label>

    <input
      :id="inputId"
      :type="type"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :aria-invalid="!!error"
      :aria-describedby="(error || hint) ? `${inputId}-description` : undefined"
      :class="inputClasses"
      @input="handleInput"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
	<button
		v-if="props.modelValue"
		type="button"
		aria-label="Очистить поле"
		@click="handleClearInput"
		class="absolute inset-y-0 right-0 flex items-center pr-3
				text-green-600 hover:text-green-400 transition-colors"
	>
		<Icon name="material-symbols:close" size="14" />
	</button>
    <p
      v-if="error || hint"
      :id="`${inputId}-description`"
      class="text-xs transition-colors duration-200"
      :class="hintClasses"
    >
      {{ error || hint }}
    </p>
  </div>
</template>