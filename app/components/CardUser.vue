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
	<div
		class="group cursor-pointer w-full
				rounded-2xl
				bg-[#0a1f16]
				px-6 py-5
				ring-1 ring-emerald-500/10
				hover:ring-emerald-400/30
				hover:bg-[#0c2619]
				transition-all duration-300 ease-out
				hover:-translate-y-0.5"
	>
		<span
			class="text-center block text-base font-medium tracking-wide
					text-emerald-100/90
					group-hover:text-emerald-50
					transition-colors duration-300"
		>
			{{ name }}
		</span>
	</div>
</template>