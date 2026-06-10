<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

const supabase = useSupabaseClient()
const email = ref('')
const first_name = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)

const signUp = async () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Пароли не совпадают'
    return
  }
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        first_name: first_name.value
      }
    }
  })
  if (error) errorMsg.value = error.message
  else successMsg.value = 'Регистрация успешна! Проверьте вашу почту для подтверждения.'
  loading.value = false
}
</script>

<template>
  <div class="flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-green-200/85">
          Создать аккаунт
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="signUp">
        <div class="rounded-md shadow-sm -space-y-px flex flex-col gap-8">
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <BaseInput 
				v-model="email" id="email-address" name="email" 
				type="email" autocomplete="email" required
				placeholder="Email"
			/>
          </div>
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <BaseInput
				v-model="first_name" id="first-name" name="first-name" 
				type="text" autocomplete="first_name" required
				placeholder="First Name"
			/>
          </div>
          <div>
            <label for="password" class="sr-only">Пароль</label>
            <BaseInput
				v-model="password" id="password" name="password" 
				type="password" autocomplete="new-password" required
				placeholder="Пароль"
			/>
          </div>
          <div>
            <label for="confirm-password" class="sr-only">Подтвердите пароль</label>
            <BaseInput
				v-model="confirmPassword" id="confirm-password" name="confirm-password" type="password"
				autocomplete="new-password" required placeholder="Подтвердите пароль"
			/>
          </div>
        </div>
        <div class="py-5">
			<BaseButton type="submit" :disabled="loading">
				Register
			</BaseButton>
        </div>
      </form>
      <p v-if="errorMsg" class="mt-2 text-center text-sm text-red-600">{{ errorMsg }}</p>
      <p v-if="successMsg" class="mt-2 text-center text-sm text-green-600">{{ successMsg }}</p>
    </div>
  </div>
</template>