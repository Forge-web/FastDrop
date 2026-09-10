export default () => {
	try {
		const {$user} = useNuxtApp();
		return $user;
	} catch (e) {
		logThis(e as string);
	}
}