<script setup lang="ts">
const route = useRoute();

const props = defineProps<{
	navItems: {
		label: string,
		to: string,
		icon?: string,
		size?: string,
		active?: boolean,
		authNeed: boolean
	}[],
	logoutFunc: any,
}>();

const isCollapsed = ref(false);
const isMobileOpen = ref(false);

const user = useSupabaseUser();

// — состояние сворачивания переживает перезагрузку
onMounted(() => {
  isCollapsed.value = localStorage.getItem('sidebar-collapsed') === '1';
});
watch(isCollapsed, (v) => {
  localStorage.setItem('sidebar-collapsed', v ? '1' : '0');
});

// — закрываем мобильное меню при навигации
watch(() => route.path, () => { isMobileOpen.value = false; });

// — Escape закрывает drawer
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') isMobileOpen.value = false;
};
onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));

// — иконки (Heroicons outline)
const icons: Record<string, string> = {
	logout: 'cil:account-logout',
	chevronLeft: 'grommet-icons:previous',
	chevronRight: 'grommet-icons:next',
	menu_close: 'grommet-icons:close',
	menu: 'grommet-icons:menu',
};


</script>

<template>
  <!-- Оверлей на мобильных -->
	<Transition name="fade">
	<div
		v-if="isMobileOpen"
		class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
		@click="isMobileOpen = false"
	/>
	</Transition>

  <!-- Кнопка-гамбургер (можно перенести в свой header) -->
	<button
		class="fixed top-4 left-4 z-30 md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-900/80 backdrop-blur border border-gray-800 text-gray-300 hover:text-green-300 hover:border-green-400/40 transition-colors"
		aria-label="Открыть меню"
		@click="isMobileOpen = true"
	>
		<Icon :name="icons.menu!" size="20" />
	</button>

  <!-- Sidebar -->
	<aside
	:class="[
		'fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-gray-900/30 backdrop-blur-md border-r border-gray-800/80 transition-all duration-300',
		isMobileOpen ? 'translate-x-0' : '-translate-x-full',
		'md:translate-x-0 md:relative md:z-auto',
		isCollapsed ? 'md:w-20' : 'md:w-64',
	]"
	>
		<!-- Шапка / бренд -->
		<div class="flex items-center gap-3 px-4 h-16 border-b border-gray-800/60">
			<div
			class="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-green-500/10 border border-green-400/20 shadow-lg shadow-green-400/10"
			>
				<svg class="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			</div>
			<span
			:class="[
				'text-base font-semibold text-gray-100 whitespace-nowrap overflow-hidden transition-all duration-300',
				isCollapsed ? 'md:max-w-0 md:opacity-0' : 'md:max-w-[200px] md:opacity-100',
			]"
			>
				FastDrop
			</span>

			<!-- Закрыть (мобильные) -->
			<button
				class="ml-auto md:hidden text-gray-500 hover:text-gray-200 transition-colors"
				aria-label="Закрыть меню"
				@click="isMobileOpen = false"
			>
				<Icon :name="icons.menu_close!" />
			</button>
		</div>

		<div class="hidden md:block p-3 border-t border-gray-800/60">
			<button
			class="flex items-center justify-center w-full px-3 py-2 rounded-xl text-gray-500 hover:text-gray-200 hover:bg-gray-800/60 transition-colors"
			:title="isCollapsed ? 'Развернуть' : 'Свернуть'"
			@click="isCollapsed = !isCollapsed"
			>
	
				<Icon v-if="!isCollapsed" :name="icons.chevronLeft!" />
				<Icon v-else :name="icons.chevronRight!"/>
				<span
					v-if="!isCollapsed"
					class="ml-3 text-sm whitespace-nowrap"
				>
					Свернуть
				</span>
			</button>
		</div>

		<!-- Навигация -->
		<nav class="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
			<div v-for="item in props.navItems">
				<NuxtLink
					v-if="!item.authNeed || user"
					:key="item.to"
					:to="item.to"
					:title="isCollapsed ? item.label : undefined"
					:class="[
						'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200',
						item.active
						? 'bg-green-500/15 text-green-200 border-green-400/25 shadow-lg shadow-green-400/10'
						: 'text-gray-400 border-transparent hover:text-gray-100 hover:bg-gray-800/60 hover:border-gray-700/60',
						isCollapsed ? 'md:justify-center md:gap-0' : '',
					]"
				>
			
					<!-- Индикатор активного пункта -->
					<span
						v-if="item.active"
						class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-green-400"
					/>
					
					<Icon :name="item.icon!" :size="item.size ? item.size : '14'"  />
					
					<span
						:class="[
						'whitespace-nowrap overflow-hidden transition-all duration-300',
						isCollapsed ? 'md:max-w-0 md:opacity-0' : 'md:max-w-[200px] md:opacity-100',
						]"
					>
						{{ item.label }}
					</span>
			
				</NuxtLink>
				<div v-else :class="[
						'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200',
						item.active
						? 'bg-green-500/15 text-green-200 border-green-400/25 shadow-lg shadow-green-400/10'
						: 'text-gray-400 border-transparent hover:text-gray-100 hover:bg-gray-800/60 hover:border-gray-700/60',
						isCollapsed ? 'md:justify-center md:gap-0' : '',
						
					]"
				>
					<span
						v-if="item.active"
						class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-green-400"
					/>
					
					<Icon :name="item.icon!" :size="item.size ? item.size : '14'"  />
					
					<span
						:class="[
						'whitespace-nowrap overflow-hidden transition-all duration-300',
						isCollapsed ? 'md:max-w-0 md:opacity-0' : 'md:max-w-[200px] md:opacity-100',
						]"
					>
						{{ item.label }}
					</span>

					<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs
						px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg
						opacity-0 invisible group-hover:opacity-100 group-hover:visible
						transition-all duration-200 ease-in-out z-10"
			 		>
						Нужна авторизация
					</div>

					<Icon name="fluent-emoji-high-contrast:locked" size="16" />
				</div>

			</div>
		</nav>

		<!-- Свернуть (десктоп) -->
		

		<!-- Пользователь -->
		<div class="p-3 border-t border-gray-800/60"
			v-if="user"
		>


			<button
				:class="[
					'mt-2 flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-400/20 transition-colors',
					isCollapsed ? 'md:justify-center md:gap-0' : '',
				]"
				:title="isCollapsed ? 'Выйти' : undefined"
				@click="props.logoutFunc"
			>

			<Icon :name="icons.logout!" class="" />

			<span
				:class="[
				'whitespace-nowrap overflow-hidden transition-all duration-300',
				isCollapsed ? 'md:max-w-0 md:opacity-0' : 'md:max-w-[200px] md:opacity-100',
				]"
			>
				Выйти
			</span>
			</button>
		</div>
	</aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>