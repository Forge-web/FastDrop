import type { Database } from "~/types/database.types";

export default defineNuxtPlugin(async () => {
	const supabase = useSupabaseClient<Database>();
	const {data: {user}} = await supabase.auth.getUser();
	return {
		provide: {user}
	}
})