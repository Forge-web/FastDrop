<script setup lang="ts">
import type { Database } from '~/types/database.types';


const supabase = useSupabaseClient<Database>();
const {data: {user}} = await supabase.auth.getUser();

const message = ref<{type: string, text: string}>();


</script>

<template>
	<Body class="max-md:px-10 bg-gray-900/95 max-w-5xl overflow-y-auto justify-self-center text-green-200">
		<header className="flex justify-between w-full mt-5 pr-4 shadow-xl rounded-sm shadow-green-200/20">
			<div className="self-center relative">
				<NuxtLink class="inline-flex" to="/">
					<NuxtImg class="w-16 h-auto max-md:w-12" src="/logo.png"/>
				</NuxtLink>
			</div>
			<div className="self-center">
				<ul className="flex max-w-md gap-10">
					<li className="self-center">
						<NuxtLink class="btn_header" to="/" >
							Home
						</NuxtLink>
					</li>
					<li className="self-center">
						<NuxtLink class="btn_header flex gap-1" to="/me">
							Me
							<span v-if="user">({{ user.user_metadata.first_name }})</span>
						</NuxtLink>
					</li>
				</ul>
			</div>
		</header>
	
		<main className="my-15">
			<slot />
		</main>
		
		<footer className="">
	
		</footer>
	</Body>
</template>