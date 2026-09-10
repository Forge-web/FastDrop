<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'
import Navigate from '~/components/Navigate.vue'
import type { Database } from '~/types/database.types'

const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>()

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
  else {
    await reloadNuxtApp();
  }
  loading.value = false
}
</script>

<template>
  <div class="flex px-8">
    <div class="w-full space-y-8">

      <div v-if="!user">
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
            </div>
            <div>
              <label for="password" class="sr-only">Пароль</label>
              <BaseInput
                v-model="password" id="password" name="password" type="password"
                autocomplete="current-password" required
                placeholder="Password"
              />
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

      <div v-else class="flex justify-center">
        <Navigate 
          navigate-to-url="/me"
          text-button="Профиль"
        />
      </div>

    </div>
  </div>
</template>