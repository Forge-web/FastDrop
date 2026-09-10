export interface Toast {
	id: number
	type: 'success' | 'error' | 'info' | 'warning'
	message: string
	duration?: number
}

const toasts = ref<Toast[]>([]);
let idCounter = 0;

export const useToast = () => {
	const addToast = (message: string, type: Toast['type'] = 'info', duration=3000) => {
		const id = ++idCounter;
		const toast: Toast = {id, type, message, duration};
		toasts.value.push(toast);

		if (duration > 0) {
			setTimeout(() => {
				removeToast(id)
			}, duration)
		}
	}

	const removeToast = (id: number) => {
		const index = toasts.value.findIndex(t => t.id === id)
		if (index !== -1) {
			toasts.value.splice(index, 1)
		}
	}

	const clearToasts = () => {
		toasts.value = [];
	}

	const errorToast = (message: string = 'Ошибка!') => {
		addToast(message, 'error', 3000);
	}

	const successToast = (message: string = 'Успешно!') => {
		addToast(message, 'success', 1500);
	}

	return {
		toasts,
		addToast,
		removeToast,
		clearToasts,
		errorToast,
		successToast
	}
}


