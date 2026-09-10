<script setup lang="ts">
import BaseButton from '../BaseButton.vue';
import { formatFileSize } from '#imports';
import type { Database } from '~/types/database.types.js';

definePageMeta({
	middleware: ['admin-middleware']
})
const supabase = useSupabaseClient<Database>();

const {data: users, error, status} = await supabase
	.from('users')
	.select()	

const NameOfColumns = ref(Object.keys(users[0]).filter(field => field !== 'auth_id'));

console.log(NameOfColumns)
</script>

<template>
	<div class="shadow-lg shadow-gray-500/10 p-2">			
		<table class="table-fixed w-full divide-y-1 divide-gray-200/20">
			<thead>
				<tr class="divide-x-1 divide-gray-200/20 max-md:text-sm">
					<th v-for="column in NameOfColumns">{{ column }}</th>
					
				</tr>
			</thead>
			<tbody class="divide-y-1 divide-gray-200/20">
				<tr v-for="user in users"
					class="text-center divide-x-1 divide-gray-200/20"
				>
					<td class="py-5">{{ user.id }}</td>
					<td class="py-5">{{ user.name }}</td>
					<td class="py-5">{{ user.created_at.split('T')[0] }}</td>
					<td class="py-5">{{ formatFileSize(user.limit_storage) }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
