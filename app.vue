<template>
  <div>
    <series-header/>
    <div v-if="hasBackendUrl">
      <NuxtPage/>
    </div>
    <section v-else class="backend-warning">
      <p>
        Please specify your backend url with the
        <a
            href="https://nuxt.com/docs/api/composables/use-runtime-config"
            rel="noopener noreferrer"
            target="_blank"
        >
          runtime configuration
        </a>
        entry:<br/>
        <strong>runtimeConfig.public.backendUrl</strong>.<br/><br/>
        For example, launch this app with:<br/>
        <code>NITRO_PUBLIC_backendUrl=http://localhost:1337 npm run dev</code>
      </p>
    </section>
  </div>
</template>

<script setup>
import SeriesHeader from "~/vue components/header/SeriesHeader.vue";

const backendUrl = "http://localhost:1337";
const hasBackendUrl = computed(() => Boolean(backendUrl));
</script>

<style scoped>
.backend-warning {
  margin: 2rem auto;
  max-width: 40rem;
  padding: 1.5rem;
  border: 1px solid #f5a623;
  border-radius: 0.5rem;
  background-color: #fff6e5;
  line-height: 1.6;
}

.backend-warning a {
  color: #0066cc;
  text-decoration: underline;
}

.backend-warning code {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #f0f0f0;
  border-radius: 0.25rem;
  font-family: "Courier New", Courier, monospace;
}
</style>
