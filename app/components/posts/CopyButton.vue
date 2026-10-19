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
	<div
		@click="copyText()" 
		class="z-999 text-gray-400 hover:text-green-700"
	>
		<Icon name="solar:copy-broken" size="18"/>
	</div>
</template>