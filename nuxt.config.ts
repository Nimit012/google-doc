// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    ['@pinia/nuxt', {
      autoImports: [
        'defineStore',
        ['defineStore', 'definePiniaStore'],
      ],
    }],
  ],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    // Server-side environment variables
    googleDriveProjectId: process.env.GOOGLE_DRIVE_PROJECT_ID,
    googleDrivePrivateKeyId: process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID,
    googleDrivePrivateKey: process.env.GOOGLE_DRIVE_PRIVATE_KEY,
    googleDriveClientEmail: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
    googleDriveClientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
    googleDriveClientCertUrl: process.env.GOOGLE_DRIVE_CLIENT_CERT_URL,
    googleDriveAdminEmail: process.env.GOOGLE_DRIVE_ADMIN_EMAIL,
    
    // Public variables that will be exposed to the client
    public: {
      googleClientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
      googleApiKey: process.env.GOOGLE_DRIVE_API_KEY,
    }
  },
  build: {
    transpile: ['@google-cloud/storage']
  },
  vite: {
    define: {
      'process.env': {},
      'process.versions': {},
      'process.browser': true
    },
    optimizeDeps: {
      include: ['document-management-service'],
      exclude: ['@google-cloud/storage']
    },
    ssr: {
      noExternal: ['document-management-service']
    },
    build: {
      rollupOptions: {
        external: ['util', 'crypto', 'stream', 'path', 'fs', 'http', 'https', 'zlib', 'buffer']
      }
    }
  },
  nitro: {
    externals: {
      inline: ['document-management-service']
    }
  }
})