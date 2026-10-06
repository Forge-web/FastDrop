import type { WatchSource } from "vue";
import {watch} from "vue";

export function waitUntil<T>(source: WatchSource<T>, condition: (value: T) => boolean): Promise<T> {
	return new Promise((resolve) => {
		const currentValue = typeof source === 'function' ? source() : source.value;
		if (condition(currentValue)){
			return resolve(currentValue);
		}

		const unwatch = watch(source, (newValue)=> {
			if (condition(newValue)) {
				unwatch();
				resolve(newValue)
			}
		})
	})
}