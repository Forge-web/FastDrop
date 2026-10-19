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

// Tailwind классы для каждого варианта
const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary:
    'text-green-300 bg-gray-800/60 border border-gray-700/60 shadow-md shadow-green-500/5 ' +
    'hover:text-green-200 hover:border-green-400/40 hover:bg-gray-800/80 hover:shadow-lg hover:shadow-green-500/15 ' +
    'active:bg-gray-800',
  selected:
    'text-green-200 bg-green-500/10 border border-green-400/40 shadow-md shadow-green-500/10 ' +
    'hover:bg-green-500/15 hover:border-green-400/60 hover:shadow-lg hover:shadow-green-500/20',
  danger:
    'text-red-300 bg-red-500/5 border border-red-500/30 shadow-md shadow-red-500/5 ' +
    'hover:text-red-200 hover:bg-red-500/10 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/20 ' +
    'active:bg-red-500/15',
  disabled:
    'text-gray-500/70 bg-gray-800/30 border border-gray-700/40 shadow-sm',
};

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};

const buttonClasses = computed(() => {
  const baseClasses =
    'w-full cursor-pointer inline-flex items-center justify-center gap-2 font-medium rounded-xl ' +
    'transition-all duration-200 outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-green-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ' +
    'active:scale-[0.98] ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 disabled:shadow-none';

  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
  ]
    .filter(Boolean)
    .join(' ');
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