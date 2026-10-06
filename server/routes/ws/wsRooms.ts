import {parse} from 'cookie';
import {serverSupabaseUser} from "#supabase/server";



const rooms = new Map<string, Set<any>>();
const meta = new WeakMap();

export default defineWebSocketHandler({
	// async upgrade(req) {
	// 		const cookies = req.headers.get('cookie');
	// 		// const cookies = parseCookies(request  as any);
	// 		console.log(cookies)
	// 		// const auth_token = parse(cookies as string)['sb-ttbobjvlfpgzqzffzkyf-auth-token'];

	// 		// if (!auth_token) {
	// 		// 	req.writeHead(401, {'Content-Type': 'text/plain'});
	// 		// 	req.end('Unauthorized');
	// 		// 	return;
	// 		// }

	// 		// const user = serverSupabaseUser(auth_token as any);
	// 		// console.log(user)
		
			
	// },

	open(peer) {
		console.log(`[ws] подключен: ${peer.id}`)
	},

	message(peer, message) {
		const data = JSON.parse(message.text())
    	const { type, roomId } = data

		if (type === 'create-room') {
			if (!rooms.has(roomId)) {
			rooms.set(roomId, new Set())
			}
			rooms.get(roomId)!.add(peer)
			meta.set(peer, { roomId, isHost: true })
			peer.send(JSON.stringify({ type: 'room-created', roomId }))
		}

		if (type === 'join-room') {
			if (!rooms.has(roomId)) {
				peer.send(JSON.stringify({ type: 'error', message: 'Комната не найдена' }))
				return
			}
			rooms.get(roomId)!.add(peer)
			meta.set(peer, { roomId, isHost: false }); 

			// Оповещаем хоста и других участников, что вошел новый пользователь
			const clients = rooms.get(roomId)!
			clients.forEach(client => {
				if (client.id !== peer.id) {
					client.send(JSON.stringify({ type: 'user-joined', userId: peer.id }))
				}
			})
    	}

		if (type === 'signal') {
			const clients = rooms.get(roomId)
			if (clients) {
				clients.forEach(client => {
					if (client.id !== peer.id) {
						client.send(JSON.stringify({
							type: 'signal',
							senderId: peer.id,
							signalData: data.signalData
						}))
					}
				})
			}
		}
	},
	
	close(peer) {
		const room = meta.get(peer);
		console.log(`${peer.id} was disconnected`)
		if (room.roomId && rooms.has(room.roomId)) {
			const clients = rooms.get(room.roomId)!
			clients.delete(peer)
			if (clients.size === 0) {
				rooms.delete(room.roomId)
			} else if (room.isHost) {
				// Если ушел хост, можно оповестить всех
				clients.forEach(client => client.send(JSON.stringify({ type: 'host-disconnected' })))
			}
		}
		
	}
})