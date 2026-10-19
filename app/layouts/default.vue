<script setup lang="ts">
import HeaderNav from '~/components/base/HeaderNav.vue';
import Sidebar from '~/components/base/Sidebar.vue';
import type { Database } from '~/types/database.types';

const appConfig = useAppConfig();

const user = getUser();
const supabase = useSupabaseClient<Database>();
const user_name = ref('');

const route = useRoute();

const items = computed(() => [
	{
		label: 'Главная',
		to: '/',
		icon: 'grommet-icons:home-rounded',
		active: route.matched.some(r => r.path === '/'),
	},
	{
		label: 'Профиль',
		to: '/me',
		icon: 'grommet-icons:user',
		active: route.matched.some(r => r.path.startsWith('/me')),
	},
	{
		label: 'Список файлов',
		to: '/storage/filelist',
		icon: 'grommet-icons:folder',
		active: route.matched.some(r => r.path.startsWith('/storage/filelist')),
	},
	{
		label: 'Загрузить файлы',
		to: '/storage/fileupload',
		icon: 'grommet-icons:cloud-upload',
		active: route.matched.some(r => r.path.startsWith('/storage/fileupload')),
	},
	{
		label: 'Посты',
		to: '/posts',
		icon: 'ph:newspaper-light',
		size: '18',
		active: route.matched.some(r => r.path.startsWith('/posts')),
	},

]);

if (user?.user_metadata){
	user_name.value = user.user_metadata.first_name;
} else {
	user_name.value = 'anonymous'
}

const handleLogout = async () => {
	await supabase.auth.signOut();
	await navigateTo('/login');
};

</script>

<template>
	<!-- max-md:w-85 w-120 bg-gray-900/95 max-w-5xl overflow-y-auto justify-self-center text-green-200 -->
	<Body class="bg-gray-900/95 text-green-200">
		
		<div class="flex min-h-screen mx-auto max-w-7xl">
			<Sidebar :nav-items="items" :logout-func="handleLogout" />
			<!-- <header class="flex py-5 px-5 border-b border-green-200/80">
				<div class="md:ml-5 self-center relative">
					<NuxtLink class="inline-flex" to="/">
						
						<div class="px-5 text-lg">FastDrop</div>
					</NuxtLink>
				</div>
				<div class="flex w-full justify-center">
					<div className="self-center relative">
						<ul className="flex max-w-md gap-10">
							
							<HeaderNav :items="items" />
					
						</ul>
					</div>
				</div>
				<div class="flex self-end max-md:hidden">
					<NuxtLink to="https://github.com/Forge-web/FastDrop"
						class="w-full justify-center"
					>
						<Icon name="grommet-icons:github" size="20" class="self-center" />
					</NuxtLink>
				</div>
			</header> -->
		
			
			<main class="flex-1 max-md-p-6 pt-25 min-w-0 justify-center min-w-150 max-md:w-full max-md:px-5 max-md:min-w-auto md:px-45">
				<ToastContainer />
				
				<slot />
				
			</main>

		</div>
	</Body>
</template>