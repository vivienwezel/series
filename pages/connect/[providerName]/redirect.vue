<template>
  <p>{{ message }}</p>
</template>

<script setup>
const message = ref('Loading...')
const route = useRoute()
const router = useRouter()
const backendUrl = 'http://localhost:1337'

onMounted(async () => {
  const providerName = route.params.providerName
  const queryString = window.location.search || ''

  if (!providerName) {
    console.error('No provider name supplied in the route params.')
    message.value = 'No authentication provider specified.'
    return
  }

  try {
    const response = await fetch(`${backendUrl}/api/auth/${providerName}/callback${queryString}`)

    if (!response.ok) {
      throw new Error(`Couldn't login to Strapi. Status: ${response.status}`)
    }

    const data = await response.json()

    if (data.jwt) {
      localStorage.setItem('jwt', data.jwt)
    }

    if (data.user?.username) {
      localStorage.setItem('username', data.user.username)
    }

    message.value = 'You have been successfully logged in. You will be redirected in a few seconds...'

    setTimeout(() => {
      router.push('/')
    }, 3000)
  } catch (error) {
    console.error('Login redirect error:', error)
    message.value = 'An error occurred, please see the developer console.'
  }
})
</script>
