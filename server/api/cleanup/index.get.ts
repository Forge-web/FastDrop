import {serverSupabaseServiceRole} from '#supabase/server';
import { Database } from '~/types/database.types';


function getTime(created_at: string) {
	return new Date(created_at).getTime();
}

export default defineEventHandler( async (event) => {
	const token = getQuery(event).token
	if (token !== process.env.CLEANUP_SECRET) {
		throw createError({statusCode: 401, message: 'Unauthorized'})
	}

	const maxAgeFiles = Number(process.env.MAX_AGE_FILES);
	const dateNow = Date.now();

	let listFilesForDelete: string[] = [];
	
	const supabase = serverSupabaseServiceRole<Database>(event);
	const {data, error} = await supabase
		.from('user-files')
		.select('storage_path, created_at')

	try {
		if (data)
			data.forEach(item => {
				//если файл старше 1 часа
				if (dateNow > getTime(item.created_at) + maxAgeFiles) {
					listFilesForDelete.push(item.storage_path);
				}
			});
		else
			throw createError({ statusCode: 500, message: 'Error retrieving file list'})

		if (listFilesForDelete.length > 0) {
			const {data: deleteFileStorageData, error: deleteFileStorageError} = await supabase.storage
				.from('user-files')
				.remove(listFilesForDelete);
			
			if (deleteFileStorageError)
				throw createError({
					statusCode: 500, 
					message: 'Error deleting files | ' + deleteFileStorageError.message
				})
		
			const {error: deleteTableRowError} = await supabase
				.from('user-files')
				.delete()
				.in('storage_path', listFilesForDelete)
			
			if (deleteTableRowError)
				throw createError({
					statusCode: 500, 
					message: 'Error deleting table row | ' + deleteTableRowError.message
				})
		}

	} catch ( error ) {
		throw createError({ statusCode: 500, message: 'Cleanup failed'})
	}
})