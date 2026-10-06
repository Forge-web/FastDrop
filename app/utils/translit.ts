// utils/translit.ts
const map: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e',
  ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
}

export function translit(input: string): string {

	return input
	.split('')
	.map((char) => {
		const lower = char.toLowerCase()
		let mapped = map[lower]

		if (mapped === undefined) {
		// символ не из русского алфавита — оставляем как есть
		return char
		}

		// Сохраняем регистр первой буквы
		if (char !== lower) {
		mapped = mapped.charAt(0).toUpperCase() + mapped.slice(1)
		}


		return mapped
	}).join('')
}