import type { Database } from "~/types/database.types";
export default defineNuxtRouteMiddleware(async (to, from) => {
	
	const supabase = useSupabaseClient<Database>();
	const {data: {user}} = await supabase.auth.getUser();
	
	if (!user) {
		return navigateTo('/login');
	}
})