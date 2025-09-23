export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Add nuxt-mongoose to modules
  modules: [
    // 'nuxt-mongoose',
    '@nuxtjs/tailwindcss'
  ],
  
  // Runtime configuration for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    mongodbUri: process.env.MONGODB_URI,
    
    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3000'
    }
  },
  
})