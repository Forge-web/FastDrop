<script setup lang="ts">

//client
const supabase = useSupabaseClient();

//user
const user = useSupabaseUser();

//storage
const userFiles = ref<any[]>([]);


const loadUserFiles = async () => {
	if (!user.value) return
	const { data, error } = await supabase
		.from('user-files')
		.select('name, size, created_at, mime_type, storage_path')
		.eq('user_id', user.value.sub)
		.order('created_at', { ascending: false})
	if (error) console.error(error)
	else userFiles.value = data || []
}


</script>

<template>

<div class="mb-6">
	
</div>

</template>