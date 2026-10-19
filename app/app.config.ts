export default defineAppConfig({
	navbar: {
		home: true,
		about: false,
		me: true
	},
	notavailable: {
		navigateToPage: '/',
		pages: ['rules', 'updates']
	},
	icon: {
		mode: 'css',
		cssLayer: 'base'
	}
})