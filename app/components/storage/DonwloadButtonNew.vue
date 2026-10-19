<script setup lang="ts">
const props = defineProps<{
  storage_path: string;
  name?: string;
}>();

const emit = defineEmits<{
  (e: 'download-start'): void;
  (e: 'download-end', ok: boolean): void;
}>();

const supabase = useSupabaseClient();
const { errorToast, successToast } = useToast();

type State = 'idle' | 'loading' | 'done' | 'error';
const state = ref<State>('idle');

const download = async () => {
  if (state.value === 'loading') return;

  state.value = 'loading';
  emit('download-start');

  try {
    const { data, error } = await supabase.storage
      .from('user-files')
      .download(props.storage_path);

    if (error) throw error;

    // сохраняем через <a download>
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = props.name ?? props.storage_path.split('/').pop() ?? 'file';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    state.value = 'done';
    successToast('Файл скачан');
    setTimeout(() => {
      state.value = 'idle';
      emit('download-end', true);
    }, 1600);
  } catch {
    state.value = 'error';
    errorToast();
    setTimeout(() => {
      state.value = 'idle';
      emit('download-end', false);
    }, 1200);
  }
};
</script>

<template>
  <button
    type="button"
    :disabled="state === 'loading'"
    :class="[
      'group relative inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium',
      'border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden',
      state === 'idle' &&
        'text-green-200 bg-green-500/10 border-green-400/25 hover:bg-green-500/15 hover:border-green-400/45 hover:shadow-lg hover:shadow-green-400/20 active:scale-95',
      state === 'loading' &&
        'text-green-200 bg-green-500/15 border-green-400/40 cursor-wait',
      state === 'done' &&
        'text-green-100 bg-green-500/25 border-green-400/60 shadow-lg shadow-green-400/30',
      state === 'error' &&
        'text-red-200 bg-red-500/15 border-red-400/40 animate-shake',
    ]"
    @click="download"
  >
    <!-- Блик, пробегающий по кнопке в idle-hover -->
    <span
      class="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      aria-hidden="true"
    />

    <!-- Иконка: idle -->
    <Transition name="icon" mode="out-in">
      <svg
        v-if="state === 'idle'"
        key="idle"
        class="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.7"
      >
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>

      <!-- Иконка: loading (спиннер) -->
      <svg
        v-else-if="state === 'loading'"
        key="loading"
        class="w-4 h-4 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="2.5" />
        <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
      </svg>

      <!-- Иконка: done (галочка с отрисовкой) -->
      <svg
        v-else-if="state === 'done'"
        key="done"
        class="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path class="check-path" d="M5 13l4 4L19 7" />
      </svg>

      <!-- Иконка: error -->
      <svg
        v-else
        key="error"
        class="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 9v4m0 4h.01M10.3 3.7l-8 14A2 2 0 004 21h16a2 2 0 001.7-3.3l-8-14a2 2 0 00-3.4 0z" />
      </svg>
    </Transition>

    <!-- Текст -->
    <Transition name="label" mode="out-in">
      <span :key="state" class="whitespace-nowrap">
        {{ state === 'idle' ? 'Скачать'
         : state === 'loading' ? 'Загрузка…'
         : state === 'done' ? 'Готово'
         : 'Ошибка' }}
      </span>
    </Transition>
  </button>
</template>

<style scoped>
/* Смена иконки */
.icon-enter-active,
.icon-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.icon-enter-from { opacity: 0; transform: scale(0.6) rotate(-30deg); }
.icon-leave-to   { opacity: 0; transform: scale(0.6) rotate(30deg); }

/* Смена текста */
.label-enter-active,
.label-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.label-enter-from { opacity: 0; transform: translateY(6px); }
.label-leave-to   { opacity: 0; transform: translateY(-6px); }

/* Отрисовка галочки */
.check-path {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: draw-check 0.4s 0.05s ease-out forwards;
}
@keyframes draw-check {
  to { stroke-dashoffset: 0; }
}

/* Тряска при ошибке */
.animate-shake {
  animation: shake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}
@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-3px); }
  40%, 60% { transform: translateX(3px); }
}
</style>