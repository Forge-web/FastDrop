export default () => {

	const currentRoom = ref('');
	const inputRoomId = ref('');
	const isHost = ref(false);
	const selectedFiles = ref<File[]>([]);
	const statusMessage = ref('Ожидание действий...');

	const ws = ref<WebSocket | null>(null);
	const peers = ref(new Map());
	const dataChannels = ref(new Map());

	const swRegistration = ref<ServiceWorkerRegistration | null>(null);

	const logTimer = ref();

	const currentTransferId = ref<string | null>(null);

	onMounted(async () => {
		swRegistration.value = await navigator.serviceWorker.register('/sw.js');
		// logTimer.value = setInterval(() => {
		// 	dataChannels.value.forEach((ch, id) => {
		// 		console.log(`[${id}] bufferedAmount=${ch.bufferedAmount}`);
		// 	})
		// }, 5000);
	});

	const onFileSelect = (event: any) => {
		selectedFiles.value = Array.from(event.target.files);
	}

	const initWebSocket = () => {
		const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'

		ws.value = new WebSocket(`${protocol}//${location.host}/ws/wsRooms`);
		
		ws.value.onmessage = async (event) => {
			const data = JSON.parse(event.data);


			if (data.type === 'room-created') {

				currentRoom.value = data.roomId;
				statusMessage.value = 'Комната создана. Ожидаем участников...';
		
			}

		
			if (data.type === 'user-joined') {
				statusMessage.value = `Пользователь ${data.userId} присоединился`;
				if (isHost.value) {
					initPeerConnection(data.userId, true);
				}

			}


			if (data.type === 'signal') {
				
				let peer = peers.value.get(data.senderId);
				
				if (!peer && !isHost.value) {
					peer = initPeerConnection(data.senderId, false)
				}

				if (data.signalData.sdp) {
					await peer.setRemoteDescription(new RTCSessionDescription(data.signalData.sdp))

					if (peer.remoteDescription.type === 'offer') {
						const answer = await peer.createAnswer();
						await peer.setLocalDescription(answer);
						
						ws.value?.send(JSON.stringify({
							type: 'signal',
							roomId: currentRoom.value,
							signalData: { sdp: peer.localDescription}
						}))

					} 
				} else if (data.signalData.candidate) {
					await peer.addIceCandidate(new RTCIceCandidate(data.signalData.candidate));
				}
			}
		}
	}

	const createRoom = () => {
		isHost.value = true;
		const roomId = Math.random().toString(36).substring(2, 7).toUpperCase();

		initWebSocket()

		if (ws.value) {
			
			ws.value.onopen = () => {
				ws.value?.send(JSON.stringify({type: 'create-room', roomId}))
			}

		} else {
			console.error('WS был закрыт или другая ошибка')
		}
	}

	const joinRoom = () => {
		if (!inputRoomId.value) return

		isHost.value = false;
		currentRoom.value = inputRoomId.value;
		initWebSocket();
		
		if (ws.value) {
			ws.value.onopen = () => {
				ws.value?.send(JSON.stringify({type: 'join-room', roomId: inputRoomId.value}));
			}
		} else {
			console.error(`Ws not found`);
		}
	}

	const initPeerConnection = (userId: string, isInitiator: boolean) => {
		const configuration = { iceServers: [{urls: 'stun:stun3.l.google.com:19302' }]};
		const peer = new RTCPeerConnection(configuration);

		peers.value.set(userId, peer);
		peer.onicecandidate = (event) => {
			if (event.candidate) {
				if (ws.value) {
					ws.value.send(JSON.stringify({
						type: 'signal',
						roomId: currentRoom.value,
						signalData: { candidate: event.candidate }
					}))
				} else {
					console.error('Ws not found');
				}
			}
		}
		if (isInitiator) {

			const channel = peer.createDataChannel('fileTransfer', {
				ordered: true,
			})
			setupDataChannel(channel, userId);

			peer.createOffer().then(offer => {
				return peer.setLocalDescription(offer)
			}).then(()=>{
				if (ws.value) {
					ws.value.send(JSON.stringify({
						type: 'signal',
						roomId: currentRoom.value,
						signalData: { sdp: peer.localDescription }
					}))
				} else {
					console.error('Ws not found')
				}
			})
		} else {
			peer.ondatachannel = (event) => {
				setupDataChannel(event.channel, userId);
			}
		}
		return peer;
	}

	const setupDataChannel = (channel: RTCDataChannel, userId: string) => {
		dataChannels.value.set(userId, channel);

		channel.binaryType = 'arraybuffer';

		channel.bufferedAmountLowThreshold = 257 * 1024;

		channel.onmessage = (event) => {
			if (typeof event.data === 'string') {
				
				const meta = JSON.parse(event.data);

				if (meta.type === 'file-start') {
					
					currentTransferId.value = meta.id;
				
					const downloadUrl = `/p2p-download-stream?id=${encodeURIComponent(meta.id)}&name=${encodeURIComponent(meta.name)}`;

					

					const a = document.createElement('a');
					a.href = downloadUrl;
					a.download = meta.name;
					document.body.appendChild(a);
					a.click();
					a.remove();

				} else if (meta.type === 'file-end') {
					navigator.serviceWorker.controller?.postMessage({
						type: 'CLOSE',
						transferId: meta.id
					});
					currentTransferId.value = null;
				}
			} else {
				if (currentTransferId.value) {
					navigator.serviceWorker.controller?.postMessage({
						type: 'CHUNK',
						transferId: currentTransferId.value,
						chunk: event.data
					})
				}
			}
		}

		channel.onopen = () => {};
		channel.onclose = () => {};


	}

	const startDistribution = async () => {
		statusMessage.value = 'Запуск раздачи...';

		const HIGH_WATER_MARK = 4 * 1024 * 1024;
		const chunkSize = 16384;

		for (const file of selectedFiles.value) {

			const transferId = crypto.randomUUID();

			dataChannels.value.forEach(channel => {
				if (channel.readyState === 'open') {
					
					channel.send(
						JSON.stringify({
							type: 'file-start',
							id: transferId,
							name: file.name,
							size: file.size
						})
					)
				}
			})

			const reader = file.stream().getReader();
			while (true) {
				const {done, value} = await reader.read();

				if (done) break;

				await Promise.all(
					[...dataChannels.value.values()]
						.filter(ch => ch.readyState === 'open')
						.map(ch => waitForBuffer(ch, HIGH_WATER_MARK))
				);

				for (const _channel of dataChannels.value.values()) {
					if (_channel.readyState === 'open') {
						_channel.send(value.buffer);
					}
				}

				
			}

			for (const _channel of dataChannels.value.values()) {
				if (_channel.readyState === 'open') {
					_channel.send(JSON.stringify({
						type: 'file-end', 
						name: file.name,
						id: transferId
					}))
				}
			}
		}
		statusMessage.value = 'Все файлы успешны переданны';
	}

	const waitForBuffer = (channel: RTCDataChannel, threshold = 1024 * 1024) => {
		return new Promise<void>((resolve) => {
			if (channel.readyState !== 'open') return resolve();
			if (channel.bufferedAmount <= threshold) return resolve();

			const cleanup = () => {
				channel.removeEventListener('bufferedamountlow', onLow);
				channel.removeEventListener('close', cleanup);
				channel.removeEventListener('error', cleanup);
			}

			const onLow = () => {
				cleanup()
				channel.removeEventListener('bufferedamountlow', onLow);

				if (channel.bufferedAmount > threshold) {
					waitForBuffer(channel, threshold).then(resolve);
				} else {
					resolve();
				}
			};

			channel.addEventListener('bufferedamountlow', onLow);
			channel.addEventListener('close', () => {cleanup(); resolve();});
			channel.addEventListener('error', () => {cleanup(); resolve();});
		})
	}

	const exitRoom = () => {
		if (ws.value) {
			ws.value.close();	
			ws.value = null;
		}

		peers.value.forEach(p => p.close())
		peers.value.clear()

		currentRoom.value = '';

		if (logTimer.value !== null) clearInterval(logTimer.value);
	}

	onBeforeMount(() => {
		exitRoom();

	})

	return {
		startDistribution,
		onFileSelect,
		createRoom,
		joinRoom,
		exitRoom,
		inputRoomId,
		isHost,
		statusMessage,
		currentRoom,
		selectedFiles,
		peers

	}
}