import type { Database } from '~/types/database.types';
export default defineNuxtRouteMiddleware(async (to, from) => {

	const user = getUser();
	const supabase = useSupabaseClient<Database>();

	const EMAIL_FOR_NOTIFICATION_ADMIN = process.env.EMAIL_FOR_NOTIFICATION_ADMIN as string;

	if (user?.user_metadata.sub) {
		const {data, error} = await supabase
			.from('admin')
			.select()
			.eq('id', user.user_metadata.sub)
			.limit(1);
		
		const get_admin = data?.values().toArray()[0];

		if (get_admin && get_admin.available) {
			return;
		} else {
			return navigateTo('/');
		}
	} else {
		return navigateTo('/');
	}
});