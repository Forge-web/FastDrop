<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue';
import BaseInput from '~/components/BaseInput.vue';


const config = useRuntimeConfig();
const supabase = useSupabaseClient()

const email = ref('');

const loading = ref(false);

const forgotPassword = async () => {
	supabase.auth.resetPasswordForEmail(email.value, {
		redirectTo: `${config.public.baseUrl}/account/resetPassword`
	})
}

</script>

<template>

	<div class="flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-green-200/85">
          Забыли пароль
        </h2>
      </div>
	  <form class="mt-8 space-y-6" @submit.prevent="forgotPassword">
		<BaseInput v-model="email" required placeholder="Email"/>
		<BaseButton type="submit" :disabled="loading">
			Восстановить
		</BaseButton>
	  </form>
	</div>
</div>

</template>