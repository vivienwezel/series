<template>
  <div class="tmdb-auth">
    <button
        v-if="!isAuthenticated"
        :disabled="loading"
        class="auth-button"
        @click="startAuthentication"
    >
      {{ loading ? 'Processing...' : 'Connect TMDB Account' }}
    </button>
    <div v-else class="auth-status">
      <span>Connected to TMDB</span>
      <button class="logout-button" @click="logout">Disconnect</button>
    </div>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
const loading = ref(false)
const errorMessage = ref('')
const isAuthenticated = ref(false)

onMounted(() => {
  // Check if user is already authenticated
  const accessToken = localStorage.getItem('tmdb_access_token')
  isAuthenticated.value = !!accessToken
})

const startAuthentication = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    // Step 1: Get request token from your API
    const response = await $fetch('/api/auth/createRequestToken', {
      method: 'POST',
      body: {
        redirect_to: `${window.location.origin}/auth/callback`
      }
    })

    if (response.success && response.auth_url) {
      // Store the request token before redirecting (TMDB doesn't send it back in URL)
      localStorage.setItem('tmdb_pending_request_token', response.request_token)

      // Step 2: Redirect user to TMDB to authorize
      window.location.href = response.auth_url
    } else {
      errorMessage.value = response.error || 'Failed to start authentication'
      loading.value = false
    }
  } catch (err) {
    console.error('Authentication error:', err)
    errorMessage.value = 'An error occurred. Please try again.'
    loading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('tmdb_access_token')
  localStorage.removeItem('tmdb_account_id')
  isAuthenticated.value = false
}
</script>

<style scoped>
.tmdb-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.auth-button, .logout-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.auth-button {
  background-color: var(--lighter-blue);
  color: var(--grey);
  font-weight: 600;
}

.auth-button:hover:not(:disabled) {
  background-color: #0198c3;
  transform: translateY(-1px);
}

.auth-button:disabled {
  background-color: var(--grey);
  cursor: not-allowed;
}

.auth-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: var(--success-light-green);
  border-radius: 0.25rem;
}

.auth-status span {
  color: var(--success-green);
  font-weight: 600;
}

.logout-button {
  background-color: #f44336;
  color: white;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

.logout-button:hover {
  background-color: var(--error-red);
}

.error-message {
  color: var(--error-red);
  font-size: 0.875rem;
  margin: 0;
}
</style>
