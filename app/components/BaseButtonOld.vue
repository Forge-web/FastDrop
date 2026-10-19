<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'selected' | 'danger' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button',
});

// Tailwind классы для каждого варианта и размера
const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary: 'text-green-200 shadow-lg shadow-gray-200/15 rounded-xl hover:shadow-green-200/50',
  selected: 'text-green-200 shadow-lg shadow-green-200/20 rounded-xl',
  danger: 'text-red-400 shadow-lg shadow-red-300/25 rounded-xl hover:shadow-red-400/50',
  disabled: 'text-green-200/20 shadow-lg shadow-green-200/10 rounded-xl hover:shadow-green-200/20'
};

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};

const buttonClasses = computed(() => {
  const baseClasses = 'p-5 w-full cursor-pointer inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-gray-400/40';
  
  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.disabled && 'pointer-events-none'
  ].filter(Boolean).join(' ');
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
  >
    <slot />
  </button>
</template>