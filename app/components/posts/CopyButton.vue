<script setup lang="ts">

const props = defineProps<{
	text: string | null | undefined
}>();

const {errorToast, successToast} = useToast();

async function copyText(){
	try {
		if (typeof(props.text) !== 'string') {
			errorToast('Ошибка копирования!');
			return;
		}

		await navigator.clipboard.writeText(props.text)
		successToast('Успешно скопировано!');
	} catch {
		errorToast('Ошибка копирования');
	}

}

</script>

<template>
	<BaseButton
		@click="copyText()" 
		class="shadow-lg shadow-green-400/10 w-max h-max z-50 text-sm p-3 rounded-xl">
		Copy
	</BaseButton>
</template>