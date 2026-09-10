<script setup lang="ts">
const { toasts, removeToast } = useToast()
</script>

<template>
	<div class="fixed top-5 right-5 z-50 flex flex-col gap-3 w-80 max-w-full">
		<TransitionGroup
			name="toast"
			enter-active-class="transition-all duration-300 ease-out"
			enter-from-class="opacity-0 translate-x-10"
			enter-to-class="opacity-100 translate-x-0"
			leave-active-class="transition-all duration-200 ease-in"
			leave-from-class="opacity-100 scale-100"
			leave-to-class="opacity-0 scale-95"
		>
			<div
				v-for="toast in toasts"
				:key="toast.id"
				class="p-4 rounded-lg shadow-lg text-white flex items-center justify-between"
				:class="{
					'bg-green-800': toast.type === 'success',
					'bg-red-800': toast.type === 'error',
					'bg-blue-800': toast.type === 'info',
					'bg-yellow-800': toast.type === 'warning',
				}"
			>
				<span>{{ toast.message }}</span>
				<button
					@click="removeToast(toast.id)"
					class="ml-4 text-white hover:text-gray-200 transition"
				>
					✕
				</button>
      		</div>
    	</TransitionGroup>
	</div>
</template>

