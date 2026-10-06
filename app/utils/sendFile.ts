const CHUNK_SIZE = 64 * 1024 // 64 КБ
const MAX_BUFFERED_AMOUNT = 4 * 1024 * 1024 // 4 МБ

export async function sendFile(
	file: File,
	channel: RTCDataChannel,
	onProgress: (percent: number) => void,
): Promise<void> {
  // 1. Отправляем метаданные
	const fileId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
	const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
	const metadata = {
		type: 'file-metadata',
		id: fileId,
		name: file.name,
		size: file.size,
		mime: file.type || 'application/octet-stream',
		totalChunks,
	}

	channel.send(JSON.stringify(metadata))

	// 2. Ждём подтверждения от получателя
	await waitForAck(channel, 'file-accept')

	// 3. Отправляем чанки с контролем backpressure
	channel.bufferedAmountLowThreshold = CHUNK_SIZE * 2 // Порог срабатывания события

	let offset = 0
	let chunkIndex = 0

  	while (offset < file.size) {
		// Проверка backpressure
		if (channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
			await waitForBufferLow(channel)
		}

		const slice = file.slice(offset, offset + CHUNK_SIZE)
		const buffer = await slice.arrayBuffer()

		// Отправляем с заголовком (chunkIndex + fileId)
		// Для простоты используем JSON-заголовок + бинарные данные
		const header = JSON.stringify({ chunkIndex, fileId })
		const headerBytes = new TextEncoder().encode(header)

		// Формат: [4 байта длина заголовка][заголовок][бинарные данные]
		const packet = new Uint8Array(4 + headerBytes.length + buffer.byteLength)
		new DataView(packet.buffer).setUint32(0, headerBytes.length)
		packet.set(headerBytes, 4)
		packet.set(new Uint8Array(buffer), 4 + headerBytes.length)

		channel.send(packet)

		let answerResponse = await waitChank(channel)

		if (answerResponse === 'chunk-received') {
			offset += buffer.byteLength
			chunkIndex++
			onProgress(Math.round((offset / file.size) * 100))
		} else {
			console.log('Получен ответ с ошибкой получения чанка')
		}

	}

  // 4. Отправляем завершение
  channel.send(JSON.stringify({ type: 'file-complete', fileId }))
}

// Ожидание события bufferedamountlow
function waitForBufferLow(channel: RTCDataChannel): Promise<void> {
  return new Promise((resolve) => {
    const handler = () => {
      channel.removeEventListener('bufferedamountlow', handler)
      resolve()
    }
    channel.addEventListener('bufferedamountlow', handler)
  })
}


// Ожидание ACK от получателя
function waitForAck(channel: RTCDataChannel, ackType: string): Promise<void> {
  return new Promise((resolve) => {
    const handler = (event: MessageEvent) => {
      if (typeof event.data === 'string') {
        const msg = JSON.parse(event.data)
        if (msg.type === ackType) {
          channel.removeEventListener('message', handler)
          resolve(msg.type)
        }
      }
    }
    channel.addEventListener('message', handler)
  })
}

function waitChank(channel: RTCDataChannel): Promise<string> {
	return new Promise((resolve) => {
		const oldHandler = channel.onmessage;

		channel.onmessage = (event) => {

			if (typeof event.data === 'string') {
				
				const msg = JSON.parse(event.data)
				channel.onmessage = oldHandler;
				resolve(msg.type);
		
			}
		
		}

	})
}