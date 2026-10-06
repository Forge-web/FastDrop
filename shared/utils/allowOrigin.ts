export default (origin: string | null) => {
	
	const config = useRuntimeConfig();
	
	if (!origin || !config.wsAllowedOrigins.includes(origin)) {
		// throw createError({ statusCode: 403, statusMessage: 'Unauthorized Origin' });
		return false;
	}
}