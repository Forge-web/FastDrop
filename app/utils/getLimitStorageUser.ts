import type { Database } from "~/types/database.types";
import type { UserLimit } from "~/types/getLimitStorageUser.types";

export default async () => {
	const supabase = useSupabaseClient<Database>();
	const {data: {user}} = await supabase.auth.getUser();
	let current_file_size = 0;
	if (user) {
		const {data: user_limit, error: user_limit_error} = await supabase
			.from('users')
			.select('limit_storage')
			.eq('auth_id', user.id)
		
		const {data: user_files, error: user_files_error} = await supabase
			.from('user-files')
			.select()
			.eq('user_id', user.id)
		
		if (user_files)
			user_files.forEach(element => {
				if (element.size)
					current_file_size += element.size
			});
		
		if (user_limit_error)
			return user_limit_error

		if (user_limit !== null && user_limit[0] && !user_files_error)
			return <UserLimit>{
				limit: user_limit[0].limit_storage as number,
				use_of_limit: current_file_size,
				available_limit: user_limit[0].limit_storage - current_file_size
			};
	}
	return 0;
}