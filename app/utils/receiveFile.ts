export async function setupFileReceiver(
	channel: RTCDataChannel,
	onProgress: (percent: number) => void,
) {
	let fileHandle: FileSystemFileHandle | null = null
	let writableStream: FileSystemWritableFileStream | null = null
	let metadata: any = null
	let receivedBytes = 0
	
	const {initDownload, writeChunk, closeDownload} = useP2PSaver();

	channel.onmessage = async (event) => {
	// Текстовое сообщение — метаданные или управляющие команды

		if (typeof event.data === 'string') {
			const msg = JSON.parse(event.data)
			console.log(msg)

			if (msg.type === 'file-metadata') {
				metadata = msg
				receivedBytes = 0
				
				// Запрашиваем у пользователя место для сохранения
				// try {
				//   fileHandle = await (window as any).showSaveFilePicker({
				//     suggestedName: msg.name,
				//     types: [{ description: 'File', accept: { [msg.mime]: [`.${msg.name.split('.').pop()}`] } }],
				//   })
				//   writableStream = await fileHandle!.createWritable()
				// } catch (err) {
				//   console.error('User cancelled file save', err)
				//   channel.send(JSON.stringify({ type: 'file-reject' }))
				//   return
				// }

				// [TODO]: showSaveFilePicker не поддерживается в firefox | придумай альт меторд.

				// Подтверждаем готовность
				channel.send(JSON.stringify({ type: 'file-accept', fileId: msg.id }))
			}

			if (msg.type === 'file-complete') {
				// await writableStream?.close()
				// writableStream = null
				await closeDownload();
				console.log('File transfer complete!')
			}
		}
		// Бинарные данные — чанки файла
		else if (event.data instanceof ArrayBuffer) {

			try {
				const packet = new Uint8Array(event.data)
				const headerLength = new DataView(packet.buffer).getUint32(0)
				const headerBytes = packet.slice(4, 4 + headerLength)
				const header = JSON.parse(new TextDecoder().decode(headerBytes))
				const fileChunk = packet.slice(4 + headerLength)
	
				await writeChunk(fileChunk);
				
				channel.send(JSON.stringify({
					type: 'chunk-received'
				}));
				// receivedBytes += event.data.byteLength;
	
				// // Записываем чанк на диск
				// if (writableStream) {
				// // await writableStream.write(fileChunk)
				// receivedBytes += fileChunk.byteLength
			} catch (e) {
				channel.send(JSON.stringify({
					type: 'error-retrieving-chunk'
				}))
			}

			if (metadata) {
				onProgress(Math.round((receivedBytes / metadata.size) * 100))
			}
		}
	}
}
