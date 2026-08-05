export default defineNuxtRouteMiddleware((to, from) => {
	const appConfig = useAppConfig();

	if (to.name && appConfig.notavailable.pages.includes(to.name?.toString())){
		return navigateTo('/notAvailable');
	}
})