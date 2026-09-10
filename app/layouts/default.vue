<script setup lang="ts">
const appConfig = useAppConfig();

const user = getUser();
const user_name = ref('');

if (user?.user_metadata){
	user_name.value = user.user_metadata.first_name;
} else {
	user_name.value = 'anonymous'
}

</script>

<template>
	<!-- max-md:w-85 w-120 bg-gray-900/95 max-w-5xl overflow-y-auto justify-self-center text-green-200 -->
	<Body class="bg-gray-900/95 text-green-200 justify-center flex w-full">
		
		<header className="flex justify-between w-full mt-5 pr-4 py-3 shadow-xl rounded-sm shadow-green-200/20">
			<div className="self-center relative">
				<NuxtLink class="inline-flex" to="/">
					<!-- <NuxtImg class="w-16 h-auto max-md:w-12" src="/logao.png" alt="FastDrop"/> -->
					<div class="px-5 text-lg">FastDrop</div>
				</NuxtLink>
			</div>
			<div className="self-center">
				<ul className="flex max-w-md gap-10">
					<li className="self-center">
						<NuxtLink class="btn_header" to="/" :hidden="!appConfig.navbar.home">
							Home
						</NuxtLink>
					</li>
					<li className="self-center" :hidden="!appConfig.navbar.about">
						<NuxtLink class="btn_header flex gap-1" to="/about">
							About
						</NuxtLink>
					</li>
					<li className="self-center" :hidden="!appConfig.navbar.me">
						<NuxtLink class="btn_header flex gap-1" to="/me">
							Me
							<span v-if="user">({{ user_name }})</span>
						</NuxtLink>
					</li>
				</ul>
			</div>
		</header>
	
		<main className="my-15 min-w-150 max-md:w-85 max-md:min-w-auto">
			<ToastContainer />
			<slot />
		</main>
		
		<footer className="">
		</footer>
	</Body>
</template>