<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'danger';
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
  primary: 'p-5 text-green-200 shadow-xl shadow-green-200/25 rounded-xl hover:shadow-green-200/50',
  danger: 'p-5 text-red-400 shadow-xl shadow-red-300/25 rounded-xl hover:shadow-red-400/50',
};

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};

const buttonClasses = computed(() => {
  const baseClasses = 'w-full cursor-pointer inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  
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
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>