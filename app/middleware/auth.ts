export default defineNuxtRouteMiddleware((to, from) => {
	
	if (!getUser()) {
		return navigateTo('/login');
	}
})