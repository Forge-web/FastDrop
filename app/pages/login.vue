<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const signIn = async () => {
  loading.value = true
  errorMsg.value = ''
  
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) errorMsg.value = error.message
  else await navigateTo('/dashboard') // Перенаправление в защищённую зону
  loading.value = false
}
</script>

<template>
  <div class="flex px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-green-200/80">
          Вход в аккаунт
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="signIn">
        <div class="rounded-md shadow-sm -space-y-px flex flex-col gap-5">
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <BaseInput
              v-model="email" id="email-address" name="email" type="email"
              required placeholder="Email"
              
            />
            
            <!-- <input v-model="email" id="email-address" name="email" type="email" autocomplete="email" required
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   placeholder="Email"> -->
          </div>
          <div>
            <label for="password" class="sr-only">Пароль</label>
            <BaseInput
              v-model="password" id="password" name="password" type="password"
              autocomplete="current-password" required
              placeholder="Password"
            />
            <!-- <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   placeholder="Пароль"> -->
          </div>
        </div>
        <div>
          <BaseButton type="submit" :disabled="loading">
            Войти
          </BaseButton>    
        </div>
      </form>
      <p v-if="errorMsg" class="mt-2 text-center text-sm text-red-600">{{ errorMsg }}</p>
      <div class="flex flex-col">
        <p class="mt-2 text-center text-sm text-gray-400">
          Нет аккаунта?
          <NuxtLink to="/register" class="font-medium text-green-200">Зарегистрируйтесь</NuxtLink>
        </p>
        <p class="mt-2 text-center text-sm text-gray-400">
          Забыли пароль?
          <NuxtLink to="/forgotPassword" class="font-medium text-green-200">Восстановить пароль</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>