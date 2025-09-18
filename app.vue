<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-xl font-semibold text-gray-900">
              Dashboard
            </NuxtLink>
            <div class="flex space-x-4">
              <NuxtLink 
                to="/author" 
                class="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Author View
              </NuxtLink>
              <NuxtLink 
                to="/student" 
                class="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Student View
              </NuxtLink>
              <NuxtLink 
                to="/teacher" 
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Teacher View
              </NuxtLink>
            </div>
          </div>
          <div>
            <button 
              @click="resetFlow" 
              class="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
const { resetFlow } = useTaskFlow()
</script>