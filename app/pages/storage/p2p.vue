<script setup lang="ts">

import CopyButton from '~/components/posts/CopyButton.vue';

const useRTC = useRoomsWithWebRTC();

</script>

<template>

<div class="flex flex-col ">

	
	<div class="">
		
		<div v-if="!useRTC.currentRoom.value" class="flex flex-col gap-10">
			
			<div>
				<h3>Создать комнату</h3>
				<BaseButton @click="useRTC.createRoom">
					Create Room
				</BaseButton>
			</div>
	
			<div class="flex flex-col gap-5">
				<h3>Войти в комнату</h3>
				<div class="flex flex-col gap-5">
					<BaseInput v-model="useRTC.inputRoomId.value" placeholder="Введите ID комнаты" />
					<BaseButton @click="useRTC.joinRoom">
						Join Room
					</BaseButton>
				</div>
			</div>

		</div>

		<div v-else class="flex flex-col gap-5">
			<div class="">
				<h2 class="flex justify-between">
					<div>
						Комната: {{ useRTC.currentRoom.value }}
						<span v-if="useRTC.isHost.value">
							(are Host)
						</span>
					</div>
					<CopyButton :text="useRTC.currentRoom.value" />
				</h2>
				<p>Статус: {{ useRTC.statusMessage.value }}</p>
				<p>Подключено участников: {{ useRTC.peers.value.size }}</p>
			</div>

			<div class="">
				<input v-if="useRTC.isHost.value" type="file" @change="useRTC.onFileSelect" multiple 
					class="p-5 outline-2 outline-green-200/20 rounded-sm bg-green-200/5"
				/>
			</div>

			<div>

				<div class="flex flex-col gap-5">
					<BaseButton v-if="useRTC.isHost.value" :disabled="useRTC.peers.value.size === 0 && !useRTC.selectedFiles.value" @click="useRTC.startDistribution"
						:variant="useRTC.peers.value.size===0 && useRTC.selectedFiles.value.length <= 0 ? 'disabled' : 'primary'"
					
					>
						Начать раздачу
					</BaseButton>
	
					<BaseButton @click="useRTC.exitRoom" :variant="'danger'">
						Выйти из комнаты
					</BaseButton>
				</div>

				<div v-if="useRTC.selectedFiles.value.length" class="">
					<h3>Файлы для отправки:</h3>
					<ul>
						<li v-for="f in useRTC.selectedFiles.value" :key="f.name">
							{{ f.name }}
							({{ f.size }} bytes)
						</li>
					</ul>
				</div>
			</div>

		</div>

	</div>

</div>

</template>