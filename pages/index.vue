<template>
  <div class="home-page">
    <h2>List Summary:</h2>
    <div class="home-page__auth">
      <h3>Connect to TMDB to enable writing access for private lists:</h3>
      <TMDBAuthButton/>
    </div>
    <section class="home-page__strapi">
      <h3>Connect to Strapi providers:</h3>
      <p>{{ statusMessage }}</p>
      <div v-if="hasBackendUrl" class="home-page__strapi-actions">
        <button
            v-if="isLogged"
            class="logout-button"
            type="button"
            @click.prevent="logout"
        >
          Logout
        </button>
        <ul v-else class="provider-list">
          <li v-for="provider in providers" :key="provider">
            <a :href="`${backendUrl}/api/connect/${provider}`" class="provider-link">
              <button class="provider-button" type="button">
                Connect to {{ providerLabel(provider) }}
              </button>
            </a>
          </li>
        </ul>
      </div>
    </section>
    <LocaleSwitcher/>
  </div>
</template>

<script setup>
import TMDBAuthButton from "~/vue components/buttons/TMDBAuthButton.vue";
import LocaleSwitcher from "~/vue components/examples/LocaleSwitcher.vue";

const backendUrl = "http://localhost:1337";

const providers = [
  "discord",
  "facebook",
  "github",
  "google",
  "instagram",
  "linkedin",
  "reddit",
  "twitch",
  "twitter",
  "vk",
  "auth0"
];

const isLogged = ref(false);
const username = ref("");

const hasBackendUrl = computed(() => Boolean(backendUrl));

const statusMessage = computed(() => {
  if (!hasBackendUrl.value) {
    return "Backend URL is not configured. Please contact support.";
  }

  if (isLogged.value) {
    return `Welcome ${username.value || "user"}, you are connected!`;
  }

  return "You are not connected. Please log in.";
});

const providerLabel = (name) => name.charAt(0).toUpperCase() + name.slice(1);

const logout = () => {
  if (process.client) {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
  }
  isLogged.value = false;
  username.value = "";
};

onMounted(() => {
  if (!process.client) {
    return;
  }

  const storedJwt = localStorage.getItem("jwt");
  const storedUsername = localStorage.getItem("username") || "";

  isLogged.value = Boolean(storedJwt);
  username.value = storedUsername;
});
</script>

<style scoped>
.home-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;
}

.home-page__auth {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.home-page__strapi {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.home-page__strapi-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.logout-button {
  align-self: flex-start;
  padding: 0.5rem 1.25rem;
  background-color: #cc3344;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.logout-button:hover {
  background-color: #a52935;
}

.provider-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
}

.provider-link {
  text-decoration: none;
}

.provider-button {
  width: 150px;
  padding: 0.5rem 1rem;
  background-color: #0066cc;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.provider-button:hover {
  background-color: #004f99;
}
</style>