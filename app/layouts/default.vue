<script setup lang="ts">

</script>

<template>
	<Body class="bg-gray-900/95 min-w-md max-w-5xl overflow-y-auto justify-self-center text-green-200">
		<header className="flex justify-between w-full border-b pb-2 mt-5">
			<div className="self-center relative">
				<NuxtLink class="inline-flex max-md:ml-5" to="/">
					<NuxtImg class="w-16 h-auto" src="/logo.png"/>
				</NuxtLink>
			</div>
			<div className="self-center max-md:hidden">
				<ul className="flex max-w-md gap-10">
					<li className="self-center">
						<NuxtLink class="btn_header" to="/" >
							Home
						</NuxtLink>
					</li>
					<li className="self-center">
						<NuxtLink class="btn_header" to="/me">
							Me
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