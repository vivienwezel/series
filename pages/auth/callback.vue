<template>
  <div class="auth-callback">
    <div v-if="loading" class="status-message">
      <h2>Authenticating...</h2>
      <p>Please wait while we complete your authentication.</p>
    </div>
    <div v-else-if="error" class="status-message error">
      <h2>Authentication Failed</h2>
      <p>{{ error }}</p>
      <button @click="goHome">Return to Home</button>
    </div>
    <div v-else-if="success" class="status-message success">
      <h2>Authentication Successful!</h2>
      <p>Your account has been connected.</p>
      <button @click="goHome">Return to Home</button>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref(null)
const success = ref(false)

onMounted(async () => {
  // TMDB doesn't send the request_token back in the URL
  // We need to retrieve it from localStorage where we stored it before redirecting
  const requestToken = localStorage.getItem('tmdb_pending_request_token')

  if (!requestToken) {
    error.value = 'No pending authentication found. Please try connecting again.'
    loading.value = false
    return
  }

  // Check if user denied the request (TMDB might send this as a query param)
  const approved = route.query.approved
  if (approved === 'false') {
    localStorage.removeItem('tmdb_pending_request_token')
    error.value = 'Authentication was denied. Please try again and approve the request.'
    loading.value = false
    return
  }

  try {
    // Exchange the request token for an access token
    const response = await $fetch('/api/createAccessToken', {
      method: 'POST',
      body: {
        request_token: requestToken
      }
    })

    if (response.success && response.access_token) {
      // Store the access token (you can use localStorage, cookies, or a store)
      localStorage.setItem('tmdb_access_token', response.access_token)
      localStorage.setItem('tmdb_account_id', response.account_id)
      
      // Clean up the pending request token
      localStorage.removeItem('tmdb_pending_request_token')
      
      success.value = true
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      error.value = response.error || 'Failed to complete authentication'
      localStorage.removeItem('tmdb_pending_request_token')
    }
  } catch (err) {
    console.error('Authentication error:', err)
    error.value = 'An error occurred during authentication'
    localStorage.removeItem('tmdb_pending_request_token')
  } finally {
    loading.value = false
  }
})

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.auth-callback {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1.25rem;
}

.status-message {
  text-align: center;
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: #f5f5f5;
  max-width: 30rem;
}

.status-message h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.status-message p {
  margin-bottom: 1.5rem;
  color: #666;
}

.status-message.error {
  background-color: #fee;
  border: 1px solid #fcc;
}

.status-message.error h2 {
  color: #c33;
}

.status-message.success {
  background-color: #efe;
  border: 1px solid #cfc;
}

.status-message.success h2 {
  color: #3c3;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #0052a3;
}
</style>
