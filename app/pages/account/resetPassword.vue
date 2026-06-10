<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue';
import BaseInput from '~/components/BaseInput.vue';

const supabase = useSupabaseClient()

const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)


const resetPassword = async () => {
  loading.value = true;
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Пароли не совпадают'
    return
  }

  await supabase.auth.updateUser({password: password.value})
  successMsg.value = "Пароль был изменен"
  
}

</script>

<template>

<div class="flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-green-200/85">
          Новый пароль
        </h2>
      </div>
	  <form class="mt-8 space-y-6" @submit.prevent="resetPassword">
      <BaseInput
				v-model="password" id="password" name="password" 
				type="password" required
				placeholder="Пароль"
			/>
      <BaseInput
				v-model="confirmPassword" id="confirm-password" name="confirm-password" 
        type="password" required placeholder="Подтвердите пароль"
			/>
      <BaseButton type="submit" :disabled="loading">
        Обновить
      </BaseButton>
	  </form>
    <div>
      <p v-if="errorMsg" class="mt-2 text-center text-sm text-red-600">{{ errorMsg }}</p>
      <p v-if="successMsg" class="mt-2 text-center text-sm text-green-600">{{ successMsg }}</p>
    </div>
	</div>
</div>

</template>