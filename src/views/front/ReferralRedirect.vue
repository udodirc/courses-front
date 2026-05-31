<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from "@/api/index.js";

const route = useRoute()
const router = useRouter()

const loading = ref(false)

onMounted(async () => {
  loading.value = true

  let referral = route.params.login

  if (!referral) {
    return router.replace('/')
  }

  try {
    const response = await api.post('/check-login', {
      login: referral
    })

    if (!response.data?.[0]) {
      referral = 'admin'
    }

  } catch (e) {
    referral = 'admin'
  }

  // сохраняем referral
  document.cookie =
      `referral=${referral}; path=/; max-age=2592000; Secure; SameSite=Lax`

  localStorage.setItem('referral', referral)

  loading.value = false

  router.replace('/')
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <p v-if="loading">
        Проверяем реферальную ссылку...
      </p>
    </div>
  </div>
</template>